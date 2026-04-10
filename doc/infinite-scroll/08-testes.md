# 08 — Testes

## Estratégia de testes para scroll infinito com Vitest

---

### O problema: JSDOM não implementa IntersectionObserver

O Vitest usa JSDOM como ambiente de testes. JSDOM não implementa
`IntersectionObserver` nem geometria de scroll. É necessário um mock.

---

### Mock de IntersectionObserver

```typescript
// src/hooks/__tests__/use-infinite-scroll.test.ts

// Guarda o callback do observer para disparar manualmente nos testes
let intersectionCallback: IntersectionObserverCallback;

const MockIntersectionObserver = vi.fn().mockImplementation((callback) => {
  intersectionCallback = callback;
  return {
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  };
});

beforeEach(() => {
  vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
  vi.stubGlobal("scrollTo", vi.fn()); // window.scrollTo não existe no JSDOM
});

afterEach(() => {
  vi.unstubAllGlobals();
});

// Helper para simular o sentinel entrando no viewport
function triggerIntersection(isIntersecting = true) {
  intersectionCallback(
    [{ isIntersecting } as IntersectionObserverEntry],
    {} as IntersectionObserver,
  );
}
```

---

### Casos de teste essenciais

```typescript
import { renderHook, act } from "@testing-library/react";
import { useInfiniteScroll } from "../use-infinite-scroll";

describe("useInfiniteScroll", () => {

  // 1. Carregamento inicial
  it("expõe apenas os primeiros 20 itens na primeira renderização", () => {
    const items = Array.from({ length: 100 }, (_, i) => ({ id: i }));
    const { result } = renderHook(() => useInfiniteScroll(items));

    expect(result.current.visibleItems).toHaveLength(20);
    expect(result.current.hasMore).toBe(true);
  });

  // 2. Carrega mais ao disparar o observer
  it("carrega mais 20 itens quando o sentinel entra no viewport", () => {
    const items = Array.from({ length: 100 }, (_, i) => ({ id: i }));
    const { result } = renderHook(() => useInfiniteScroll(items));

    act(() => triggerIntersection(true));

    expect(result.current.visibleItems).toHaveLength(40);
    expect(result.current.hasMore).toBe(true);
  });

  // 3. Não carrega quando não há mais itens
  it("não dispara loadMore quando hasMore é false", () => {
    const items = Array.from({ length: 15 }, (_, i) => ({ id: i }));
    const { result } = renderHook(() => useInfiniteScroll(items));

    expect(result.current.visibleItems).toHaveLength(15);
    expect(result.current.hasMore).toBe(false);

    act(() => triggerIntersection(true));

    expect(result.current.visibleItems).toHaveLength(15); // sem mudança
  });

  // 4. Não carrega quando isIntersecting é false
  it("ignora entradas de interseção com isIntersecting false", () => {
    const items = Array.from({ length: 100 }, (_, i) => ({ id: i }));
    const { result } = renderHook(() => useInfiniteScroll(items));

    act(() => triggerIntersection(false));

    expect(result.current.visibleItems).toHaveLength(20); // sem mudança
  });

  // 5. Reset ao mudar o array de itens (filtro aplicado)
  it("reseta para a primeira página quando items muda", () => {
    const items100 = Array.from({ length: 100 }, (_, i) => ({ id: i }));
    const items30 = Array.from({ length: 30 }, (_, i) => ({ id: i }));

    const { result, rerender } = renderHook(
      ({ items }) => useInfiniteScroll(items),
      { initialProps: { items: items100 } },
    );

    // Carrega a segunda página
    act(() => triggerIntersection(true));
    expect(result.current.visibleItems).toHaveLength(40);

    // Simula troca de filtro (novo array)
    rerender({ items: items30 });

    expect(result.current.visibleItems).toHaveLength(20); // reset para página 1
  });

  // 6. scrollTo é chamado ao mudar itens
  it("chama window.scrollTo ao resetar após mudança de filtro", () => {
    const items100 = Array.from({ length: 100 }, (_, i) => ({ id: i }));
    const items50 = Array.from({ length: 50 }, (_, i) => ({ id: i + 100 }));

    const { rerender } = renderHook(
      ({ items }) => useInfiniteScroll(items),
      { initialProps: { items: items100 } },
    );

    rerender({ items: items50 });

    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "instant" });
  });

  // 7. hasMore é false quando todos os itens são visíveis
  it("hasMore é false quando visibleItems === items.length", () => {
    const items = Array.from({ length: 100 }, (_, i) => ({ id: i }));
    const { result } = renderHook(() => useInfiniteScroll(items));

    // Scroll até o fim
    for (let i = 0; i < 5; i++) {
      act(() => triggerIntersection(true));
    }

    expect(result.current.visibleItems).toHaveLength(100);
    expect(result.current.hasMore).toBe(false);
  });

  // 8. pageSize customizado
  it("respeita pageSize customizado passado nas options", () => {
    const items = Array.from({ length: 100 }, (_, i) => ({ id: i }));
    const { result } = renderHook(() =>
      useInfiniteScroll(items, { pageSize: 10 }),
    );

    expect(result.current.visibleItems).toHaveLength(10);

    act(() => triggerIntersection(true));
    expect(result.current.visibleItems).toHaveLength(20);
  });
});
```

---

### Teste de integração: PokedexListClient

```typescript
// src/components/__tests__/pokedex-list-client-scroll.test.tsx

import { render, screen } from "@testing-library/react";
import { PokedexListClient } from "../pokedex-list-client";
import { mockCatalog, mockTypeFilters, mockConfig } from "@/data/mocks/test-fixtures";

describe("PokedexListClient — scroll infinito", () => {

  it("renderiza apenas os primeiros 20 pokémon inicialmente", () => {
    render(
      <PokedexListClient
        initialCatalog={mockCatalog} // 905 itens
        typeFilters={mockTypeFilters}
        config={mockConfig}
      />
    );

    // Apenas os primeiros 20 nomes devem estar no DOM
    expect(screen.getByText(mockCatalog[0].name)).toBeInTheDocument();
    expect(screen.queryByText(mockCatalog[20].name)).not.toBeInTheDocument();
  });

  it("mostra mensagem de fim quando todos os itens são exibidos", () => {
    const fewItems = mockCatalog.slice(0, 5); // lista pequena

    render(
      <PokedexListClient
        initialCatalog={fewItems}
        typeFilters={mockTypeFilters}
        config={mockConfig}
      />
    );

    expect(screen.getByText("Você viu todos os Pokémon")).toBeInTheDocument();
  });
});
```

---

### Executar os testes

```bash
# Todos os testes
npm test

# Watch mode
npm run test:watch

# Coverage
npm run test:coverage
```

→ Próximo: [09-stack.md](./09-stack.md)
