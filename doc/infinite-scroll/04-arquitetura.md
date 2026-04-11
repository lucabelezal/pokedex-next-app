# 04 — Arquitetura

## Camadas, fluxo de dados e diagramas

---

### Visão geral das camadas

```
┌──────────────────────────────────────────────────────────────┐
│  BUILD TIME (next build)                                     │
│                                                              │
│  PokéAPI (pokeapi.co/api/v2)                                 │
│    └─ pokeapi-client.ts  (fetch + cache revalidate:86400)    │
│    └─ pokeapi-mappers.ts (raw → PokemonCatalogItem)          │
│    └─ pokeapi-service.ts ──> pokemon-catalog.json (seed)    │
│                                                              │
│  Dados estáticos (JSON local)                                │
│    app-config.json    ──> getAppConfig()                     │
│    regions.json       ──> getRegionsCatalog()                │
│    user-profile.json  ──> getUserProfile()                   │
│    type-metadata.ts   ──> getAvailableTypeFilters()          │
│    pokemon-catalog.json ─> getPokemonCatalog() [seeded]      │
└──────────────────────────────┬───────────────────────────────┘
                               │ deploy
┌──────────────────────────────▼───────────────────────────────┐
│  CDN (Vercel Edge / Cloudflare)                              │
│                                                              │
│  /_next/static/chunks/   (JS)                                │
│  /index.html             (HTML pré-renderizado)              │
│  /sw.js                  (Service Worker gerado por next-pwa)│
└──────────────────────────────┬───────────────────────────────┘
                               │ HTTP GET
┌──────────────────────────────▼───────────────────────────────┐
│  Native App (iOS / Android)                                  │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  WKWebView / Android WebView (Chromium)                │  │
│  │  ┌──────────────────────────────────────────────────┐  │  │
│  │  │  Service Worker (sw.js — Workbox)                │  │  │
│  │  │                                                  │  │  │
│  │  │  Cache API                                       │  │  │
│  │  │  ├─ next-static     (CacheFirst, 1 ano)          │  │  │
│  │  │  ├─ pokemon-images  (CacheFirst, 30 dias)        │  │  │
│  │  │  ├─ app-assets      (CacheFirst, 7 dias)         │  │  │
│  │  │  └─ api-routes      (NetworkFirst, 1 dia)        │  │  │
│  │  └──────────┬───────────────────────────────────────┘  │  │
│  │             │ intercepta requests HTTP                  │  │
│  │  ┌──────────▼───────────────────────────────────────┐  │  │
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
   ├─ getPokemonCatalog() → lê pokemon-catalog.json (já populado)
   │    ← pokeapi-service.ts + pokeapi-mappers.ts foram usados para GERAR o JSON
   ├─ Serializa os 905 itens como props no HTML estático
   └─ Gera _next/static/chunks/ + public/sw.js (Service Worker)

2. Usuário abre o app (primeira visita)
   ├─ WebView carrega HTML (FCP imediato — SSG)
   ├─ Hidrata o JS (React 19 concurrent)
   ├─ Service Worker se registra e faz cache de assets
   └─ PokedexListClient recebe initialCatalog[905]

3. Usuário abre o app (visitas seguintes)
   ├─ Service Worker intercepta requests
   ├─ HTML → cache HIT → resposta imediata (sem CDN)
   ├─ JS/CSS → CacheFirst → sem download adicional
   └─ Sprites → CacheFirst → imagens carregam offline

4. Estado inicial na tela
   ├─ usePokedexFilters: filtered = todos os 905 (sem filtro)
   ├─ useInfiniteScroll: page=1, visibleItems = filtered.slice(0, 20)
   └─ DOM: 20 PokemonCard + 1 sentinel div

5. Usuário scrollia para baixo
   ├─ IntersectionObserver detecta sentinel a 200px antes do fim
   ├─ loadMore() → setPage(2)
   ├─ React re-renderiza: visibleItems = filtered.slice(0, 40)
   └─ DOM cresce para 40 + sentinel

6. Usuário aplica filtro (ex: tipo "fogo")
   ├─ usePokedexFilters: filtered = [52 pokémon de fogo]
   ├─ useInfiniteScroll useEffect([items]) detecta nova referência
   ├─ setPage(1) + window.scrollTo({ top: 0, behavior: "instant" })
   ├─ visibleItems = filtered.slice(0, 20)  ← primeiros 20 de fogo
   └─ DOM: 20 cards + sentinel (se filtered.length > 20)
      OU 52 cards + mensagem fim (se filtered.length <= 20)

7. Scroll completo
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
