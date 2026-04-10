# 10 — Prompts

## Prompts prontos para implementar scroll infinito em outros projetos

> Copie o prompt adequado, ajuste as variáveis entre `< >` e cole
> no agente de sua escolha. Os prompts são independentes entre si.

---

## Prompt 1: Devin (agente autônomo, execução completa)

> Devin executa tasks de forma autônoma sem interação. O prompt deve ser
> completo, sem ambiguidades, com critérios de aceite verificáveis.

---

```
You are implementing infinite scroll for a list component in a React/Next.js
project. Read all existing code before writing anything. Follow the
architecture described below exactly.

---

CONTEXT

- Framework: Next.js App Router (React 19+)
- Styling: Tailwind CSS v4
- Data: <DESCRIBE: static JSON / REST API with cursor pagination>
- Delivery: PWA in native WebView (iOS/Android)
- List component: <PATH: e.g. src/components/product-list-client.tsx>
- Data hook: <PATH: e.g. src/hooks/use-product-filters.ts>
  └─ exposes: <VARIABLE: e.g. filtered> — the full filtered array

---

WHAT TO BUILD

1. Create src/hooks/use-infinite-scroll.ts

   - Generic hook: useInfiniteScroll<T>(items: T[], options?)
   - options: { pageSize?: number (default 20), rootMargin?: string (default "200px") }
   - Returns: { visibleItems: T[], hasMore: boolean, sentinelRef: RefObject<HTMLDivElement> }
   - Internal state: page (number, starts at 1)
   - visibleItems = useMemo(() => items.slice(0, page * pageSize), [items, page, pageSize])
   - hasMore = visibleItems.length < items.length
   - useEffect([items]): reset page to 1 AND call window.scrollTo({ top: 0, behavior: "instant" })
     (items changes when filters change — new array reference from useMemo)
   - useEffect([loadMore, rootMargin]): register IntersectionObserver on sentinelRef
     with rootMargin option. Cleanup on unmount. Use useCallback on loadMore
     to keep observer stable across renders.

2. Modify <PATH: list component>

   - Import useInfiniteScroll
   - Call: const { visibleItems, hasMore, sentinelRef } = useInfiniteScroll(<filtered variable>)
   - Replace <filtered variable>.map(...) with visibleItems.map(...)
   - After the last item, add:
     {hasMore && (
       <div ref={sentinelRef} className="flex items-center justify-center py-6" aria-hidden="true">
         <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#cccccc] border-t-[#333333]" />
       </div>
     )}
     {!hasMore && <filtered variable>.length > 0 && (
       <p className="py-6 text-center text-[13px] text-[#999999]">
         <END OF LIST MESSAGE>
       </p>
     )}

---

CONSTRAINTS

- Do NOT install any new dependencies
- Do NOT modify the filter/sort hook
- Do NOT add comments that just restate the code
- Use TypeScript strict mode — no `any`
- All comments in <LANGUAGE: e.g. Portuguese (pt-BR)>

---

ACCEPTANCE CRITERIA — verify all before finishing

1. npx tsc --noEmit passes with zero errors
2. npm run build generates successfully
3. Open browser DevTools > Elements: DOM has < 200 nodes after initial load
4. Apply a filter → list resets to first 20 items, scroll goes to top
5. Scroll to bottom → all items eventually load
6. When all items are visible: spinner is gone, end-of-list message appears
7. Items array with <= pageSize items: no spinner appears, end message shows immediately

---

DO NOT:
- Add pagination buttons
- Add "showing X of Y" counters
- Install react-infinite-scroller, react-window, or similar libraries
- Wrap in React Query (unless data source is already using it)
- Use scroll event listeners (use IntersectionObserver only)
```

---

## Prompt 2: GitHub Copilot com Skills e Agentes

> Para usar no VS Code com GitHub Copilot Chat.
> Requer o agente padrão + skills `react-best-practices` instaladas.

---

```
Implemente scroll infinito na lista de <NOME DO COMPONENTE>.

Antes de escrever qualquer código:
1. Use o agente Explore para ler o componente de lista e o hook de filtros.
   Identifique: como os dados chegam, qual variável contém o array filtrado,
   e onde o .map() está no JSX.

Siga esta implementação exata:

---

PASSO 1 — Criar src/hooks/use-infinite-scroll.ts

Hook genérico `useInfiniteScroll<T>`:
- Parâmetros: items: T[], options?: { pageSize?: number; rootMargin?: string }
- Padrões: pageSize=20, rootMargin="200px"
- Retorna: { visibleItems, hasMore, sentinelRef }
- Reset com scrollTo ao topo quando items muda (useEffect com [items])
- IntersectionObserver com rootMargin no sentinelRef (useEffect com [loadMore, rootMargin])
- loadMore em useCallback para observer estável

PASSO 2 — Modificar o componente de lista

- Adicionar useInfiniteScroll(<variável filtrada>)
- Trocar <variável>.map() por visibleItems.map()
- Adicionar sentinel com spinner (aria-hidden="true") quando hasMore=true
- Adicionar mensagem de fim quando !hasMore && items.length > 0

---

RESTRIÇÕES:
- Zero dependências novas
- Não modificar o hook de filtros
- TypeScript strict, sem any
- Comentários em português (pt-BR) apenas onde explicam lógica não-óbvia

CRITÉRIOS DE ACEITE:
- npm run type-check passa
- npm run build gera sem erros
- Trocar filtro → lista reseta + scroll ao topo
- Scroll até o fim → todos os itens aparecem
```

---

## Prompt 3: Devin — Variante com API real (React Query)

> Use este prompt quando o projeto já tem um backend com paginação cursor-based.

---

```
You are adding infinite scroll to a list that fetches data from a paginated
REST API using cursor-based pagination.

---

CONTEXT

- Framework: Next.js App Router (React 19+)
- Data fetching: @tanstack/react-query (already installed)
- API contract:
  GET /api/<RESOURCE>?cursor=<string|undefined>&limit=20&<FILTER_PARAMS>
  Response: { items: T[], nextCursor: string | null, hasMore: boolean }
- List component: <PATH>
- Query key: <QUERY_KEY e.g. ['products', { category, sort }]>

---

WHAT TO BUILD

1. Create src/hooks/use-infinite-scroll.ts
   (same implementation as the static version — receives items[], not fetcher)

2. Create src/hooks/use-<resource>-infinite-query.ts

   import { useInfiniteQuery } from "@tanstack/react-query";

   export function use<Resource>InfiniteQuery(filters: <FiltersType>) {
     const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
       useInfiniteQuery({
         queryKey: [<QUERY_KEY>, filters],
         queryFn: ({ pageParam }) =>
           fetch<Resource>({ cursor: pageParam ?? undefined, limit: 20, ...filters })
             .then(res => res.json()),
         getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
         initialPageParam: null,
       });

     const allItems = data?.pages.flatMap(page => page.items) ?? [];

     return { allItems, fetchNextPage, hasNextPage, isFetchingNextPage };
   }

3. Integrate in list component

   - Use use<Resource>InfiniteQuery instead of static data
   - Pass allItems to useInfiniteScroll
   - Connect sentinel to fetchNextPage (instead of page increment)
   - Show loading state with isFetchingNextPage

---

ACCEPTANCE CRITERIA

1. npx tsc --noEmit + npm run build pass
2. Network tab shows requests only when sentinel is near viewport
3. Changing filters resets to first page (queryKey changes → cache miss)
4. No duplicate items on page boundaries
5. hasNextPage=false → end of list message appears
```

---

## Referências desta implementação

Os arquivos criados neste projeto estão em:

```
src/hooks/use-infinite-scroll.ts        ← hook (referência de implementação)
src/components/pokedex-list-client.tsx  ← integração no componente
doc/infinite-scroll/01-problema.md      ← diagnóstico do problema
doc/infinite-scroll/02-abordagens.md    ← tradeoffs de cada padrão
doc/infinite-scroll/03-decisao.md       ← ADR formal
doc/infinite-scroll/04-arquitetura.md   ← fluxo de dados e camadas
doc/infinite-scroll/05-api-design.md    ← design de API para escala
doc/infinite-scroll/06-performance.md   ← frame budget e WebView
doc/infinite-scroll/07-ux.md            ← comportamento e acessibilidade
doc/infinite-scroll/08-testes.md        ← mock de IO e casos de teste
doc/infinite-scroll/09-stack.md         ← WebView + React + Next.js
doc/infinite-scroll/10-prompts.md       ← este arquivo
```
