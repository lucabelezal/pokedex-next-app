"use client";

import { useCallback, useEffect, useState } from "react";
import { parseFavoriteIdsResponse } from "@/lib/runtime-validators";

export function useFavorites() {
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const sync = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/favorites", { cache: "no-store" });
      if (!response.ok) {
        throw new Error("Falha ao carregar favoritos.");
      }

      const data = await response.json();
      setFavoriteIds(parseFavoriteIdsResponse(data));
    } catch {
      setError("Nao foi possivel carregar favoritos.");
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
      setError(null);

      try {
        if (isFavorite) {
          const response = await fetch(`/api/favorites/${id}`, { method: "DELETE" });
          if (!response.ok) {
            throw new Error("Falha ao remover favorito.");
          }

          const data = await response.json();
          setFavoriteIds(parseFavoriteIdsResponse(data));
          return;
        }

        const response = await fetch("/api/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });

        if (!response.ok) {
          throw new Error("Falha ao adicionar favorito.");
        }

        const data = await response.json();
        setFavoriteIds(parseFavoriteIdsResponse(data));
      } catch {
        setError("Nao foi possivel atualizar favoritos.");
      }
    },
    [favoriteIds]
  );

  return {
    favoriteIds,
    loading,
    error,
    toggleFavorite,
    sync,
  };
}
