# Scroll Infinito — Guia de Engenharia

> **TL;DR**: Três problemas independentes foram identificados e resolvidos:
>
> **1. DOM gigante** — 905 Pokémon no DOM causaria ~7.240 nós, ~60MB de memória
> e jank visível em WebViews de dispositivos low-end. Solução: `IntersectionObserver`
> nativo expondo lotes de 20 itens, sem dependências externas.
>
> **2. Cache entre navegações** — páginas usam `pokeapi-service.ts` em runtime
> (integração real com a PokéAPI). Em `next dev`, o Data Cache do Next.js 15 está
> desabilitado, então `React.cache()` — que dedup apenas dentro de um request —
> não impedia que cada navegação refizesse todos os requests. Solução: `unstable_cache`
> do `next/cache`, que persiste dados no processo Node.js entre requests. Primeira
> navegação é lenta (requests reais); todas as seguintes são instantâneas.
>
> **3. Offline-First** — Service Worker via `@ducanh2912/next-pwa` com estratégias
> de cache por recurso (CacheFirst para assets, NetworkFirst para API). Segunda
> visita serve 100% do cache local; app funciona sem internet.
>
> Esta documentação cobre o problema de DOM, as alternativas de renderização e
> de fonte de dados, as decisões arquiteturais (3 ADRs), os 10 problemas clássicos
> de gestão de dados mapeados ao projeto, performance, UX, testes e a stack completa.

---

## Índice de Navegação

| # | Documento | Descrição |
|---|-----------|-----------|
| 01 | [Problema](./01-problema.md) | Por que renderizar tudo quebra no mobile |
| 02 | [Abordagens](./02-abordagens.md) | Todas as alternativas com tradeoffs |
| 03 | [Decisão (ADR)](./03-decisao.md) | Architecture Decision Record formal |
| 04 | [Arquitetura](./04-arquitetura.md) | Camadas, fluxo e diagramas |
| 05 | [API Design](./05-api-design.md) | Design de API REST paginada para escala |
| 06 | [Performance](./06-performance.md) | Frame budget, memória, WebView specifics |
| 07 | [UX](./07-ux.md) | Comportamento mobile, acessibilidade |
| 08 | [Testes](./08-testes.md) | Estratégia de testes com mock de IO |
| 09 | [Stack](./09-stack.md) | Como WebView + React + Next.js trabalham |
| 10 | [Prompts](./10-prompts.md) | Prompts prontos para Devin e Copilot |

---

## Contexto do Projeto

- **Stack**: Next.js 16 (React 19) + Tailwind v4 + TypeScript
- **Dados em runtime**: `pokeapi-service.ts` → requests reais à PokéAPI, cacheados com `unstable_cache` (1h TTL)
- **Cache servidor**: `unstable_cache` persiste entre navegações no processo Node.js (dev + prod)
- **Dados estáticos**: `pokedex-service.ts` → JSON local (appConfig, regiões) — não muda entre builds
- **Entrega**: PWA servida em WebView nativo (iOS/Android)
- **Offline-first**: Service Worker via `@ducanh2912/next-pwa` (Workbox)
- **Filtros existentes**: busca por nome/ID, tipo, 4 opções de ordenação
- **Dependências adicionadas**: `@ducanh2912/next-pwa`

---

## Decisão Resumida

**IntersectionObserver nativo + client-side slice** do array filtrado — resolve o DOM.

**`pokedex-service.ts` + JSON local** — resolve o N+1 em runtime (dados em RAM, sem network).

**Service Worker (Workbox)** — resolve o offline-first (cache de HTML/JS/assets no device).

Sem libs de UI extras. Scroll reseta ao topo ao trocar filtros — padrão big tech mobile.

Para projetos com **API real**, ver [05-api-design.md](./05-api-design.md) e
[09-stack.md](./09-stack.md) para a evolução arquitetural recomendada.
