import appConfigData from "@/data/mocks/app-config.json";
import catalogData from "@/data/mocks/pokemon-catalog.json";
import regionsData from "@/data/mocks/regions.json";
import userProfileData from "@/data/mocks/user-profile.json";
import { REGION_RANGES } from "@/lib/pokedex-constants";
import { validateAppConfig, validatePokemonCatalog, validateRegions, validateUserProfile } from "@/lib/runtime-validators";
import type { AppConfig, PokemonCatalogItem, RegionItem, SortKey, UserProfile } from "@/lib/pokedex-types";

const appConfig = validateAppConfig(appConfigData);
const catalog = validatePokemonCatalog(catalogData);
const regions = validateRegions(regionsData);
const userProfile = validateUserProfile(userProfileData);

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

export { REGION_RANGES } from "@/lib/pokedex-constants";

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
