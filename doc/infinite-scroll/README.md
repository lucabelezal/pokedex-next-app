# Scroll Infinito — Guia de Engenharia

> **TL;DR**: Catálogo com 905 Pokémon renderizando tudo no DOM causaria ~7.240 nós,
> ~60MB de memória e jank visível em WebViews de dispositivos low-end. A solução
> adotada usa `IntersectionObserver` nativo para expor lotes de 20 itens por vez,
> sem dependências externas, com reset automático de scroll ao trocar filtros.
> Esta documentação cobre o problema, todas as alternativas avaliadas, a decisão
> arquitetural justificada, o design de API para quando houver backend, como a
> stack WebView + React + Next.js funciona, e prompts prontos para replicar em
> outros projetos.

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
- **Dados**: JSON estático em memória (~905 Pokémon), sem API/backend
- **Entrega**: PWA servida em WebView nativo (iOS/Android)
- **Filtros existentes**: busca por nome/ID, tipo, 4 opções de ordenação
- **Dependências adicionais instaladas**: nenhuma

---

## Decisão Resumida

**IntersectionObserver nativo + client-side slice** do array filtrado.

Sem libs externas. Dados já em memória. Funciona com todos os filtros.
Scroll reseta ao topo automaticamente ao trocar filtros — padrão big tech mobile.

Para projetos com **API real**, ver [05-api-design.md](./05-api-design.md) e
[09-stack.md](./09-stack.md) para a evolução arquitetural recomendada.
