# Server Components vs Client Components

Next.js App Router tem dois tipos de componentes. É o conceito mais fundamental — e mais diferente de tudo no iOS.

## Server Components (RSC — padrão)

Todo componente é Server Component **por padrão**. Roda no servidor, zero JavaScript no cliente.

```tsx
// src/app/pokedex/page.tsx — Server Component
export default async function PokedexPage() {
  const catalog = await getPokemonCatalog(); // fetch direto, sem useEffect!
  const config = getAppConfig();             // acesso a arquivos, DB, etc

  return (
    <div>
      <PokedexListClient catalog={catalog} config={config} />
    </div>
  );
}
```

**Características:**
- Pode ser `async` (fetch dados direto)
- Acesso a arquivos, banco de dados, APIs internas
- Zero JavaScript enviado ao cliente
- Não pode usar `useState`, `useEffect`, `onClick`, etc
- Renderiza no servidor → HTML puro chega ao browser

## Client Components ("use client")

Quando precisa de interatividade:

```tsx
"use client";  // ⚠️ PRIMEIRA linha do arquivo

// src/components/pokemon-card.tsx — Client Component
export const PokemonCard = memo(function PokemonCard({ pokemon, favorite, onToggleFavorite }) {
  return (
    <article>
      <Link href={`/pokedex/${pokemon.id}`}>  {/* hook useRouter internamente */}
        ...
      </Link>
      <button onClick={() => onToggleFavorite(pokemon.id)}>  {/* event handler */}
        <HeartIcon filled={favorite} />
      </button>
    </article>
  );
});
```

**Características:**
- Pode usar hooks (`useState`, `useEffect`, `useRouter`...)
- Pode ter event handlers (`onClick`, `onChange`...)
- Pode usar APIs do browser (`window`, `localStorage`, etc)
- JavaScript enviado ao cliente
- **Não pode** ser `async`

## A fronteira Server → Client

O padrão no projeto: **página é Server, dados descem como props para Client.**

```
┌─────────────────────────────────────────┐
│ page.tsx (Server)                       │
│   fetch dados, mount providers          │
│   ↓                                     │
│   <PokedexListClient catalog={...} />   │ ← props (serializáveis)
│                                         │
│   ┌─────────────────────────────────┐   │
│   │ PokedexListClient ("use client")│   │
│   │   useState, useEffect, hooks    │   │
│   │   onClick, onChange             │   │
│   └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

## Decisão: Server ou Client?

| Se o componente... | Use |
|---|---|
| Só renderiza dados (sem estado, sem eventos) | Server Component |
| Precisa de `useState`, `useEffect`, hooks | Client Component |
| Precisa de `onClick`, `onChange` | Client Component |
| Precisa acessar `localStorage`, `window` | Client Component |
| Faz fetch de dados | Server Component |
| É um formulário interativo | Client Component |

## Componentes do projeto por tipo

**Server Components (sem "use client"):**

| Componente | Por quê |
|---|---|
| `directional-transition.tsx` | Renderiza `<ViewTransition>` — componente React que funciona no server |
| `auth-button.tsx` | Stateless, sem hooks, sem eventos |
| `page-header.tsx` | Só renderiza `<Link>` |
| `type-badge.tsx` | Puramente presentational |
| `type-icon.tsx` | SVG puro |
| `icons.tsx` | SVG puro |
| `evolution-card.tsx` | Só renderiza `<Image>` (next/image funciona no server) |
| `metric-card.tsx` | Puramente presentational |

**Client Components (com "use client"):**

| Componente | Por quê |
|---|---|
| `pokemon-card.tsx` | `memo()`, `ViewTransition`, `onClick` |
| `tab-bar.tsx` | `usePathname()` |
| `back-button.tsx` | `useRouter()`, `addTransitionType()` |
| `pokedex-list-client.tsx` | 3 hooks, event handlers |
| `favorites-client.tsx` | `useFavoritesContext()`, `useMemo()` |
| `detail-favorite-toggle.tsx` | `useFavoritesContext()` |
| `swipe-to-delete.tsx` | `useRef()`, touch events |
| `skeleton.tsx` | `"use client"` para animação CSS |

## Erro comum: "use client" desnecessário

```tsx
// ❌ NÃO faça isso — componente não usa hooks nem eventos
"use client";
export function TypeBadge({ type }: { type: PokemonTypeTag }) {
  return <span style={{ backgroundColor: type.color }}>{type.label}</span>;
}

// ✅ Correto — Server Component puro
export function TypeBadge({ type }: { type: PokemonTypeTag }) {
  return <span style={{ backgroundColor: type.color }}>{type.label}</span>;
}
```

## Swift (SwiftUI)

No SwiftUI, **toda View** roda no cliente (dispositivo). Não existe equivalente a Server Components.

O mais próximo: `@MainActor` para UI thread, mas o conceito é fundamentalmente diferente — no SwiftUI, você sempre está no dispositivo do usuário.
