# Pokédex Mobile — Agents Guide

## Stack

Next.js 16.3 App Router · React 19 · TypeScript 5 strict · Tailwind CSS v4 · Vitest 3 + Testing Library + jsdom · ESLint 9 flat config · PWA via @ducanh2912/next-pwa · PokéAPI v2 REST (SSG, revalidate 24h)

## Project Structure

```
src/
  app/          → Pages: /pokedex, /pokedex/[id], /favorites, /regions, /regions/[key], /onboarding, /login, /register, /splash, /profile + API routes /api/favorites
  components/   → Shared UI: pokemon-card, type-badge, tab-bar, back-button, directional-transition, favorites-client, evolution-card, metric-card, icons, settings
  lib/          → Data layer: pokeapi-client (with retry), pokeapi-mappers, pokeapi-service, pokedex-types, pokedex-service, favorites-store (localStorage), runtime-validators, type-metadata
  hooks/        → use-infinite-scroll, use-pokedex-filters, use-favorites
  data/mocks/   → Static JSON fallbacks
```

## Key Commands

```bash
npm run dev          # next dev (Turbopack)
npm run build        # next build (SSG: 926 pages)
npm run lint         # eslint .
npm run lint:fix     # eslint . --fix
npm run type-check   # tsc --noEmit
npm run check        # lint + type-check (pre-commit hook)
npm run test         # vitest run (25 tests)
npm run test:watch   # vitest
npm run test:coverage  # vitest run --coverage
```

## Naming Conventions

- kebab-case for components, files, directories
- `@/` alias = `src/`
- Components: `function` declarations (not arrow), `"use client"` directive at top when needed
- Imports: barrel via `index.ts` in component dirs, cross-feature via `@/lib/*` only
- Tests: co-located `__tests__/` directories, file suffix `.test.ts` or `.test.tsx`

## Code Style

- No comments unless strictly necessary
- Prefer explicit type imports from `@/lib/pokedex-types.ts`
- Favorites: localStorage-based, runtime validation via `runtime-validators.ts`
- API client: fetch with retry (3 attempts, exponential backoff on 5xx), no external HTTP lib
- Styles: Tailwind utility classes, no CSS modules

## Available Skills

### Project-Specific

| Skill | When to Load |
|---|---|
| **create-component** | Criar componente UI reutilizável em `src/components/ui/` (botão, modal, tabela, input) |
| **create-feature** | Adicionar feature nova com CRUD completo, React Query, Zod, seguindo padrão bulletproof-react |
| **conventional-commits** | Formatar mensagem de commit em Conventional Commits (PT-BR) |
| **write-tests** | Escrever testes unitários (Vitest), integração (Testing Library + MSW) ou E2E (Playwright) |
| **typescript-refactoring** | Plano de refatoração TypeScript em fases: baseline, type safety, arquitetura, testes |
| **caveman** | Modo de comunicação ultra-comprimido — corta ~65% tokens mantendo precisão técnica |
| **tlc-spec-driven** | Planejar features com spec → design → tasks → execute, atomic commits, verifier, lições |

### Frontend & Design

| Skill | When to Load |
|---|---|
| **frontend-design** | Criar/redesenhar UI com paleta, tipografia, layout e motion distintos |
| **web-design-guidelines** | Auditar UI contra Web Interface Guidelines (acessibilidade, UX, contraste) |
| **composition-patterns** | Refatorar componentes com muitos boolean props — compound components, context providers |
| **react-best-practices** / **vercel-react-best-practices** | Otimizar performance React/Next.js (waterfalls, bundle, re-renders, JS perf) |
| **react-view-transitions** / **vercel-react-view-transitions** | Animações nativas com View Transition API (transições de página, shared elements) |

### Next.js 16 Cache & Performance

| Skill | When to Load |
|---|---|
| **next-cache-components** | Referência: `"use cache"`, `cacheLife`, `cacheTag`, `revalidateTag`, PPR, migrar de `unstable_cache` |
| **next-cache-components-adoption** | Habilitar Cache Components em projeto Next.js 16.3+, resolver erros de prerender |
| **next-cache-components-optimizer** | Loop RED→GREEN: empurrar rota para instant navigation com `@next/playwright` |
| **next-partial-prefetching-adoption** | Habilitar Partial Prefetching, auditar `<Link prefetch={true}>` |
| **next-dev-loop** | Verificar runtime após edição: cross-check `/_next/mcp` + browser devtools |

### Migration & Docs

| Skill | When to Load |
|---|---|
| **cra-to-next-migration** | Migrar projeto CRA para Next.js 16+ App Router (148 regras, 17 categorias) |
| **tailwind-4-docs** | Consultar docs offline do Tailwind CSS v4 (configuração, migração, utilitários) |

## Quality Gates

- Pre-commit: `npm run check` (lint + type-check)
- Pre-push: `npm run test`
- Build must pass with 926 SSG pages (PokéAPI with retry)
- ESLint: 0 errors, 0 warnings on src/
- TypeScript: 0 errors with strict mode
- Tests: 25 passing

## PokéAPI Integration

- Source: `https://pokeapi.co/api/v2` with Next.js fetch cache (24h revalidate)
- Endpoints: `/pokemon/{id}`, `/pokemon-species/{id}`, `/evolution-chain/{url}`, `/type/{name}`
- 905 Pokémon fetched in parallel batches (50) during `next build`
- Descriptions try PT-BR first, fallback to EN
- Sprites from `raw.githubusercontent.com/PokeAPI/sprites`
- Retry: 3 attempts with exponential backoff on 5xx
