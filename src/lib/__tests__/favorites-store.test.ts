import { beforeEach, describe, expect, it } from "vitest";
import {
  addFavorite,
  isFavorite,
  listFavoriteIds,
  removeFavorite,
  resetFavoritesStore,
} from "@/lib/favorites-store";

describe("favorites-store", () => {
  beforeEach(() => {
    resetFavoritesStore();
  });

  it("should start empty", () => {
    expect(listFavoriteIds()).toEqual([]);
  });

  it("should add ids and keep sorted order", () => {
    addFavorite(150);
    addFavorite(25);

    expect(listFavoriteIds()).toEqual([25, 150]);
  });

  it("should not duplicate same id", () => {
    addFavorite(25);
    addFavorite(25);

    expect(listFavoriteIds()).toEqual([25]);
  });

  it("should remove existing id", () => {
    addFavorite(25);
    addFavorite(150);

    removeFavorite(25);

    expect(listFavoriteIds()).toEqual([150]);
    expect(isFavorite(25)).toBe(false);
  });

  it("should reset store", () => {
    addFavorite(25);

    resetFavoritesStore();

    expect(listFavoriteIds()).toEqual([]);
  });
});
