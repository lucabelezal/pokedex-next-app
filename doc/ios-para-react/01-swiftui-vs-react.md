# SwiftUI → React: Mapeamento de Conceitos

## Views vs Components

```swift
// SwiftUI
struct PokemonCard: View {
    let pokemon: Pokemon

    var body: some View {
        VStack {
            Text(pokemon.name)
            Text("#\(pokemon.id)")
        }
    }
}
```

```tsx
// React
export function PokemonCard({ pokemon }: { pokemon: PokemonCatalogItem }) {
  return (
    <div>
      <h3>{pokemon.name}</h3>
      <p>N°{pokemon.id}</p>
    </div>
  );
}
```

**Diff:** SwiftUI usa `struct` + `body`. React usa `function` + `return`. Ambos são declarativos. React retorna JSX (HTML-like), SwiftUI retorna View DSL.

## @State vs useState

```swift
// SwiftUI
@State private var query = ""
@State private var type = "all"
```

```ts
// React
const [query, setQuery] = useState("");
const [type, setType] = useState("all");
```

**Diff:** SwiftUI usa property wrapper. React usa tupla `[value, setter]`. Ambos causam re-renderização quando o valor muda.

## @Binding vs Props + Callback

```swift
// SwiftUI
struct ChildView: View {
    @Binding var isOn: Bool
    // Child pode ler E escrever isOn
}
```

```tsx
// React — props são read-only
type ChildProps = {
  isOn: boolean;
  setIsOn: (value: boolean) => void;
};

function Child({ isOn, setIsOn }: ChildProps) {
  // Lê isOn, escreve via setIsOn
}
```

**Diff:** SwiftUI tem two-way binding nativo. React é one-way data flow — dados descem via props, eventos sobem via callbacks.

## @StateObject / @ObservedObject vs Context

```swift
// SwiftUI
class FavoritesStore: ObservableObject {
    @Published var favoriteIds: [Int] = []
}

struct ContentView: View {
    @StateObject var store = FavoritesStore()

    var body: some View {
        PokemonList()
            .environmentObject(store)  // Provider
    }
}

struct PokemonCard: View {
    @EnvironmentObject var store: FavoritesStore  // Consumer
}
```

```tsx
// React — Context API (src/lib/favorites-context.tsx)
<FavoritesProvider>            {/* Provider */}
  <PokedexListClient />          {/* Consumer via useFavoritesContext() */}
</FavoritesProvider>

function PokedexListClient() {
  const { favoriteIds, toggleFavorite } = useFavoritesContext();
}
```

**Diff:** Conceito idêntico. SwiftUI usa `@EnvironmentObject`, React usa `createContext` + `useContext`.

## .onAppear vs useEffect

```swift
// SwiftUI
.onAppear { await loadFavorites() }
```

```ts
// React
useEffect(() => {
  void sync();
}, [sync]);
```

## @Environment vs useRouter / usePathname

```swift
// SwiftUI
@Environment(\.dismiss) var dismiss
NavigationLink(destination: DetailView())
```

```ts
// React
const router = useRouter();
const pathname = usePathname();
router.push("/pokedex");
```

| SwiftUI | React |
|---|---|
| `NavigationLink` | `<Link href="...">` |
| `@Environment(\.dismiss)` | `router.back()` |
| `NavigationStack` | App Router (file-based) |
| `.navigationTitle` | `<h1>` no layout da página |
| `TabView` | `<TabBar>` (custom component) |

## VStack / HStack / ZStack vs Flexbox

```swift
// SwiftUI
VStack {
    Text("Nome")
    HStack {
        Image("icon")
        Text("Valor")
    }
}
```

```tsx
// React + Tailwind
<div className="flex flex-col">   {/* VStack = flex-col */}
  <p>Nome</p>
  <div className="flex">           {/* HStack = flex */}
    <img src="icon" />
    <p>Valor</p>
  </div>
</div>
```

| SwiftUI | Tailwind |
|---|---|
| `VStack` | `flex flex-col` |
| `HStack` | `flex` |
| `ZStack` | `relative` + `absolute` |
| `Spacer()` | `flex-1` |
| `.padding(16)` | `p-4` |
| `.background(Color.blue)` | `bg-blue-500` |
| `.cornerRadius(16)` | `rounded-[16px]` |
| `.shadow(radius: 4)` | `shadow` |

## if let / guard let vs Optional Chaining + ??

```swift
// SwiftUI
if let pokemon = pokemon {
    Text(pokemon.name)
}

// ou
guard let heroColor = pokemon?.heroColor else { return }
```

```tsx
// React
{pokemon && <p>{pokemon.name}</p>}

// Optional chaining
const color = pokemon?.heroColor ?? "#000";
```

## ForEach vs .map()

```swift
// SwiftUI
ForEach(pokemon.types, id: \.key) { type in
    TypeBadge(type: type)
}
```

```tsx
// React
{pokemon.types.map(type => (
  <TypeBadge key={type.key} type={type} />
))}
```

**IMPORTANTE:** React precisa de `key` em listas. Sempre use um ID único. NUNCA use `index` como key.

## Chamadas de API

```swift
// Swift (async/await com URLSession)
func loadPokemon(id: Int) async throws -> Pokemon {
    let url = URL(string: "https://pokeapi.co/api/v2/pokemon/\(id)")!
    let (data, _) = try await URLSession.shared.data(from: url)
    return try JSONDecoder().decode(Pokemon.self, from: data)
}
```

```ts
// React/Next.js Server Component (src/lib/pokeapi-client.ts)
async function apiFetch<T>(url: string): Promise<T> {
  const res = await fetch(url, CACHE_OPTIONS);
  if (!res.ok) throw new PokeApiError(res.status, url);
  return res.json() as Promise<T>;
}
```

**Diff:** Muito similar. Ambos usam `async/await`. Diferenças:
- Swift: `URLSession`, `JSONDecoder` (precisa de struct Decodable)
- React: `fetch()` nativo, `.json()` (não precisa de Decodable — os tipos são verificados em compile-time)
