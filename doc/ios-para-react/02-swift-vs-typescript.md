# Swift → TypeScript: Mapeamento de Conceitos

## Tipagem

```swift
// Swift — tipagem forte, inferência de tipos
let name: String = "Bulbasaur"     // explícito
let id = 1                          // inferido: Int
var count = 0                       // mutável
let types: [String] = ["grass"]     // array tipado
let info: [String: Any] = [:]       // dicionário
```

```ts
// TypeScript
const name: string = "Bulbasaur";   // explícito
const id = 1;                        // inferido: number
let count = 0;                       // mutável
const types: string[] = ["grass"];   // array tipado
const info: Record<string, unknown> = {};  // objeto tipado
```

| Swift | TypeScript |
|---|---|
| `var` | `let` |
| `let` | `const` |
| `String` | `string` |
| `Int`, `Double` | `number` |
| `Bool` | `boolean` |
| `nil` | `null` / `undefined` |
| `Any` | `unknown` (seguro) / `any` (inseguro) |

## Struct vs Type

```swift
// Swift — value type
struct Pokemon {
    let id: Int
    let name: String
    let types: [String]
}
```

```ts
// TypeScript — type alias (não gera código JS)
type Pokemon = {
  id: number;
  name: string;
  types: string[];
};
```

**Diferença crucial:** Swift `struct` é um value type real. TypeScript `type` é apenas uma anotação de compilação — não existe em runtime.

## Enum vs Union Type

```swift
// Swift — enum com valores associados
enum SortKey: String {
    case az
    case za
    case numberAsc
    case numberDesc
}
```

```ts
// TypeScript — union type (mais leve, sem código JS gerado)
type SortKey = "az" | "za" | "number-asc" | "number-desc";
```

## Protocol vs Interface/Type

```swift
// Swift — protocol define contrato
protocol Identifiable {
    var id: Int { get }
}

struct Pokemon: Identifiable {
    let id: Int
}

// Extension fornece implementação default
extension Identifiable {
    var idString: String { "\(id)" }
}
```

```ts
// TypeScript — interface ou type
interface Identifiable {
  id: number;
}

type Pokemon = Identifiable & {
  name: string;
};

// Não existe "extension" — usa-se composição ou utility types
type WithId<T> = T & { id: number };
```

**Diferença:** Swift protocols + extensions são muito mais poderosos. TypeScript interfaces são puramente estruturais (structural typing).

## Optional vs `| null` / `| undefined`

```swift
// Swift
var nickname: String? = nil  // Optional<String>
if let name = nickname {
    print(name)  // String (unwrapped)
}
let display = nickname ?? "Sem nome"  // nil coalescing
```

```ts
// TypeScript
let nickname: string | null = null;
if (nickname) {
    console.log(nickname);  // narrowed to string
}
const display = nickname ?? "Sem nome";  // nullish coalescing
```

**Diff:** Swift Optional é um enum (`some` / `none`). TypeScript usa union com `null` / `undefined`. Ambos têm narrowing automático após verificação.

## Error Handling

```swift
// Swift
func loadPokemon(id: Int) async throws -> Pokemon {
    let data = try await fetchData(id)
    return try JSONDecoder().decode(Pokemon.self, from: data)
}

do {
    let pokemon = try await loadPokemon(id: 1)
} catch {
    print(error)
}
```

```ts
// TypeScript
async function loadPokemon(id: number): Promise<PokemonCatalogItem> {
  const data = await fetchData(id);
  return data;  // já tipado, sem JSONDecoder
}

try {
  const pokemon = await loadPokemon(1);
} catch (error) {
  // error é unknown — precisa de type narrowing
  if (error instanceof Error) {
    console.error(error.message);
  }
}
```

**Diferença:** 
- Swift: `throws` é explícito na assinatura, `try` é obrigatório
- TypeScript: não existe `throws` na assinatura. Funções podem lançar sem declarar. `catch(error)` é sempre `unknown`

## Closures vs Arrow Functions

```swift
// Swift — closure
let double = { (x: Int) -> Int in x * 2 }
let sorted = pokemon.sorted { $0.id < $1.id }
```

```ts
// TypeScript
const double = (x: number): number => x * 2;
const sorted = pokemon.sort((a, b) => a.id - b.id);
```

## Generics

```swift
// Swift
func first<T>(_ array: [T]) -> T? {
    return array.first
}
```

```ts
// TypeScript
function first<T>(array: T[]): T | undefined {
  return array[0];
}
```

**Idênticos em conceito.** Sintaxe similar — `<T>` em ambos.

## Conclusão rápida

| Conceito | Swift | TypeScript |
|---|---|---|
| Tipagem | Forte, inferida | Forte, inferida, estrutural |
| null | `Optional<T>` (enum) | `T \| null` (union) |
| Enum | `enum` com raw/associated values | `type` union de strings |
| Protocol | `protocol` + `extension` | `interface` (structural, sem extension) |
| Error | `throws` explícito | Implícito, `catch` é `unknown` |
| Async | `async/await` (estruturado) | `async/await` (Promise-based) |
| Generics | `<T>` (similar) | `<T>` (similar) |
