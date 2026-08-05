# React Hooks no Projeto

Hooks são funções que permitem usar estado e efeitos em componentes React. Equivalente funcional às propriedades de View no SwiftUI.

## useState

Estado local do componente:

```ts
const [query, setQuery] = useState("");
const [type, setType] = useState("all");
const [sort, setSort] = useState<SortKey>(defaultSort);
```

**Swift:**
```swift
@State var query: String = ""
@State var type: String = "all"
@State var sort: SortKey = .az
```

## useEffect

Executa código após renderização (side effects):

```ts
// src/hooks/use-favorites.ts
useEffect(() => {
  void sync();  // busca favoritos da API ao montar
}, [sync]);     // array de dependências: reexecuta se sync mudar

// Limpeza (cleanup):
useEffect(() => {
  const timer = setInterval(() => { ... }, 1000);
  return () => clearInterval(timer);  // cleanup ao desmontar
}, []);
```

**Swift:**
```swift
.onAppear { await sync() }
// .onDisappear { ... } — equivalente ao cleanup
```

## useMemo

Cacheia valor computado. Só recalcula se dependências mudarem:

```ts
const filtered = useMemo(() => {
  const byType = initialCatalog.filter(pokemon => pokemon.types.some(t => t.key === type));
  const byText = byType.filter(pokemon => pokemon.name.toLowerCase().includes(normalized));
  return sortPokemonList(byText, sort);
}, [initialCatalog, deferredQuery, type, sort]);
// ↑ recalcula só quando essas 4 dependências mudam
```

**Swift:** `@State` já otimiza re-renderização. `useMemo` é útil quando a computação é cara (filtrar 905 Pokémon).

## useCallback

Cacheia função. Evita recriação a cada render (útil quando a função é passada como prop):

```ts
const handleClick = useCallback(() => {
  startTransition(() => {
    addTransitionType("nav-back");
    router.push(prev);
  });
}, [router, transitionTypes]);
// ↑ mesma instância da função enquanto router/transitionTypes não mudarem
```

**Swift:** equivalente a extrair um método da View — SwiftUI não recria closures a cada render como React.

## useDeferredValue

Versão "atrasada" de um estado. Útil para inputs de busca:

```ts
const [query, setQuery] = useState("");
const deferredQuery = useDeferredValue(query);
// query atualiza imediatamente no input
// deferredQuery atualiza depois, sem bloquear a UI
```

Isso faz o input ficar fluido enquanto a lista filtra em background. **Não tem equivalente direto no Swift.**

## useRef

Referência mutável que persiste entre renders. Não causa re-renderização:

```ts
// src/components/swipe-to-delete.tsx
const containerRef = useRef<HTMLDivElement>(null);

// src/hooks/use-infinite-scroll.ts
const sentinelRef = useRef<HTMLDivElement>(null);
```

**Swift:** não tem equivalente direto. O mais próximo é `@State private var frame: CGRect = .zero` com GeometryReader.

## useRouter (next/navigation)

Navegação programática:

```ts
import { useRouter } from "next/navigation";

const router = useRouter();
router.push("/pokedex");           // navega para frente
router.replace("/pokedex?q=char"); // substitui histórico
router.back();                     // ⚠️ não funciona com View Transitions!
```

**Swift:** `NavigationLink` ou `@Environment(\.dismiss)`

## useSearchParams (next/navigation)

Lê parâmetros da URL:

```ts
const searchParams = useSearchParams();
const query = searchParams.get("q");    // ?q=char
const type = searchParams.get("type");   // ?type=fire
```

**Swift:** `@State` + parsing manual da URL (não tem API nativa equivalente)

## Custom Hooks

O projeto tem hooks próprios que encapsulam lógica reutilizável:

```ts
// src/hooks/use-favorites.ts
export function useFavorites() {
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
  const toggleFavorite = useCallback(async (id: number) => { ... }, [favoriteIds]);
  return { favoriteIds, loading, error, toggleFavorite };
}

// src/hooks/use-pokedex-filters.ts
export const usePokedexFilters = ({ initialCatalog, typeFilters, defaultSort }) => {
  // query, type, sort, filtro, sort — tudo encapsulado
  return { query, setQuery, type, setType, sort, setSort, filtered };
};

// src/hooks/use-infinite-scroll.ts
export function useInfiniteScroll<T>(items: T[]) {
  // Intersection Observer, paginação
  return { visibleItems, hasMore, sentinelRef };
}
```

## Padrão do projeto

```
hooks/
├── use-favorites.ts          ← fetch + toggle favoritos
├── use-pokedex-filters.ts    ← busca, filtro, sort, URL params
├── use-infinite-scroll.ts    ← IntersectionObserver, paginação
└── __tests__/
    ├── use-favorites.test.ts
    └── use-pokedex-filters.test.ts
```

Cada hook retorna um objeto com estado + ações. Componentes consomem via destructuring.

**Swift (View Modifiers):** hooks são equivalentes a ViewModifiers ou View extensions que encapsulam lógica reutilizável.
