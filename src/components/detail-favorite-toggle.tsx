"use client";

import { useCallback, useEffect, useState } from "react";
import { HeartIcon } from "@/components/icons";
import { parseFavoriteIdsResponse } from "@/lib/runtime-validators";

type DetailFavoriteToggleProps = {
  id: number;
  name: string;
};

export function DetailFavoriteToggle({ id, name }: DetailFavoriteToggleProps) {
  const [favorite, setFavorite] = useState(false);

  const parseFavoriteState = useCallback((ids: number[]) => {
    setFavorite(ids.includes(id));
  }, [id]);

  useEffect(() => {
    let mounted = true;

    async function load() {
      const response = await fetch("/api/favorites", { cache: "no-store" });
      if (!response.ok) {
        return;
      }

      const data = await response.json();
      const ids = parseFavoriteIdsResponse(data);

      if (mounted) {
        parseFavoriteState(ids);
      }
    }

    void load();

    return () => {
      mounted = false;
    };
  }, [id, parseFavoriteState]);

  const toggle = async () => {
    if (favorite) {
      const response = await fetch(`/api/favorites/${id}`, { method: "DELETE" });
      if (!response.ok) {
        return;
      }

      const data = await response.json();
      parseFavoriteState(parseFavoriteIdsResponse(data));
      return;
    }

    const response = await fetch("/api/favorites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (!response.ok) {
      return;
    }

    const data = await response.json();
    parseFavoriteState(parseFavoriteIdsResponse(data));
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={favorite ? `Remover ${name} dos favoritos` : `Favoritar ${name}`}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-white/90 bg-black/10 text-white"
    >
      <HeartIcon className="h-6 w-6" filled={favorite} />
    </button>
  );
}
