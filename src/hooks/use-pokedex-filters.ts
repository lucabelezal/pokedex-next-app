"use client";

import { useMemo, useState } from "react";
import { sortPokemonList } from "@/lib/pokedex-service";
import type { PokemonCatalogItem, SortKey } from "@/lib/pokedex-types";

export type PokedexTypeFilter = {
  key: string;
  label: string;
  color: string;
};

const parseSortKey = (value: string): SortKey => {
  switch (value) {
    case "az":
    case "za":
    case "number-asc":
    case "number-desc":
      return value;
    default:
      return "az";
  }
};

type UsePokedexFiltersParams = {
  initialCatalog: PokemonCatalogItem[];
  typeFilters: PokedexTypeFilter[];
  defaultSort: SortKey;
};

export const usePokedexFilters = ({
  initialCatalog,
  typeFilters,
  defaultSort,
}: UsePokedexFiltersParams) => {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("all");
  const [sort, setSort] = useState<SortKey>(defaultSort);

  const selectedTypeColor = useMemo(
    () => (type !== "all" ? (typeFilters.find((filter) => filter.key === type)?.color ?? "") : ""),
    [type, typeFilters]
  );

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    const byType = initialCatalog.filter((pokemon) => {
      if (type === "all") {
        return true;
      }

      return pokemon.types.some((pokemonType) => pokemonType.key === type);
    });

    const byText = byType.filter((pokemon) => {
      if (!normalized) {
        return true;
      }

      return (
        pokemon.name.toLowerCase().includes(normalized) ||
        String(pokemon.id).includes(normalized)
      );
    });

    return sortPokemonList(byText, sort);
  }, [initialCatalog, query, type, sort]);

  return {
    query,
    setQuery,
    type,
    setType,
    sort,
    setSort,
    parseSortKey,
    selectedTypeColor,
    filtered,
  };
};
