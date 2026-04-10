const globalForFavorites = globalThis as unknown as {
  __pokedexFavorites?: Set<number>;
};

function getFavoritesSet() {
  if (!globalForFavorites.__pokedexFavorites) {
    globalForFavorites.__pokedexFavorites = new Set<number>();
  }

  return globalForFavorites.__pokedexFavorites;
}

export function listFavoriteIds() {
  return Array.from(getFavoritesSet()).sort((a, b) => a - b);
}

export function addFavorite(id: number) {
  getFavoritesSet().add(id);
  return listFavoriteIds();
}

export function removeFavorite(id: number) {
  getFavoritesSet().delete(id);
  return listFavoriteIds();
}

export function isFavorite(id: number) {
  return getFavoritesSet().has(id);
}
