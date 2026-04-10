import appConfigData from "@/data/mocks/app-config.json";
import catalogData from "@/data/mocks/pokemon-catalog.json";
import regionsData from "@/data/mocks/regions.json";
import userProfileData from "@/data/mocks/user-profile.json";
import type { AppConfig, PokemonCatalogItem, RegionItem, SortKey, UserProfile } from "@/lib/pokedex-types";
import { parseAppConfig, parsePokemonCatalog, parseRegions, parseUserProfile } from "@/lib/runtime-validators";

const appConfig = parseAppConfig(appConfigData, "app-config.json");
const catalog = parsePokemonCatalog(catalogData, "pokemon-catalog.json");
const regions = parseRegions(regionsData, "regions.json");
const userProfile = parseUserProfile(userProfileData, "user-profile.json");

export function getAppConfig(): AppConfig {
  return appConfig;
}

export function getUserProfile(): UserProfile {
  return userProfile;
}

export function getPokemonCatalog(): PokemonCatalogItem[] {
  return [...catalog];
}

export function getPokemonById(id: number): PokemonCatalogItem | null {
  return catalog.find((pokemon) => pokemon.id === id) ?? null;
}

export function getRegionsCatalog(): RegionItem[] {
  return [...regions];
}

export function getStaticPokemonParams() {
  return catalog.map((pokemon) => ({ id: String(pokemon.id) }));
}

export function getAvailableTypeFilters() {
  const typeData = new Map<string, { label: string; color: string }>();

  for (const pokemon of catalog) {
    for (const type of pokemon.types) {
      if (!typeData.has(type.key)) {
        typeData.set(type.key, { label: type.label, color: type.color });
      }
    }
  }

  return [
    { key: "all", label: "Todos os tipos", color: "" },
    ...Array.from(typeData.entries())
      .sort((a, b) => a[1].label.localeCompare(b[1].label, "pt-BR"))
      .map(([key, { label, color }]) => ({ key, label, color })),
  ];
}

const REGION_RANGES: Record<string, [number, number]> = {
  kanto:  [1,   151],
  johto:  [152, 251],
  hoenn:  [252, 386],
  sinnoh: [387, 493],
  unova:  [494, 649],
  kalos:  [650, 721],
  alola:  [722, 809],
  galar:  [810, 905],
};

export function getPokemonByRegion(regionKey: string): PokemonCatalogItem[] {
  const range = REGION_RANGES[regionKey];
  if (!range) return [];
  return catalog.filter((p) => p.id >= range[0] && p.id <= range[1]);
}

export function getRegionByKey(key: string): RegionItem | null {
  return regions.find((r) => r.key === key) ?? null;
}

export function sortPokemonList(list: PokemonCatalogItem[], sort: SortKey) {
  const sorted = [...list];

  sorted.sort((a, b) => {
    if (sort === "az") {
      return a.name.localeCompare(b.name, "pt-BR");
    }

    if (sort === "za") {
      return b.name.localeCompare(a.name, "pt-BR");
    }

    if (sort === "number-desc") {
      return b.id - a.id;
    }

    return a.id - b.id;
  });

  return sorted;
}
