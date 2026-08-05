# Graph Report - .  (2026-08-05)

## Corpus Check
- 139 files · ~309,818 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 411 nodes · 663 edges · 29 communities (19 shown, 10 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 19 edges (avg confidence: 0.75)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Componentes Client UI
- PokéAPI Client/Data Layer
- Páginas App Router
- Páginas Onboarding/Perfil
- Detalhe Pokémon [id]
- Tooling & DevDeps
- Documentação & Decisões
- Referências Build/Types
- API Favorites CRUD
- Framework Dependencies
- Infinite Scroll UX/Testes
- Layout Raiz
- CI & Quality Gates
- Estratégias Paginação
- Next.js Config
- Roadmap Arquitetural
- Padrões Carregamento
- ESLint Config
- PostCSS Config
- Intersection Observer
- Virtualização/Windowing
- CSS content-visibility
- IO Passive Listener
- rootMargin 200px

## God Nodes (most connected - your core abstractions)
1. `getAppConfig()` - 18 edges
2. `mapToCatalogItem()` - 17 edges
3. `compilerOptions` - 16 edges
4. `scripts` - 12 edges
5. `PokemonCatalogItem` - 9 edges
6. `parseFavoriteIdsResponse()` - 8 edges
7. `PokedexListClient()` - 7 edges
8. `useFavorites()` - 7 edges
9. `listFavoriteIds()` - 7 edges
10. `addFavorite()` - 7 edges

## Surprising Connections (you probably didn't know these)
- `Pokédex Mobile` --implements--> `Next.js 16.3 App Router`  [EXTRACTED]
  README.md → AGENTS.md
- `Pokédex Mobile` --references--> `DOM Growth Problem (905 items → ~7,240 nodes)`  [EXTRACTED]
  README.md → doc/infinite-scroll/01-problema.md
- `Thundering Herd Problem` --conceptually_related_to--> `Force-Static SSG`  [EXTRACTED]
  doc/infinite-scroll/05-api-design.md → README.md
- `PokedexListClient` --shares_data_with--> `pokedex-service.ts (JSON runtime)`  [EXTRACTED]
  doc/infinite-scroll/04-arquitetura.md → README.md
- `pokedex-service.ts (JSON runtime)` --implements--> `JSON Local Data Source Strategy`  [EXTRACTED]
  README.md → doc/infinite-scroll/02-abordagens.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Infinite Scroll Architecture: Filters → Pagination → Render** — doc_infinite_scroll_04_arquitetura_use_pokedex_filters, doc_infinite_scroll_03_decisao_use_infinite_scroll_hook, doc_infinite_scroll_04_arquitetura_pokedex_list_client [EXTRACTED 1.00]
- **Runtime Data Source Strategies Evaluated** — doc_infinite_scroll_02_abordagens_json_local_data_source, doc_infinite_scroll_02_abordagens_indexeddb_rejected, doc_infinite_scroll_02_abordagens_service_worker_complementar, doc_infinite_scroll_02_abordagens_react_query_use_infinite_query [EXTRACTED 1.00]
- **10 Classic Data Management Problems & Solutions** — doc_infinite_scroll_01_problema_n_plus_one_query, doc_infinite_scroll_05_api_design_thundering_herd, doc_infinite_scroll_05_api_design_acoplamento_forte, doc_infinite_scroll_05_api_design_favorites_store [EXTRACTED 1.00]
- **Infinite Scroll Complete Documentation System** — doc_infinite-scroll_readme_infinite_scroll_guide, doc_infinite-scroll_07-ux_ux_states, doc_infinite-scroll_08-testes_test_cases, doc_infinite-scroll_09-stack_webview_architecture, doc_infinite-scroll_10-prompts_devin_prompt [EXTRACTED 1.00]
- **Quality Governance System (Scorecard + DoD + CI + Style Guide)** — doc_quality-scorecard_quality_scorecard, doc_quality-scorecard_definition_of_done, doc_quality-scorecard_ci_workflow, doc_typescript-style-guide_typescript_style_guide [INFERRED 0.85]
- **IntersectionObserver Test Infrastructure (Mock + Cases + Integration)** — doc_infinite-scroll_08-testes_mock_intersection_observer, doc_infinite-scroll_08-testes_test_cases, doc_infinite-scroll_08-testes_integration_test, doc_infinite-scroll_07-ux_sentinel_element [EXTRACTED 1.00]

## Communities (29 total, 10 thin omitted)

### Community 0 - "Componentes Client UI"
Cohesion: 0.08
Nodes (33): FavoritesClient(), FavoritesClientProps, PokedexListClient(), PokedexListClientProps, TypeFilter, PokemonCard, PokemonCardProps, TabBar() (+25 more)

### Community 1 - "PokéAPI Client/Data Layer"
Cohesion: 0.08
Nodes (40): apiFetch(), CACHE_OPTIONS, DamageRelations, delay(), EvolutionChainLink, fetchEvolutionChain(), fetchPokemon(), fetchPokemonSpecies() (+32 more)

### Community 2 - "Páginas App Router"
Cohesion: 0.09
Nodes (30): dynamic, FavoritosPage(), dynamic, LoginPage(), dynamic, PokedexPage(), dynamic, generateStaticParams() (+22 more)

### Community 3 - "Páginas Onboarding/Perfil"
Cohesion: 0.08
Nodes (27): OnboardingStep, SlideDirection, dynamic, PerfilPage(), BackButton(), BackButtonProps, BackIcon(), ChevronDownIcon() (+19 more)

### Community 4 - "Detalhe Pokémon [id]"
Cohesion: 0.09
Nodes (26): generateMetadata(), generateStaticParams(), getBlurDataURL(), Params, PokemonDetailPage(), ElementoOutline(), EvoCard(), EvoItem (+18 more)

### Community 5 - "Tooling & DevDeps"
Cohesion: 0.06
Nodes (33): eslint, eslint-config-next, husky, jsdom, devDependencies, eslint, eslint-config-next, husky (+25 more)

### Community 6 - "Documentação & Decisões"
Cohesion: 0.07
Nodes (30): Next.js 16.3 App Router, pokeapi-client.ts (fetch + retry), pokeapi-mappers.ts, PokéAPI v2 REST, DOM Growth Problem (905 items → ~7,240 nodes), Frame Budget 16.6ms / 60fps, N+1 Query Problem, WebView Single-Process Limitation (+22 more)

### Community 7 - "Referências Build/Types"
Cohesion: 0.07
Nodes (28): dom, dom.iterable, esnext, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules (+20 more)

### Community 8 - "API Favorites CRUD"
Cohesion: 0.18
Nodes (19): DELETE(), Params, GET(), POST(), DetailFavoriteToggle(), DetailFavoriteToggleProps, addFavorite(), getFavoritesSet() (+11 more)

### Community 9 - "Framework Dependencies"
Cohesion: 0.08
Nodes (24): @ducanh2912/next-pwa, next, dependencies, @ducanh2912/next-pwa, next, react, react-dom, name (+16 more)

### Community 10 - "Infinite Scroll UX/Testes"
Cohesion: 0.09
Nodes (24): Infinite Scroll Accessibility (aria-hidden, aria-live, screen readers), Instant scroll-to-top on filter change (behavior: instant), Sentinel Element (IntersectionObserver trigger), Infinite Scroll UX States (loading, end-of-list, empty), PokedexListClient Integration Test, MockIntersectionObserver (Vitest + JSDOM), useInfiniteScroll Test Cases (8 scenarios), React 19 Concurrent Rendering for Infinite Scroll (+16 more)

### Community 11 - "Layout Raiz"
Cohesion: 0.40
Nodes (3): metadata, poppins, viewport

### Community 12 - "CI & Quality Gates"
Cohesion: 0.50
Nodes (4): Quality Gates, Conventional Commits, PR Quality Checklist, CI Quality Pipeline

### Community 13 - "Estratégias Paginação"
Cohesion: 0.67
Nodes (3): React Query useInfiniteQuery (rejected), Cursor-Based Pagination, Offset-Based Pagination

## Knowledge Gaps
- **143 isolated node(s):** `eslintConfig`, `withPWA`, `nextConfig`, `name`, `version` (+138 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **10 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `getAppConfig()` connect `Páginas App Router` to `Componentes Client UI`, `PokéAPI Client/Data Layer`, `Páginas Onboarding/Perfil`, `Detalhe Pokémon [id]`?**
  _High betweenness centrality (0.033) - this node is a cross-community bridge._
- **Why does `PokemonCatalogItem` connect `Componentes Client UI` to `PokéAPI Client/Data Layer`?**
  _High betweenness centrality (0.019) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `Tooling & DevDeps` to `Framework Dependencies`?**
  _High betweenness centrality (0.015) - this node is a cross-community bridge._
- **What connects `eslintConfig`, `withPWA`, `nextConfig` to the rest of the system?**
  _143 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Componentes Client UI` be split into smaller, more focused modules?**
  _Cohesion score 0.07535460992907801 - nodes in this community are weakly interconnected._
- **Should `PokéAPI Client/Data Layer` be split into smaller, more focused modules?**
  _Cohesion score 0.08405797101449275 - nodes in this community are weakly interconnected._
- **Should `Páginas App Router` be split into smaller, more focused modules?**
  _Cohesion score 0.09487179487179487 - nodes in this community are weakly interconnected._