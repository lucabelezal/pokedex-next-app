# 04 — Arquitetura

## Camadas, fluxo de dados e diagramas

---

### Visão geral das camadas

```
┌──────────────────────────────────────────────────────────────┐
│  BUILD TIME (next build)                                     │
│                                                              │
│  pokemon-catalog.json ──> page.tsx (force-static)           │
│  app-config.json      ──> HTML + JS chunks gerados          │
│  regions.json                                                │
└──────────────────────────────┬───────────────────────────────┘
                               │ deploy
┌──────────────────────────────▼───────────────────────────────┐
│  CDN (Vercel Edge / Cloudflare)                              │
│                                                              │
│  /_next/static/chunks/   (JS)                                │
│  /index.html             (HTML pré-renderizado)              │
└──────────────────────────────┬───────────────────────────────┘
                               │ HTTP GET
┌──────────────────────────────▼───────────────────────────────┐
│  Native App (iOS / Android)                                  │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  WKWebView / Android WebView (Chromium)                │  │
│  │  ┌──────────────────────────────────────────────────┐  │  │
│  │  │  Next.js App Router                              │  │  │
│  │  │  ┌────────────────────────────────────────────┐  │  │  │
│  │  │  │  PokedexListClient (Client Component)      │  │  │  │
│  │  │  │                                            │  │  │  │
│  │  │  │  usePokedexFilters(initialCatalog)         │  │  │  │
│  │  │  │    └─ filtered: PokemonCatalogItem[]       │  │  │  │
│  │  │  │         │                                  │  │  │  │
│  │  │  │  useInfiniteScroll(filtered)               │  │  │  │
│  │  │  │    └─ visibleItems: T[] (slice de 20)      │  │  │  │
│  │  │  │    └─ hasMore: boolean                     │  │  │  │
│  │  │  │    └─ sentinelRef: RefObject               │  │  │  │
│  │  │  │         │                                  │  │  │  │
│  │  │  │  DOM: ~160 nós (20 cards)                  │  │  │  │
│  │  │  │  <div ref={sentinelRef} />                 │  │  │  │
│  │  │  │         │                                  │  │  │  │
│  │  │  │  IntersectionObserver                      │  │  │  │
│  │  │  │    └─ rootMargin: "200px"                  │  │  │  │
│  │  │  │    └─ dispara loadMore() → page++          │  │  │  │
│  │  │  └────────────────────────────────────────────┘  │  │  │
│  │  └──────────────────────────────────────────────────┘  │  │
│  └────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
```

---

### Fluxo de dados completo

```
1. npm run build
   ├─ page.tsx executa getAppConfig(), getPokemonCatalog(), getAvailableTypeFilters()
   ├─ Serializa os 905 itens como props no HTML estático
   └─ Gera _next/static/chunks/

2. Usuário abre o app
   ├─ WebView carrega HTML (FCP imediato — SSG)
   ├─ Hidrata o JS (React 19 concurrent)
   └─ PokedexListClient recebe initialCatalog[905]

3. Estado inicial
   ├─ usePokedexFilters: filtered = todos os 905 (sem filtro)
   ├─ useInfiniteScroll: page=1, visibleItems = filtered.slice(0, 20)
   └─ DOM: 20 PokemonCard + 1 sentinel div

4. Usuário scrollia para baixo
   ├─ IntersectionObserver detecta sentinel a 200px antes do fim
   ├─ loadMore() → setPage(2)
   ├─ React re-renderiza: visibleItems = filtered.slice(0, 40)
   └─ DOM cresce para 40 + sentinel

5. Usuário aplica filtro (ex: tipo "fogo")
   ├─ usePokedexFilters: filtered = [52 pokémon de fogo]
   ├─ useInfiniteScroll useEffect([items]) detecta nova referência
   ├─ setPage(1) + window.scrollTo({ top: 0, behavior: "instant" })
   ├─ visibleItems = filtered.slice(0, 20)  ← primeiros 20 de fogo
   └─ DOM: 20 cards + sentinel (se filtered.length > 20)
      OU 52 cards + mensagem fim (se filtered.length <= 20)

6. Scroll completo
   ├─ hasMore = false (visibleItems.length === items.length)
   ├─ sentinel não é renderizado
   └─ "Você viu todos os Pokémon" aparece
```

---

### Separação de responsabilidades

```
┌─────────────────────────────────────────────────────────┐
│  usePokedexFilters                                      │
│  Responsabilidade: FILTRAR e ORDENAR                    │
│  Input:  initialCatalog[], query, type, sort            │
│  Output: filtered[]                                     │
│  Estado: query, type, sort                              │
│  Não sabe nada sobre paginação ✓                        │
└─────────────────────────────┬───────────────────────────┘
                              │ filtered[]
┌─────────────────────────────▼───────────────────────────┐
│  useInfiniteScroll                                      │
│  Responsabilidade: PAGINAR e OBSERVAR                   │
│  Input:  items[], pageSize, rootMargin                  │
│  Output: visibleItems[], hasMore, sentinelRef           │
│  Estado: page                                           │
│  Não sabe nada sobre filtros ✓                          │
└─────────────────────────────┬───────────────────────────┘
                              │ visibleItems[], sentinelRef
┌─────────────────────────────▼───────────────────────────┐
│  PokedexListClient                                      │
│  Responsabilidade: RENDERIZAR e COMPOR                  │
│  Conecta os dois hooks                                  │
│  Gerencia UI (sentinel, spinner, fim de lista)          │
└─────────────────────────────────────────────────────────┘
```

---

### Arquivos envolvidos

```
src/
├── hooks/
│   ├── use-pokedex-filters.ts    (inalterado)
│   └── use-infinite-scroll.ts   (NOVO)
├── components/
│   └── pokedex-list-client.tsx  (MODIFICADO: +useInfiniteScroll, +sentinel)
└── lib/
    └── pokedex-service.ts        (inalterado)
```

→ Próximo: [05-api-design.md](./05-api-design.md)
