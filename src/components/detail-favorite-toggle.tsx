"use client";

import { useEffect, useState } from "react";
import { HeartIcon } from "@/components/icons";

type DetailFavoriteToggleProps = {
  id: number;
  name: string;
};

export function DetailFavoriteToggle({ id, name }: DetailFavoriteToggleProps) {
  const [favorite, setFavorite] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function load() {
      const response = await fetch("/api/favorites", { cache: "no-store" });
      const data = (await response.json()) as { ids: number[] };

      if (mounted) {
        setFavorite((data.ids ?? []).includes(id));
      }
    }

    void load();

    return () => {
      mounted = false;
    };
  }, [id]);

  const toggle = async () => {
    if (favorite) {
      const response = await fetch(`/api/favorites/${id}`, { method: "DELETE" });
      const data = (await response.json()) as { ids: number[] };
      setFavorite((data.ids ?? []).includes(id));
      return;
    }

    const response = await fetch("/api/favorites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    const data = (await response.json()) as { ids: number[] };
    setFavorite((data.ids ?? []).includes(id));
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
