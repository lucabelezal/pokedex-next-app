# Padrões do Projeto em TypeScript

Como o projeto aplica cada conceito de TypeScript na prática.

## Modelagem de dados

Todos os tipos de dados do projeto em um arquivo central:

```ts
// src/lib/pokedex-types.ts
export type PokemonTypeTag = {
  key: string;
  label: string;
  color: string;
  textColor: string;
};

export type PokemonCatalogItem = {
  id: number;
  name: string;
  slug: string;
  number: string;
  image: string;
  cardColor: string;
  heroColor: string;
  region: string;
  generation: number;
  types: PokemonTypeTag[];
  description: string;
  weight: string;
  height: string;
  category: string;
  ability: string;
  gender: PokemonGender;
  weaknesses: PokemonTypeTag[];
  evolution: PokemonEvolutionItem[];
};

export type SortKey = "az" | "za" | "number-asc" | "number-desc";

export type AppConfig = {
  app: { name: string; version: string; locale: string };
  theme: { background: string; surface: string; /* ... */ };
  texts: Record<string, string>;
};
```

**Princípio:** tipos de domínio são declarados uma vez, importados onde necessário via `import type`.

## Runtime validation

Dados externos (API, JSON) são validados em runtime. Não confiamos em `as` assertions:

```ts
// src/lib/runtime-validators.ts
export function validatePokemonCatalog(input: unknown): PokemonCatalogItem[] {
  if (!isArray(input)) throw new Error("PokemonCatalog: esperado array.");
  return input.map(validatePokemonCatalogItem);
}

// src/lib/pokedex-service.ts — ANTES (❌ inseguro)
const catalog = catalogData as PokemonCatalogItem[];

// src/lib/pokedex-service.ts — DEPOIS (✅ validado)
const catalog = validatePokemonCatalog(catalogData);
```

**Princípio:** `unknown` + type guards > `as` assertions.

## Context API com TypeScript

```ts
// src/lib/favorites-context.tsx
type FavoritesContextType = ReturnType<typeof useFavorites>;
const FavoritesContext = createContext<FavoritesContextType | null>(null);

export function useFavoritesContext() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavoritesContext must be used within FavoritesProvider");
  }
  return context;
}
```

**Princípio:** `ReturnType<typeof hook>` mantém o tipo do contexto sempre sincronizado com o hook.

## Componentes tipados

```ts
// src/components/pokemon-card.tsx
type PokemonCardProps = {
  pokemon: PokemonCatalogItem;
  favorite: boolean;
  onToggleFavorite: (id: number) => void;
};

export const PokemonCard = memo(function PokemonCard({
  pokemon,
  favorite,
  onToggleFavorite,
}: PokemonCardProps) {
  // ...
});
```

**Princípio:** cada componente tem seu tipo de props declarado como `type`. Não usamos `interface` para props.

## async/await com tipagem

```ts
// src/app/pokedex/[id]/page.tsx
export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const resolved = await params;
  const pokemon = await getPokemonById(Number(resolved.id));
  // ...
}

type Params = {
  params: Promise<{ id: string }>;
};
```

**Princípio:** `params` é `Promise<...>` no Next.js 16. Sempre `await params` antes de acessar.

## Funções puras com tipos explícitos

```ts
// src/lib/pokeapi-mappers.ts
export function mapToCatalogItem(
  pokemon: RawPokemon,
  species: RawPokemonSpecies,
  evolutionChain: RawEvolutionChain,
  typeDetails: RawType[],
): PokemonCatalogItem {
  // transforma dados brutos da API → tipo do domínio
}
```

**Princípio:** funções de transformação recebem tipos "crus" (`Raw*`) e retornam tipos do domínio (`PokemonCatalogItem`).

## Enums vs Union Types

O projeto **não usa enums**. Usa union types de strings:

```ts
// ❌ Não fazemos isso
enum SortKey {
  Az = "az",
  Za = "za",
}

// ✅ Fazemos isso
type SortKey = "az" | "za" | "number-asc" | "number-desc";
```

Motivo: union types são mais leves (não geram código JS), mais fáceis de estender, e funcionam melhor com serialização.

## O que NÃO fazemos

| Prática | Por que evitamos |
|---|---|
| `as any` | Desliga o compilador. Usamos `unknown` + narrowing |
| `as` em dados externos | Dados de API/JSON devem ser validados |
| `enum` | Gera código JS desnecessário. Union types são melhores |
| `interface` para dados | `type` é mais consistente e suporta unions |
| Tipo `Function` | Muito genérico. Sempre declare a assinatura: `(id: number) => void` |
| `@ts-ignore` | Existe um `@ts-expect-error` no setupTests.ts (justificado: mock de jsdom) |
