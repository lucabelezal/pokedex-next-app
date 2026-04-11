
import { describe, it, expect, vi } from 'vitest';
import { render, renderHook, act } from '@testing-library/react';
import { useInfiniteScroll } from '../use-infinite-scroll';

// Mantém referência ao callback do IntersectionObserver para acionar nos testes
let intersectionCallback: IntersectionObserverCallback | null = null;

// Mock global do IntersectionObserver: jsdom não implementa esta API
vi.stubGlobal(
  'IntersectionObserver',
  class MockIntersectionObserver {
    constructor(cb: IntersectionObserverCallback) {
      intersectionCallback = cb;
    }
    observe() {}
    unobserve() {}
    disconnect() {}
  },
);

// Mock do scrollTo: jsdom não implementa scrollTo
vi.stubGlobal('scrollTo', () => {});

describe('useInfiniteScroll', () => {
  const items = Array.from({ length: 50 }, (_, i) => `item-${i + 1}`);

  it('deve retornar apenas o primeiro pageSize por padrão', () => {
    const { result } = renderHook(() => useInfiniteScroll(items));
    expect(result.current.visibleItems).toHaveLength(20);
    expect(result.current.hasMore).toBe(true);
  });

  it('deve aumentar o número de itens visíveis ao chamar loadMore', () => {
    // Renderiza via componente real para que o sentinelRef seja anexado ao DOM
    // e o useEffect crie o IntersectionObserver com o sentinel presente
    const TestComponent = () => {
      const { visibleItems, sentinelRef } = useInfiniteScroll(items);
      return (
        <>
          <span data-testid="count">{visibleItems.length}</span>
          <div ref={sentinelRef} />
        </>
      );
    };

    const { getByTestId } = render(<TestComponent />);
    expect(getByTestId('count').textContent).toBe('20');

    // Simula intersecção acionando o callback do IntersectionObserver diretamente
    act(() => {
      intersectionCallback?.(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      );
    });

    expect(parseInt(getByTestId('count').textContent!)).toBeGreaterThan(20);
  });

  it('deve resetar para a primeira página quando items muda', () => {
    const { result, rerender } = renderHook(
      ({ arr }) => useInfiniteScroll(arr),
      { initialProps: { arr: items } },
    );
    rerender({ arr: items.slice(0, 10) });
    expect(result.current.visibleItems).toHaveLength(10);
    expect(result.current.hasMore).toBe(false);
  });
});
