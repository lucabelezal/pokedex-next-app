# Módulos ES e Path Aliases

## ES Modules (import/export)

TypeScript usa o sistema de módulos ES (padrão do JavaScript moderno):

```ts
// Named exports
export function getAppConfig(): AppConfig { ... }
export const REGION_RANGES: Record<string, [number, number]> = { ... };
export type PokemonCatalogItem = { ... };

// Named imports
import { getAppConfig, REGION_RANGES } from "@/lib/pokedex-service";
import type { PokemonCatalogItem } from "@/lib/pokedex-types";

// Default export (um por arquivo)
export default function PokemonDetailPage() { ... }

// Default import
import PokemonDetailPage from "@/app/pokedex/[id]/page";
```

## type import

Importar apenas tipos — não gera código JavaScript, só existe em tempo de compilação:

```ts
// ✅ Bom — compilador sabe que é só tipo
import type { PokemonCatalogItem, AppConfig } from "@/lib/pokedex-types";

// ⚠️ Funciona mas gera referência no bundle
import { PokemonCatalogItem } from "@/lib/pokedex-types";

// ✅ Misto — runtime + type
import { getAppConfig, type AppConfig } from "@/lib/pokeapi-service";
```

## Path Aliases (@/)

O projeto usa `@/` como alias para `src/`. Configurado no `tsconfig.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

```ts
// Sem alias (ruim — muda se o arquivo mover)
import { PokemonCard } from "../../components/pokemon-card";

// Com alias (bom — sempre a mesma referência)
import { PokemonCard } from "@/components/pokemon-card";
import { getPokemonCatalog } from "@/lib/pokeapi-service";
```

**Swift:** `import ModuleName` (módulos são frameworks/packages, não paths relativos)

## Barrel Exports (index.ts)

Agrupa múltiplas exports em um único ponto. O projeto usa em `src/components/`:

```ts
// src/components/index.ts
export { PokemonCard } from "./pokemon-card";
export { TabBar } from "./tab-bar";
export { BackButton } from "./back-button";
```

Permite importar de um só lugar:
```ts
import { PokemonCard, TabBar, BackButton } from "@/components";
```

## Re-exports

O projeto usa re-exports para consolidar APIs:

```ts
// src/lib/pokeapi-service.ts
// Re-exporta funções estáticas do serviço antigo
export {
  getAppConfig,
  getRegionByKey,
  getRegionsCatalog,
  getUserProfile,
  sortPokemonList,
} from "@/lib/pokedex-service";
```

Isso permite que todas as páginas importem de um único lugar (`pokeapi-service`) em vez de decidir se importam do serviço antigo ou novo.

## Organização de imports no projeto

```
src/
├── app/                    ← Páginas (App Router)
│   ├── pokedex/page.tsx    → import { ... } from "@/lib/pokeapi-service"
│   ├── pokedex/[id]/page.tsx → import { ... } from "@/components/detail-hero"
│   └── layout.tsx          → import { FavoritesProvider } from "@/lib/favorites-context"
├── components/             ← Componentes UI reutilizáveis
│   ├── pokemon-card.tsx    → import type { PokemonCatalogItem } from "@/lib/pokedex-types"
│   ├── skeleton.tsx        → (sem imports de lib)
│   └── index.ts            → barrel exports
├── hooks/                  ← Custom hooks
│   ├── use-favorites.ts    → import { parseFavoriteIdsResponse } from "@/lib/runtime-validators"
│   └── use-infinite-scroll.ts
├── lib/                    ← Data layer (tipos, serviços, clientes)
│   ├── pokedex-types.ts    → (tipos puros, sem imports do projeto)
│   ├── pokeapi-client.ts   → (fetch + retry, sem imports do projeto)
│   ├── pokeapi-mappers.ts  → import { getTypeMetadata } from "@/lib/type-metadata"
│   ├── pokeapi-service.ts  → import { fetchPokemon } from "@/lib/pokeapi-client"
│   ├── pokedex-service.ts  → import { validatePokemonCatalog } from "@/lib/runtime-validators"
│   ├── pokedex-constants.ts → (constantes puras, sem imports do projeto)
│   └── favorites-context.tsx → import { useFavorites } from "@/hooks/use-favorites"
└── data/mocks/             ← JSON estáticos (fallback)
```

## Regras de importação no projeto

1. **Páginas** só importam de `@/components/` e `@/lib/pokeapi-service`
2. **Componentes** só importam de `@/components/`, `@/hooks/`, e `@/lib/pokedex-types`
3. **Hooks** só importam de `@/lib/`
4. **Lib** só importa de `@/lib/` (camada mais baixa)
5. Cross-feature imports devem passar por `@/lib/*` apenas

## Exercício prático

1. Encontre todos os `import type` no projeto: `grep -r "import type" src/`
2. Trace o caminho: `getPokemonCatalog` (pokeapi-service) → `fetchInBatches` → `fetchPokemon` (pokeapi-client)
3. Abra `tsconfig.json` e veja a configuração de paths
