# Union Types, Discriminated Unions e Narrowing

## Union Types (OU)

O tipo mais poderoso do TypeScript que não existe no Swift:

```ts
type Result = "success" | "error" | "loading";
type PokemonOrNull = PokemonCatalogItem | null;
type SortKey = "az" | "za" | "number-asc" | "number-desc";
```

**Swift:** não tem equivalente direto. O mais próximo é `enum` com associated values, mas é muito mais verboso.

## Discriminated Unions

Uma union com um campo "tag" que distingue cada variante:

```ts
// Exemplo didático (não está no projeto)
type ApiResult<T> =
  | { status: "ok"; data: T }
  | { status: "error"; message: string }
  | { status: "loading" };

function handleResult(result: ApiResult<PokemonCatalogItem>) {
  switch (result.status) {
    case "ok":
      // result.data está disponível (PokemonCatalogItem)
      return result.data.name;
    case "error":
      // result.message está disponível (string)
      return result.message;
    case "loading":
      // nem data nem message existem
      return "Carregando...";
  }
}
```

**Swift:**
```swift
enum ApiResult<T> {
    case ok(data: T)
    case error(message: String)
    case loading
}
```

## Type Narrowing (Guard)

TypeScript estreita tipos automaticamente quando você faz verificações:

### typeof (tipos primitivos)

```ts
function processar(valor: string | number) {
  if (typeof valor === "string") {
    // valor é string aqui
    return valor.toUpperCase();
  }
  // valor é number aqui
  return valor.toFixed(2);
}
```

### instanceof (classes)

```ts
// src/lib/pokeapi-service.ts
} catch (error) {
  if (error instanceof PokeApiError) {
    // error é PokeApiError aqui (tem .status)
    console.error(`[pokeapi] ${error.message}`);
    return null;
  }
  // error é unknown — precisa de verificação adicional
  throw error;
}
```

### Type Predicates (is)

O projeto usa type predicates extensivamente nos validators:

```ts
// src/lib/runtime-validators.ts
const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null;
};

const isString = (value: unknown): value is string => {
  return typeof value === "string";
};

const isNumber = (value: unknown): value is number => {
  return typeof value === "number" && Number.isFinite(value);
};

// Uso: após a verificação, TypeScript sabe o tipo
function assertField<T>(
  record: Record<string, unknown>,
  key: string,
  guard: (v: unknown) => v is T,
  label: string
): T {
  const value = record[key];
  if (!guard(value)) {
    throw new Error(`Validação de dados falhou: campo "${label}" inválido.`);
  }
  return value; // TypeScript sabe que é T
}
```

**Swift:** `guard let value = data[key] as? String else { throw }`

## as const

Torna um valor literal imutável e com o tipo mais específico possível:

```ts
// Sem as const — tipo é string[]
const TYPES = ["normal", "fire", "water"];

// Com as const — tipo é readonly ["normal", "fire", "water"]
const TYPES = ["normal", "fire", "water"] as const;
// typeof TYPES[number] = "normal" | "fire" | "water"
```

```ts
// src/lib/pokeapi-mappers.ts
const ALL_TYPES = [
  "normal", "fighting", "flying", "poison", "ground", "rock",
  "bug", "ghost", "steel", "fire", "water", "grass",
  "electric", "psychic", "ice", "dragon", "dark", "fairy",
] as const;
// Tipo: readonly ["normal", "fighting", ..., "fairy"]
```

## Template Literal Types

```ts
// Não usado no projeto, mas útil saber:
type PokemonId = `pokemon-${number}`;
type RegionRoute = `/regions/${string}`;
```

## Exercício prático

1. Abra `src/lib/runtime-validators.ts` — identifique todos os type predicates (`value is T`)
2. Abra `src/lib/pokeapi-service.ts:40-48` — veja narrowing com `instanceof`
3. Abra `src/lib/pokedex-types.ts` — compare `SortKey` (union) com as unions de Swift
4. Encontre todos os `as const` no projeto: `grep -r "as const" src/`
