"use client";

import { HeartIcon } from "@/components/icons";
import { useFavoritesContext } from "@/lib/favorites-context";

type DetailFavoriteToggleProps = {
  id: number;
  name: string;
};

export function DetailFavoriteToggle({ id, name }: DetailFavoriteToggleProps) {
  const { favoriteIds, toggleFavorite } = useFavoritesContext();
  const favorite = favoriteIds.includes(id);

  return (
    <button
      type="button"
      onClick={() => toggleFavorite(id)}
      aria-label={favorite ? `Remover ${name} dos favoritos` : `Favoritar ${name}`}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-white/90 bg-black/10 text-white"
    >
      <HeartIcon className="h-6 w-6" filled={favorite} />
    </button>
  );
}
