"use client";

import { useMemo, useState, useDeferredValue, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { sortPokemonList } from "@/lib/pokeapi-service";
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
  const searchParams = useSearchParams();
  const router = useRouter();

  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [type, setType] = useState(searchParams.get("type") ?? "all");
  const [sort, setSort] = useState<SortKey>(
    parseSortKey(searchParams.get("sort") ?? defaultSort)
  );
  const deferredQuery = useDeferredValue(query);

  useEffect(() => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (type !== "all") params.set("type", type);
    if (sort !== "az") params.set("sort", sort);

    const next = params.toString();
    const current = searchParams.toString();
    if (next !== current) {
      router.replace(next ? `?${next}` : window.location.pathname, { scroll: false });
    }
  }, [query, type, sort, router, searchParams]);

  const selectedTypeColor = useMemo(
    () => (type !== "all" ? (typeFilters.find((filter) => filter.key === type)?.color ?? "") : ""),
    [type, typeFilters]
  );

  const filtered = useMemo(() => {
    const normalized = deferredQuery.trim().toLowerCase();

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
  }, [initialCatalog, deferredQuery, type, sort]);

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
