# Next.js App Router

## O que é o App Router

O App Router (`/app`) é o sistema de roteamento moderno do Next.js (v13+). Baseado em arquivos — cada pasta dentro de `src/app/` vira uma rota.

```
src/app/
├── layout.tsx              ← Layout raiz (envolve todas as páginas)
├── page.tsx                ← Rota: /
├── pokedex/
│   ├── page.tsx            ← Rota: /pokedex
│   ├── loading.tsx         ← Loading state para /pokedex
│   ├── error.tsx           ← Error boundary para /pokedex
│   └── [id]/
│       ├── page.tsx        ← Rota: /pokedex/1, /pokedex/25, etc
│       ├── loading.tsx     ← Loading state para /pokedex/[id]
│       └── error.tsx       ← Error boundary para /pokedex/[id]
├── login/
│   └── page.tsx            ← Rota: /login
├── favorites/
│   └── page.tsx            ← Rota: /favorites
└── api/
    └── favorites/
        ├── route.ts        ← API: GET/POST /api/favorites
        └── [id]/
            └── route.ts    ← API: DELETE /api/favorites/:id
```

**Swift (Vapor):**
```swift
app.get("pokedex", ":id") { req -> EventLoopFuture<View> in ... }
```

## Páginas (page.tsx)

Toda pasta com `page.tsx` vira uma rota pública:

```tsx
// src/app/pokedex/page.tsx
export default async function PokedexPage() {
  const catalog = await getPokemonCatalog();

  return (
    <DirectionalTransition>
      <PokedexListClient initialCatalog={catalog} ... />
    </DirectionalTransition>
  );
}
```

**Server Component por padrão.** Recebe dados via async/await. Não tem estado, não tem hooks.

## Parâmetros dinâmicos ([id])

Pastas com `[nome]` criam parâmetros dinâmicos:

```tsx
// src/app/pokedex/[id]/page.tsx
type Params = {
  params: Promise<{ id: string }>;  // Promise no Next.js 16!
};

export default async function PokemonDetailPage({ params }: Params) {
  const resolved = await params;   // ⚠️ Sempre await params
  const pokemon = await getPokemonById(Number(resolved.id));

  if (!pokemon) notFound();
  return <DetailHero pokemon={pokemon} />;
}
```

## generateStaticParams (SSG)

Para gerar páginas estáticas em build time:

```tsx
export async function generateStaticParams() {
  return Array.from({ length: 905 }, (_, i) => ({ id: String(i + 1) }));
  // Gera 905 páginas: /pokedex/1, /pokedex/2, ...
}
```

Build gera HTML estático para cada `id` — CDN-ready, zero latência.

## Layouts (layout.tsx)

Layouts envolvem páginas e persistem entre navegações:

```tsx
// src/app/layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <FavoritesProvider>
          {children}  {/* ← cada página renderiza aqui */}
        </FavoritesProvider>
      </body>
    </html>
  );
}
```

**Swift (SwiftUI):** `NavigationView { ... }` — o conceito é similar mas layouts Next.js são hierárquicos por diretório, não por código.

## loading.tsx

Suspense boundary automático. Mostra skeleton enquanto a página carrega:

```tsx
// src/app/pokedex/loading.tsx
export default function PokedexLoading() {
  return (
    <div className="mx-auto max-w-[430px] space-y-3 px-4 pb-24">
      {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
    </div>
  );
}
```

O Next.js automaticamente mostra `loading.tsx` enquanto `page.tsx` está carregando.

## error.tsx

Error boundary automático:

```tsx
"use client";  // ⚠️ error.tsx PRECISA ser Client Component

export default function Error({ error, reset }: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div>
      <h1>Algo deu errado</h1>
      <button onClick={reset}>Tentar novamente</button>
    </div>
  );
}
```

## API Routes (route.ts)

APIs no mesmo projeto, sem backend separado:

```ts
// src/app/api/favorites/route.ts
export async function GET() {
  // lê favoritos do localStorage/server
  return Response.json({ ids: [1, 25] });
}

export async function POST(request: Request) {
  const { id } = await request.json();
  // adiciona favorito
  return Response.json({ ids: [...] });
}
```

**Swift (Vapor):** 
```swift
app.get("api", "favorites") { req -> Response in ... }
```

## Exercício prático

1. Navegue por todas as pastas em `src/app/` — identifique cada tipo de arquivo (page, layout, loading, error, route)
2. Compare a estrutura com um projeto SwiftUI: como você organizaria `PokemonDetailView`, `PokemonListView`?
3. Rode `npm run build` e veja quantas páginas estáticas são geradas
