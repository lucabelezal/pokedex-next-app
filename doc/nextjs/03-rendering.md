# Estratégias de Renderização

Next.js oferece 4 estratégias de renderização. O projeto usa SSG (Static Site Generation) para quase tudo.

## 1. SSG — Static Site Generation (build time)

HTML gerado no `next build`. Servido por CDN. Instantâneo.

```tsx
// 905 páginas geradas no build
export async function generateStaticParams() {
  return Array.from({ length: 905 }, (_, i) => ({ id: String(i + 1) }));
}

export const dynamic = "force-static";  // explícito: sempre SSG
```

**Quando usar:** conteúdo que não muda frequentemente (catálogo de Pokémon, regiões).

**Swift:** não existe. SwiftUI não gera HTML estático.

## 2. SSR — Server-Side Rendering (request time)

HTML gerado a cada request. Sempre fresco, mais lento.

```tsx
export const dynamic = "force-dynamic";  // sempre SSR
```

**Quando usar:** dados que mudam a cada request (dashboard, feed em tempo real). **Não usado no projeto.**

## 3. ISR — Incremental Static Regeneration

SSG + revalidação periódica. Gera estático, revalida em background.

```tsx
// Revalida a cada 1 hora (3600 segundos)
export const revalidate = 3600;
```

**Quando usar:** conteúdo que muda ocasionalmente (blog, produtos). **Não usado no projeto** (PokéAPI mal muda).

## 4. PPR — Partial Prerendering (Next.js 16+)

Combina estático + dinâmico na mesma página. O shell estático é pré-renderizado, os dados dinâmicos stream.

**Não usado no projeto ainda** — requer Cache Components.

## fetch cache (Next.js)

O projeto usa a API `fetch` do Next.js com cache de 24h:

```ts
// src/lib/pokeapi-client.ts
const CACHE_OPTIONS = { next: { revalidate: 86400 } } as const;
//                                         ^^^^^ 24 horas

async function apiFetch<T>(url: string): Promise<T> {
  const res = await fetch(url, CACHE_OPTIONS);
  if (!res.ok) throw new PokeApiError(res.status, url);
  return res.json() as Promise<T>;
}
```

**Como funciona:** o Next.js cacheia a resposta do fetch. Próximo request usa cache. Após 24h, revalida em background.

## unstable_cache (server-side)

Cache de funções no servidor (processo Node.js):

```ts
// src/lib/pokeapi-service.ts
const getCachedPokemonItem = unstable_cache(
  (id: number) => buildPokemonCatalogItem(id),
  ["pokemon-item"],
  { revalidate: 3600 },
);
```

Cache compartilhado entre requests. Segunda navegação pra mesma página é instantânea — os dados já estão em memória.

## force-static vs force-dynamic

```tsx
export const dynamic = "force-static";   // SSG — build time
export const dynamic = "force-dynamic";  // SSR — request time
export const dynamic = "auto";           // Next.js decide (default)
```

## O que o projeto faz

| Rota | Estratégia | Justificativa |
|---|---|---|
| `/pokedex` | SSG (`force-static`) | Catálogo não muda por 24h |
| `/pokedex/[id]` | SSG (905 páginas) | Todas pré-renderizadas |
| `/regions/[key]` | SSG (8 páginas) | Regiões são estáticas |
| `/login`, `/register` | SSG | Telas estáticas |
| `/api/favorites` | Dinâmico | API route, sempre request-time |

## Build output

```bash
$ npm run build
✓ Generating static pages (926/926)

Route (app)
├ ○ /pokedex                     # Static
├ ● /pokedex/[id]                # SSG (905 paths)
├ ○ /regions                     # Static
├ ● /regions/[key]               # SSG (8 paths)
├ ƒ /api/favorites               # Dynamic (API)
└ ƒ /api/favorites/[id]          # Dynamic (API)

○ Static    → prerendered as static content
● SSG       → prerendered with generateStaticParams
ƒ Dynamic   → server-rendered on demand
```

## Swift (SwiftUI)

Renderização no SwiftUI é sempre client-side. "Build time" não existe — o app compila, gera um binário, e renderiza Views em tempo real no dispositivo. O conceito de SSG/SSR não se aplica.

No backend (Vapor), você teria caching de responses similar ao `fetch` cache do Next.js.
