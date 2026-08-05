# Utility Types

TypeScript fornece tipos utilitários globais para transformar tipos existentes. O projeto usa vários deles.

## Partial<T>

Torna todas as propriedades opcionais:

```ts
interface Config {
  name: string;
  version: string;
  locale: string;
}

// Partial<Config> = { name?: string; version?: string; locale?: string }
function updateConfig(config: Partial<Config>) {
  // posso passar só parte dos campos
}

updateConfig({ version: "2.0" }); // OK — name e locale não são obrigatórios
```

**Swift:** não tem equivalente direto. Seria uma struct separada com todos os campos opcionais.

## Pick<T, K>

Seleciona apenas algumas propriedades:

```ts
type PokemonCardSummary = Pick<PokemonCatalogItem, "id" | "name" | "image">;
// { id: number; name: string; image: string }
```

## Omit<T, K>

Remove propriedades específicas:

```ts
type PokemonWithoutEvolution = Omit<PokemonCatalogItem, "evolution" | "evolutionChain">;
```

## Record<K, V>

Objeto com chaves e valores fixos:

```ts
// Usado extensivamente no projeto:
type RegionRanges = Record<string, [number, number]>;

const REGION_RANGES: Record<string, [number, number]> = {
  kanto:  [1,   151],
  johto:  [152, 251],
  // ...
};
```

**Swift:** `[String: [Int]]` ou `Dictionary<String, [Int]>` via typealias.

## ReturnType<T>

Extrai o tipo de retorno de uma função:

```ts
// src/lib/favorites-context.tsx
type FavoritesContextType = ReturnType<typeof useFavorites>;
// Automatically matches whatever useFavorites() returns
// { favoriteIds: number[]; loading: boolean; error: string | null; toggleFavorite: (id: number) => Promise<void> }
```

Isso é **extremamente útil** — se `useFavorites` mudar, o tipo do contexto atualiza automaticamente.

**Swift:** não tem equivalente. Precisaria definir o tipo manualmente.

## Promise<T>

Wrappa um valor em uma Promise:

```ts
async function fetchData(id: number): Promise<PokemonCatalogItem | null> {
  return getCachedPokemonItem(id);
}
```

## NonNullable<T>

Remove null e undefined de um tipo:

```ts
type Name = string | null | undefined;
type SafeName = NonNullable<Name>; // string
```

## Awaited<T>

Desembrulha uma Promise:

```ts
type Pokemon = Awaited<ReturnType<typeof getPokemonById>>;
// PokemonCatalogItem | null (sem a Promise)
```

## Readonly<T>

Torna todas as propriedades readonly:

```ts
const config: Readonly<AppConfig> = getAppConfig();
// config.app.name = "novo"; // erro de compilação
```

## Exemplos reais do projeto

```ts
// src/lib/pokedex-types.ts
export type PokemonCatalogItem = {
  id: number;
  name: string;
  // ... 15 campos
  evolution: PokemonEvolutionItem[]
};

// src/lib/favorites-context.tsx — ReturnType mantém sincronia automática
type FavoritesContextType = ReturnType<typeof useFavorites>;

// src/lib/pokedex-constants.ts — Record para mapas chave-valor
export const REGION_RANGES: Record<string, [number, number]> = { ... };
```

## Exercício prático

1. Abra `src/lib/favorites-context.tsx` — veja `ReturnType<typeof useFavorites>`
2. Implemente um `Pick<PokemonCatalogItem, "id" | "name" | "types">` e veja o tipo resultante
3. Experimente no playground: `type X = Awaited<ReturnType<typeof getPokemonCatalog>>`
