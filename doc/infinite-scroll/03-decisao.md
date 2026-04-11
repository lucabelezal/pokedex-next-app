# 03 — Decisão (ADR)

## Architecture Decision Record: Scroll Infinito

**Data**: Abril 2026
**Status**: Aceito
**Autores**: Engenharia Frontend

---

### Contexto

A tela de Pokédex renderiza um catálogo de 905 itens via `force-static` no
Next.js App Router. Os dados chegam como prop ao componente cliente e são
filtrados/ordenados em memória via `usePokedexFilters`. O app é entregue como
PWA em WebView nativo (iOS WKWebView / Android WebView baseado em Chromium).

Sem paginação, o React monta todos os cards no DOM simultaneamente, gerando:
- ~7.240 nós no DOM
- ~60MB de memória estimada em WebView
- Total Blocking Time (TBT) de ~160ms em dispositivos mid-range
- Risco de OOM crash em Android com < 3GB RAM

---

### Opções consideradas

| Opção | Descartada por |
|---|---|
| Render tudo | Causa o problema descrito above |
| Paginação clássica | Fricção desnecessária em catálogo de exploração mobile |
| Load More manual | Interrompe o fluxo de scroll nativo |
| **Infinite Scroll + IO** | **← ESCOLHIDA** |
| Virtualização | Complexidade alta; ROI baixo para 905 itens sem altura fixa |
| React Query infinite | Over-engineering; dados locais não precisam de fetch |

---

### Decisão

**Implementar scroll infinito com `IntersectionObserver` nativo e slice
client-side do array filtrado.**

Hook criado: `src/hooks/use-infinite-scroll.ts`

```
useInfiniteScroll<T>(items: T[], options?)
  ↓
  page: number        (estado interno, começa em 1)
  visibleItems: T[]   (items.slice(0, page × pageSize))
  hasMore: boolean    (visibleItems.length < items.length)
  sentinelRef         (ref para o div sentinel)
```

Quando `items` muda (novo filtro aplicado pelo usuário), o hook:
1. Reseta `page` para `1`
2. Chama `window.scrollTo({ top: 0, behavior: "instant" })`

Isso garante que o usuário sempre inicia uma nova exploração do topo —
comportamento padrão em Instagram, TikTok, App Store e Google Play.

---

### Consequências

**Positivas**:
- DOM máximo de ~160 nós (20 cards × 8 nós) vs. ~7.240 anterior
- TBT esperado: < 20ms (melhora de ~87%)
- Zero dependências adicionais — bundle inalterado
- `usePokedexFilters` permanece intocado (separação clara de responsabilidades)
- IntersectionObserver é 100% passivo: não bloqueia o thread principal

**Negativas / Trade-offs aceitos**:
- Usuário não pode "voltar" a uma posição exata após navegar para detalhe
  (mitigação: botão Voltar restaura a página anterior via historia do browser)
- `cmd+F` / busca do browser não encontra itens não renderizados
  (mitigação: há campo de busca próprio no componente)
- Scroll reseta ao trocar filtros (comportamento intencional, documentado)

---

### Critérios de aceite

- [ ] `npm run type-check` passa sem erros
- [ ] `npm run build` gera build estático com sucesso
- [ ] DOM nodes < 200 após carregamento inicial (DevTools Memory)
- [ ] Trocar filtro → lista reseta para primeiros 20 itens
- [ ] Scroll até o fim → todos os 905 Pokémon são carregados
- [ ] Spinner visível durante carregamento do próximo lote
- [ ] Mensagem "Você viu todos os Pokémon" ao chegar no fim

---

### Revisão futura

Esta decisão deve ser revisitada se:
- O catálogo crescer para 5.000+ itens (considerar virtualização)
- Cards ficarem significativamente mais pesados (HTML/JS por card)
- Um backend real for implementado (migrar para React Query `useInfiniteQuery`)
- Memory pressure reports dos usuários indicarem problemas em low-end

→ Próximo: [04-arquitetura.md](./04-arquitetura.md)

---

## ADR 2 — Fonte de dados em runtime: JSON local

**Data**: Abril 2026
**Status**: Aceito

---

### Contexto

Após a integração com a PokéAPI, as páginas Next.js passaram a importar
`pokeapi-service.ts` em runtime. Em `next dev`, `force-static` é ignorado
— cada navegação dispara ~4.500 requests à PokeAPI, tornando o app
inutilizável durante o desenvolvimento.

O arquivo `src/data/mocks/pokemon-catalog.json` já contém todos os campos
necessários (incluindo descrição, cadeia de evolução, peso, altura, fraquezas),
gerados pelo `pokeapi-service.ts` + `pokeapi-mappers.ts` durante o build.

---

### Decisão

**Todas as páginas em runtime importam exclusivamente `pokedex-service.ts`,
que lê do JSON local. `pokeapi-service.ts` é usado apenas em build-time.**

Arquivos alterados (import substituído de `@/lib/pokedex-service` para
`@/lib/pokeapi-service`):

- `src/app/pokedex/page.tsx`
- `src/app/favorites/page.tsx`
- `src/app/regions/page.tsx`
- `src/app/regions/[key]/page.tsx`
- `src/app/pokedex/[id]/page.tsx`

---

### Consequências

**Positivas**:
- Dados sempre frescos da PokéAPI — sem JSON desatualizado no repositório
- `pokedex-service.ts` fica responsável apenas por dados verdadeiramente estáticos (appConfig, regiões)
- Separação clara: o que é configuração (JSON local) vs. o que é dado de domínio (PokéAPI)

**Negativas / Trade-offs aceitos**:
- Primeira navegação em dev é lenta (requests reais à PokéAPI)
  — mitigado pelo ADR 4 (`unstable_cache` — ver abaixo)
- Em produção, `npm run build` gera SSG: cada página é gerada uma vez,
  e o HTML estático é servido sem requests em runtime

---

## ADR 3 — Offline-first com Service Worker

**Data**: Abril 2026
**Status**: Aceito

---

### Contexto

O app é entregue como PWA em WebView nativo. O `manifest.webmanifest`
já está configurado com `display: "standalone"` e ícones. Faltava a
camada de cache que garante funcionamento offline.

---

### Decisão

**Adicionar Service Worker via `@ducanh2912/next-pwa` com estratégias de
cache por tipo de recurso:**

| Recurso | Estratégia | Justificativa |
|---|---|---|
| `/_next/static/**` | CacheFirst | Nomes hashed = imutáveis |
| `/assets/**` | CacheFirst | Assets locais raramente mudam |
| `raw.githubusercontent.com/PokeAPI/sprites/**` | CacheFirst | Sprites não mudam para Pokémon existentes |
| `/api/**` | NetworkFirst | Respostas podem mudar; cache é fallback |
| Navegação (HTML) | Padrão next-pwa | StaleWhileRevalidate |

Desativado em `NODE_ENV === "development"` para não interferir no hot-reload.

---

### Consequências

**Positivas**:
- Segunda visita carrega instantaneamente (Service Worker intercepta antes da rede)
- Funciona offline — HTML e dados serializado no SSG + assets em cache
- Cache de sprites elimina o piscar de imagens em redes lentas
- `next-pwa` gera o Service Worker automaticamente via Workbox; sem código manual

**Negativas / Trade-offs aceitos**:
- `public/sw.js` e `public/workbox-*.js` são gerados no build — devem ser
  adicionados ao `.gitignore` ou comitados (recomendado: gitignore)
- Cache stale pode mostrar versão antiga por até ~1 ciclo de visita
  (mitigação: `reloadOnOnline: true` força recarga quando a conexão volta)

---

## ADR 4 — Cache de servidor entre requests com `unstable_cache`

**Data**: Abril 2026  
**Status**: Aceito

---

### Contexto

Com a integração real à PokéAPI (ADR 2 revisado), cada navegação dispara
requests HTTP. Em `next dev`, o Next.js 15 desabilita o Data Cache por
padrão para garantir hot-reload com dados frescos. O `React.cache()` que
estava em uso deduplica chamadas apenas dentro do **mesmo request** — ao
navegar para outra tela e voltar, todos os dados são buscados do zero.

Resultado observável: indicador "rendering" em cada troca de tela,
incluindo o botão Voltar da tela de detalhe.

---

### Raiz do problema

```
Navegação A → /pokedex
  React.cache() válido ────────────────────────────────────────────┐
  buildPokemonCatalogItem(1..905) × 4 requests cada                │
                                                                    │ request encerra
Navegação B → /pokedex/[id]                                        │
  cache anterior descartado ◄─────────────────────────────────────┘
  buildPokemonCatalogItem(id) × 4 requests novos

Navegação C → Voltar
  cache anterior descartado novamente
  getPokemonCatalog() → 905 × 4 requests do zero
```

---

### Opções consideradas

| Opção | Descartada por |
|---|---|
| `React.cache()` (anterior) | Escopo limitado ao request — não persiste entre navegações |
| `localStorage` / `sessionStorage` | Apenas Client; Server Components não têm acesso |
| TanStack Query / SWR | Over-engineering; não funciona em Server Components sem adapters |
| Redis / cache externo | Infra adicional; desnecessário para dados que mudam raramente |
| **`unstable_cache` (next/cache)** | **← ESCOLHIDA** |

---

### Decisão

**Usar `unstable_cache` do `next/cache` em dois níveis:**

```ts
// Nível 1: por Pokémon individual — populado ao buscar o catálogo,
//           reutilizado por getPokemonById e fetchInBatches
const getCachedPokemonItem = unstable_cache(
  (id: number) => buildPokemonCatalogItem(id),
  ["pokemon-item"],
  { revalidate: 3600 },
);

// Nível 2: catálogo completo — segunda visita a /pokedex é instantânea
export const getPokemonCatalog = unstable_cache(
  async () => fetchInBatches(ids),
  ["pokemon-catalog"],
  { revalidate: 3600 },
);
```

O `React.cache()` foi removido — `unstable_cache` cobre o mesmo escopo
mais persistência entre requests.

---

### Como funciona

```
PROCESSO NODE.JS (next dev ou next start)

  ┌──────────────────────────────────────────────────────┐
  │  Next.js Data Cache (unstable_cache store)           │
  │                                                      │
  │  "pokemon-item:1"    → PokemonCatalogItem (TTL: 1h) │
  │  "pokemon-item:2"    → PokemonCatalogItem (TTL: 1h) │
  │  ...                                                 │
  │  "pokemon-catalog"   → PokemonCatalogItem[] (TTL: 1h)│
  │                                                      │
  └──────────────────────────────────────────────────────┘
         ↑                          ↑
  Navegação A popula          Navegações B, C, D, ...
  (lenta: ~20-60s)            são instantâneas (hit de cache)
```

`getPokemonByRegion("kanto")` também se beneficia: IDs 1–151 já estão
no cache após a primeira visita ao catálogo completo.

---

### Consequências

**Positivas**:
- Segunda navegação para qualquer tela é instantânea
- Zero dependências adicionais — `unstable_cache` é parte do Next.js
- Comportamento consistente em dev e produção
- `getPokemonByRegion` beneficia do aquecimento do catálogo

**Negativas / Trade-offs aceitos**:
- Primeira navegação em dev continua lenta (~20-60s para catálogo completo)
  — comportamento esperado; em `npm run build` isso ocorre uma única vez
- `unstable_cache` ainda carrega "unstable" no nome — API pública desde
  Next.js 14, mas monitorar changelogs em upgrades
- TTL de 1h: dados atualizados na PokéAPI só aparecem após expiração
  (aceitável — novos Pokémon são raros e não críticos em produção)

→ Próximo: [04-arquitetura.md](./04-arquitetura.md)
