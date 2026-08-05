# Generics no TypeScript

Generics permitem escrever código que funciona com qualquer tipo, mantendo a segurança de tipos.

## O básico

```ts
// Sem generic — função só funciona com number
function first(arr: number[]): number | undefined {
  return arr[0];
}

// Com generic — funciona com qualquer tipo
function first<T>(arr: T[]): T | undefined {
  return arr[0];
}

const numero = first([1, 2, 3]);      // tipo: number
const nome = first(["a", "b", "c"]);  // tipo: string
```

**Swift:** `func first<T>(_ arr: [T]) -> T?`

## Generics no projeto

O projeto usa generics no cliente da PokéAPI:

```ts
// src/lib/pokeapi-client.ts
async function apiFetch<T>(url: string): Promise<T> {
  const res = await fetch(url, CACHE_OPTIONS);
  if (!res.ok) {
    throw new PokeApiError(res.status, url);
  }
  return res.json() as Promise<T>;
}

// Uso: o tipo é inferido pelo retorno declarado
export function fetchPokemon(id: number): Promise<RawPokemon> {
  return apiFetch<RawPokemon>(`${BASE_URL}/pokemon/${id}`);
}

export function fetchPokemonSpecies(id: number): Promise<RawPokemonSpecies> {
  return apiFetch<RawPokemonSpecies>(`${BASE_URL}/pokemon-species/${id}`);
}

export function fetchType(name: string): Promise<RawType> {
  return apiFetch<RawType>(`${BASE_URL}/type/${name}`);
}
```

Mesma função `apiFetch<T>` — 3 tipos diferentes. O compilador sabe exatamente o que cada chamada retorna.

## Promise<T>

O tipo mais comum de generic que você vai ver:

```ts
async function getPokemonCatalog(): Promise<PokemonCatalogItem[]> {
  const ids = Array.from({ length: 905 }, (_, i) => i + 1);
  return fetchInBatches(ids);
}
```

`Promise<PokemonCatalogItem[]>` = "isso retorna uma Promise que resolve para um array de PokemonCatalogItem".

**Swift:** `func getPokemonCatalog() async -> [PokemonCatalogItem]`

## Constraints em generics

Você pode restringir quais tipos são aceitos:

```ts
// Só aceita tipos que tenham a propriedade 'name'
function findByName<T extends { name: string }>(items: T[], name: string): T | null {
  return items.find(item => item.name === name) ?? null;
}
```

## Exemplos reais do projeto

### Record<K, V>

```ts
// src/lib/pokeapi-mappers.ts
const GENERATION_NUMBERS: Record<string, number> = {
  "generation-i":    1,
  "generation-ii":   2,
  "generation-iii":  3,
  // ...
};
```

`Record<string, number>` = objeto onde toda chave é string e todo valor é number.

**Swift:** `[String: Int]`

### unknown vs any

```ts
// src/lib/runtime-validators.ts
const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null;
};
```

`unknown` = "não sei o tipo, preciso verificar antes de usar" (seguro).
`any` = "desligue o compilador aqui" (inseguro — **nunca usado no projeto**).

```ts
// ❌ Ruim (não existe no projeto)
const data: any = JSON.parse(input);
data.foo.bar(); // compila, mas explode em runtime

// ✅ Bom (como o projeto faz)
const data: unknown = JSON.parse(input);
if (isRecord(data) && typeof data.foo === "string") {
  // agora é seguro usar data.foo
}
```

### Filter com type predicate

```ts
// src/lib/pokeapi-service.ts
const batchResults = await Promise.all(batch.map(getCachedPokemonItem));
results.push(...batchResults.filter((p): p is PokemonCatalogItem => p !== null));
//                                ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
//                                type predicate: diz ao compilador que
//                                após o filter, os itens NÃO são null
```

## Exercício prático

1. Abra `src/lib/pokeapi-client.ts` e encontre `apiFetch<T>` — veja como cada função exportada chama `apiFetch` com um tipo diferente
2. Abra `src/lib/runtime-validators.ts` — veja como `unknown` é usado com type narrowing
3. Identifique todos os usos de `Promise<T>` no projeto: `grep -r "Promise<" src/`
