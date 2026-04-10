"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const PAGE_SIZE_DEFAULT = 20;

type UseInfiniteScrollOptions = {
  pageSize?: number;
  /**
   * Distância em pixels antes do sentinel entrar no viewport para disparar
   * o carregamento do próximo lote. 200px garante que o próximo batch
   * já está pronto quando o usuário chega ao fim, eliminando o flash de
   * conteúdo vazio — padrão adotado por feeds do Instagram e Google Images.
   */
  rootMargin?: string;
};

type UseInfiniteScrollResult<T> = {
  visibleItems: T[];
  hasMore: boolean;
  sentinelRef: React.RefObject<HTMLDivElement | null>;
};

/**
 * Hook genérico de scroll infinito via IntersectionObserver.
 *
 * Recebe o array já filtrado/ordenado e expõe apenas o slice visível.
 * Quando `items` muda (novo filtro aplicado), reseta automaticamente
 * para a primeira página e volta o scroll ao topo — comportamento padrão
 * em apps mobile (Instagram, TikTok, App Store).
 *
 * Não instala dependências externas: usa apenas APIs nativas do browser,
 * mantendo o bundle inalterado.
 */
export function useInfiniteScroll<T>(
  items: T[],
  { pageSize = PAGE_SIZE_DEFAULT, rootMargin = "200px" }: UseInfiniteScrollOptions = {},
): UseInfiniteScrollResult<T> {
  const [page, setPage] = useState(1);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // Quando os items mudam (filtro ou ordenação aplicados), volta para
  // a primeira página e rola ao topo — o usuário está iniciando uma
  // nova consulta e a posição anterior não tem valor semântico.
  useEffect(() => {
    setPage(1);
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [items]);

  const visibleItems = useMemo(
    () => items.slice(0, page * pageSize),
    [items, page, pageSize],
  );

  const hasMore = visibleItems.length < items.length;

  // useCallback garante identidade estável para o loadMore,
  // evitando que o observer seja recriado a cada render.
  const loadMore = useCallback(() => {
    if (hasMore) {
      setPage((prev) => prev + 1);
    }
  }, [hasMore]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          loadMore();
        }
      },
      { rootMargin },
    );

    observer.observe(sentinel);

    return () => {
      observer.unobserve(sentinel);
      observer.disconnect();
    };
  }, [loadMore, rootMargin]);

  return { visibleItems, hasMore, sentinelRef };
}
