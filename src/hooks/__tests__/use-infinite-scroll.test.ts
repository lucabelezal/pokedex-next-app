

import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeAll } from 'vitest';
import { useInfiniteScroll } from '../use-infinite-scroll';

// Mock global window.scrollTo e IntersectionObserver para evitar erros do jsdom
beforeAll(() => {
  if (typeof window !== 'undefined') {
    window.scrollTo = () => {};
    // Mock IntersectionObserver
    // @ts-expect-error: mockando IntersectionObserver no ambiente de teste jsdom
    window.IntersectionObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    };
    // Não é necessário @ts-expect-error: atribuição permitida em ambiente de teste
    (global as { IntersectionObserver?: typeof window.IntersectionObserver }).IntersectionObserver = window.IntersectionObserver;
  }
});

describe('useInfiniteScroll', () => {
  const items = Array.from({ length: 50 }, (_, i) => `item-${i + 1}`);

  it('deve retornar os primeiros itens e hasMore true', () => {
    const { result } = renderHook(() => useInfiniteScroll(items));
    expect(result.current.visibleItems.length).toBe(20);
    expect(result.current.hasMore).toBe(true);
  });


  it('deve resetar para a primeira página quando items muda', () => {
    const { result, rerender } = renderHook(
      ({ arr }) => useInfiniteScroll(arr),
      { initialProps: { arr: items } }
    );
    // Avança página
    act(() => {
      // Não é necessário @ts-expect-error: sentinelRef é mockado no teste
      if (result.current.sentinelRef && typeof result.current.sentinelRef === 'object') {
        (result.current.sentinelRef as React.MutableRefObject<HTMLDivElement | null>).current = document.createElement('div');
      }
    });
    // Simula mudança de items
    const newItems = Array.from({ length: 10 }, (_, i) => `novo-${i + 1}`);
    rerender({ arr: newItems });
    expect(result.current.visibleItems.length).toBe(10);
    expect(result.current.hasMore).toBe(false);
  });
});
