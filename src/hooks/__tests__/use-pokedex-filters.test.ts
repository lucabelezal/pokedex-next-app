// @vitest-environment jsdom

import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { usePokedexFilters } from "@/hooks/use-pokedex-filters";
import type { PokemonCatalogItem } from "@/lib/pokedex-types";

const mockReplace = vi.fn();

vi.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(),
  useRouter: () => ({ replace: mockReplace }),
}));

beforeEach(() => {
  mockReplace.mockClear();
});

function makeMockCatalog(): PokemonCatalogItem[] {
  return [
    {
      id: 1,
      name: "Bulbassauro",
      slug: "bulbasaur",
      number: "N°001",
      image: "https://example.com/1.png",
      cardColor: "#dce3d6",
      heroColor: "#9bc233",
      region: "kanto",
      generation: 1,
      types: [
        { key: "grass", label: "Grama", color: "#57b956", textColor: "#111" },
        { key: "poison", label: "Venenoso", color: "#b466d8", textColor: "#111" },
      ],
      description: "",
      weight: "6.9 kg",
      height: "0.7 m",
      category: "Seed",
      ability: "Overgrow",
      gender: { male: 87.5, female: 12.5 },
      weaknesses: [],
      evolution: [],
    },
    {
      id: 4,
      name: "Charmander",
      slug: "charmander",
      number: "N°004",
      image: "https://example.com/4.png",
      cardColor: "#e9e0d9",
      heroColor: "#f39b52",
      region: "kanto",
      generation: 1,
      types: [
        { key: "fire", label: "Fogo", color: "#f39b52", textColor: "#111" },
      ],
      description: "",
      weight: "8.5 kg",
      height: "0.6 m",
      category: "Lizard",
      ability: "Blaze",
      gender: { male: 87.5, female: 12.5 },
      weaknesses: [],
      evolution: [],
    },
    {
      id: 7,
      name: "Squirtle",
      slug: "squirtle",
      number: "N°007",
      image: "https://example.com/7.png",
      cardColor: "#d7dde5",
      heroColor: "#4d8dd9",
      region: "kanto",
      generation: 1,
      types: [
        { key: "water", label: "Água", color: "#79a8e5", textColor: "#111" },
      ],
      description: "",
      weight: "9.0 kg",
      height: "0.5 m",
      category: "Tiny Turtle",
      ability: "Torrent",
      gender: { male: 87.5, female: 12.5 },
      weaknesses: [],
      evolution: [],
    },
  ];
}

const typeFilters = [
  { key: "all", label: "Todos os tipos", color: "" },
  { key: "grass", label: "Grama", color: "#57b956" },
  { key: "fire", label: "Fogo", color: "#f39b52" },
  { key: "water", label: "Água", color: "#79a8e5" },
  { key: "poison", label: "Venenoso", color: "#b466d8" },
];

describe("usePokedexFilters", () => {
  it("should return full catalog with default filters", () => {
    const catalog = makeMockCatalog();
    const { result } = renderHook(() =>
      usePokedexFilters({
        initialCatalog: catalog,
        typeFilters,
        defaultSort: "az",
      })
    );

    expect(result.current.filtered).toHaveLength(3);
    expect(result.current.query).toBe("");
    expect(result.current.type).toBe("all");
    expect(result.current.sort).toBe("az");
  });

  it("should filter by type", () => {
    const catalog = makeMockCatalog();
    const { result } = renderHook(() =>
      usePokedexFilters({
        initialCatalog: catalog,
        typeFilters,
        defaultSort: "az",
      })
    );

    act(() => {
      result.current.setType("fire");
    });

    expect(result.current.filtered).toHaveLength(1);
    expect(result.current.filtered[0].name).toBe("Charmander");
  });

  it("should filter by text search (name)", () => {
    const catalog = makeMockCatalog();
    const { result } = renderHook(() =>
      usePokedexFilters({
        initialCatalog: catalog,
        typeFilters,
        defaultSort: "az",
      })
    );

    act(() => {
      result.current.setQuery("squirt");
    });

    expect(result.current.filtered).toHaveLength(1);
    expect(result.current.filtered[0].name).toBe("Squirtle");
  });

  it("should filter by text search (id number)", () => {
    const catalog = makeMockCatalog();
    const { result } = renderHook(() =>
      usePokedexFilters({
        initialCatalog: catalog,
        typeFilters,
        defaultSort: "az",
      })
    );

    act(() => {
      result.current.setQuery("4");
    });

    expect(result.current.filtered).toHaveLength(1);
    expect(result.current.filtered[0].name).toBe("Charmander");
  });

  it("should sort by name ascending (az)", () => {
    const catalog = makeMockCatalog();
    const { result } = renderHook(() =>
      usePokedexFilters({
        initialCatalog: catalog,
        typeFilters,
        defaultSort: "az",
      })
    );

    const names = result.current.filtered.map((p) => p.name);
    expect(names).toEqual(["Bulbassauro", "Charmander", "Squirtle"]);
  });

  it("should sort by name descending (za)", () => {
    const catalog = makeMockCatalog();
    const { result } = renderHook(() =>
      usePokedexFilters({
        initialCatalog: catalog,
        typeFilters,
        defaultSort: "za",
      })
    );

    const names = result.current.filtered.map((p) => p.name);
    expect(names).toEqual(["Squirtle", "Charmander", "Bulbassauro"]);
  });

  it("should sort by number ascending", () => {
    const catalog = makeMockCatalog();
    const { result } = renderHook(() =>
      usePokedexFilters({
        initialCatalog: catalog,
        typeFilters,
        defaultSort: "number-asc",
      })
    );

    const ids = result.current.filtered.map((p) => p.id);
    expect(ids).toEqual([1, 4, 7]);
  });

  it("should sort by number descending", () => {
    const catalog = makeMockCatalog();
    const { result } = renderHook(() =>
      usePokedexFilters({
        initialCatalog: catalog,
        typeFilters,
        defaultSort: "number-desc",
      })
    );

    const ids = result.current.filtered.map((p) => p.id);
    expect(ids).toEqual([7, 4, 1]);
  });

  it("should combine type filter and text search", () => {
    const catalog = makeMockCatalog();
    const { result } = renderHook(() =>
      usePokedexFilters({
        initialCatalog: catalog,
        typeFilters,
        defaultSort: "az",
      })
    );

    act(() => {
      result.current.setType("grass");
    });
    act(() => {
      result.current.setQuery("bulba");
    });

    expect(result.current.filtered).toHaveLength(1);
    expect(result.current.filtered[0].name).toBe("Bulbassauro");
  });

  it("should return selectedTypeColor for active type filter", () => {
    const catalog = makeMockCatalog();
    const { result } = renderHook(() =>
      usePokedexFilters({
        initialCatalog: catalog,
        typeFilters,
        defaultSort: "az",
      })
    );

    act(() => {
      result.current.setType("fire");
    });

    expect(result.current.selectedTypeColor).toBe("#f39b52");
  });

  it("should return empty color for 'all' type", () => {
    const catalog = makeMockCatalog();
    const { result } = renderHook(() =>
      usePokedexFilters({
        initialCatalog: catalog,
        typeFilters,
        defaultSort: "az",
      })
    );

    expect(result.current.selectedTypeColor).toBe("");
  });

  it("should parse valid sort keys", () => {
    const catalog = makeMockCatalog();
    const { result } = renderHook(() =>
      usePokedexFilters({
        initialCatalog: catalog,
        typeFilters,
        defaultSort: "az",
      })
    );

    expect(result.current.parseSortKey("az")).toBe("az");
    expect(result.current.parseSortKey("number-desc")).toBe("number-desc");
  });

  it("should fallback to az for invalid sort key", () => {
    const catalog = makeMockCatalog();
    const { result } = renderHook(() =>
      usePokedexFilters({
        initialCatalog: catalog,
        typeFilters,
        defaultSort: "az",
      })
    );

    expect(result.current.parseSortKey("invalid")).toBe("az");
  });
});
