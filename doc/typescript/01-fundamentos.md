# Fundamentos do TypeScript

## O que é TypeScript

TypeScript é um superset do JavaScript que adiciona tipagem estática. Todo código JavaScript é TypeScript válido — você pode adicionar tipos gradualmente.

```ts
// JavaScript (válido como TypeScript)
function soma(a, b) {
  return a + b;
}

// TypeScript com tipos explícitos
function soma(a: number, b: number): number {
  return a + b;
}
```

## Tipos primitivos

```ts
const nome: string = "Pokédex";
const total: number = 905;
const ativo: boolean = true;
const indefinido: undefined = undefined;
const nulo: null = null;
const simb: symbol = Symbol("id");
const grande: bigint = 9007199254740991n;
```

**Swift → TS:**

| Swift | TypeScript |
|-------|-----------|
| `String` | `string` |
| `Int`, `Double` | `number` |
| `Bool` | `boolean` |
| `nil` | `null` ou `undefined` |
| `Any` | `unknown` |

## Arrays

```ts
const ids: number[] = [1, 2, 3];
const nomes: Array<string> = ["Bulbasaur", "Charmander"];

// Array de objetos (real do projeto)
const catalog: PokemonCatalogItem[] = [...];
```

## Objetos e interfaces

No TypeScript, há duas formas de definir a forma de um objeto: `type` e `interface`.

```ts
// type (alias)
type PokemonTypeTag = {
  key: string;
  label: string;
  color: string;
  textColor: string;
};

// interface (declaração)
interface PokemonCatalogItem {
  id: number;
  name: string;
  slug: string;
  types: PokemonTypeTag[];
}
```

### Diferença prática: type vs interface

```ts
// interface suporta declaration merging
interface Window {
  pokemonData: string; // adiciona ao Window global
}

// type suporta union types
type Result = "success" | "error" | "loading";
type PokemonOrNull = PokemonCatalogItem | null;
```

**No projeto:** usamos `type` para todos os modelos de dados (`PokemonCatalogItem`, `AppConfig`, etc). Preferimos `type` por consistência e porque unions são comuns.

## Type vs Interface — quando usar cada um

| Use `type` quando... | Use `interface` quando... |
|---|---|
| Precisa de union (`A \| B`) | Precisa de declaration merging |
| Precisa de intersection (`A & B`) | Está definindo uma API pública de classe |
| Precisa de tipos condicionais | Está criando um contrato que outros vão implementar |
| Precisa de mapped types | O objeto representa um "objeto real" com identidade |

## Optional e readonly

```ts
type PokemonEvolutionItem = {
  id: number;
  name: string;
  level: string | null;  // pode ser string ou null
  image: string;
};

// Optional — o campo pode não existir
type BackButtonProps = {
  className?: string;     // opcional
  iconClassName?: string; // opcional
  "aria-label"?: string;  // opcional
  transitionTypes?: string[];
};
```

## Funções

```ts
// Função com tipo de parâmetros e retorno
function getBlurDataURL(color: string): string {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' ... fill='${color}' .../>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}

// Arrow function com tipo
const getItem = (id: number): PokemonCatalogItem | null => {
  return catalog.find(p => p.id === id) ?? null;
};

// async function retorna Promise<T>
async function getPokemonById(id: number): Promise<PokemonCatalogItem | null> {
  return getCachedPokemonItem(id);
}
```

## Union Types (OU)

```ts
// SortKey: só aceita esses 4 valores
type SortKey = "az" | "za" | "number-asc" | "number-desc";

// Pode ser um tipo ou outro
type MaybeError = PokemonCatalogItem | Error;

// Nullable pattern
function findById(id: number): PokemonCatalogItem | null {
  return catalog.find(p => p.id === id) ?? null;
}
```

**Swift:** `enum SortKey { case az, za, numberAsc, numberDesc }`
**TypeScript:** `type SortKey = "az" | "za" | "number-asc" | "number-desc"`

## Exemplos reais do projeto

```ts
// src/lib/pokedex-types.ts — todos os tipos do projeto

// src/lib/pokeapi-client.ts — tipos da API externa
export type RawPokemon = {
  id: number;
  name: string;
  weight: number;
  height: number;
  types: { slot: number; type: { name: string; url: string } }[];
  // ...
};

// src/components/pokemon-card.tsx — props de componente
type PokemonCardProps = {
  pokemon: PokemonCatalogItem;
  favorite: boolean;
  onToggleFavorite: (id: number) => void;
};
```

## Exercício prático

No projeto, encontre:
1. `src/lib/pokedex-types.ts` — todos os tipos de dados
2. `src/lib/pokeapi-client.ts` — tipos da API externa (RawPokemon, RawPokemonSpecies...)
3. `src/components/pokemon-card.tsx` — como um componente recebe tipos via props

Compare com Swift: como você faria um `struct Pokemon` no Swift com `Codable`?
