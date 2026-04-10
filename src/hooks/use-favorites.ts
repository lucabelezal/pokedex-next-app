"use client";

import { useCallback, useEffect, useState } from "react";

export function useFavorites() {
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  const sync = useCallback(async () => {
    setLoading(true);

    try {
      const response = await fetch("/api/favorites", { cache: "no-store" });
      const data = (await response.json()) as { ids: number[] };
      setFavoriteIds(data.ids ?? []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void sync();
  }, [sync]);

  const toggleFavorite = useCallback(
    async (id: number) => {
      const isFavorite = favoriteIds.includes(id);

      if (isFavorite) {
        const response = await fetch(`/api/favorites/${id}`, { method: "DELETE" });
        const data = (await response.json()) as { ids: number[] };
        setFavoriteIds(data.ids ?? []);
      } else {
        const response = await fetch("/api/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });
        const data = (await response.json()) as { ids: number[] };
        setFavoriteIds(data.ids ?? []);
      }
    },
    [favoriteIds]
  );

  return {
    favoriteIds,
    loading,
    toggleFavorite,
    sync,
  };
}
