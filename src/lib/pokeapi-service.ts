import { unstable_cache } from "next/cache";
import { graphqlFetch } from "@/lib/graphql-client";
import { mapGqlPokemonToCatalogItem } from "@/lib/graphql-mappers";
import {
  GET_POKEMON_BATCH,
  GET_POKEMON_BY_ID,
  type GetPokemonBatchResult,
  type GetPokemonByIdResult,
} from "@/lib/graphql-queries";
import { REGION_RANGES } from "@/lib/pokedex-service";
import { getAllTypeMetadata } from "@/lib/type-metadata";
import type { PokemonCatalogItem } from "@/lib/pokedex-types";

// Re-exporta funções que continuam usando dados estáticos (JSON local)
export {
  getAppConfig,
  getRegionByKey,
  getRegionsCatalog,
  getUserProfile,
  sortPokemonList,
} from "@/lib/pokedex-service";

// GraphQL permite buscar 100 Pokémon por requisição (antes: 4 chamadas REST por Pokémon).
// 905 Pokémon ÷ 100 = ~10 requisições GraphQL vs ~3620 chamadas REST anteriores.
const BATCH_SIZE = 100;

async function fetchPokemonBatch(ids: number[]): Promise<PokemonCatalogItem[]> {
  const data = await graphqlFetch<GetPokemonBatchResult>(
    GET_POKEMON_BATCH,
    { ids },
    "getPokemonBatch",
  );
  return data.pokemon.map(mapGqlPokemonToCatalogItem);
}

async function fetchInBatches(ids: number[]): Promise<PokemonCatalogItem[]> {
  const results: PokemonCatalogItem[] = [];

  for (let i = 0; i < ids.length; i += BATCH_SIZE) {
    const batch = ids.slice(i, i + BATCH_SIZE);
    const batchResults = await fetchPokemonBatch(batch);
    results.push(...batchResults);
  }

  return results;
}

// catálogo completo cacheado — segunda navegação para /pokedex é instantânea
export const getPokemonCatalog = unstable_cache(
  async (): Promise<PokemonCatalogItem[]> => {
    const ids = Array.from({ length: 905 }, (_, i) => i + 1);
    return fetchInBatches(ids);
  },
  ["pokemon-catalog"],
  { revalidate: 3600 },
);

export const getPokemonById = unstable_cache(
  async (id: number): Promise<PokemonCatalogItem | null> => {
    const data = await graphqlFetch<GetPokemonByIdResult>(
      GET_POKEMON_BY_ID,
      { id },
      "getPokemonById",
    );
    const pokemon = data.pokemon[0];
    if (!pokemon) return null;
    return mapGqlPokemonToCatalogItem(pokemon);
  },
  ["pokemon-item"],
  { revalidate: 3600 },
);

export async function getPokemonByRegion(regionKey: string): Promise<PokemonCatalogItem[]> {
  const range = REGION_RANGES[regionKey];
  if (!range) return [];
  const ids = Array.from({ length: range[1] - range[0] + 1 }, (_, i) => range[0] + i);
  return fetchInBatches(ids);
}

// Retorna os 905 IDs de forma síncrona (sem precisar buscar o catálogo inteiro)
export function getStaticPokemonParams(): { id: string }[] {
  return Array.from({ length: 905 }, (_, i) => ({ id: String(i + 1) }));
}

// Filtros derivados do mapa de tipos estático (não depende do catálogo)
export function getAvailableTypeFilters(): { key: string; label: string; color: string }[] {
  return [
    { key: "all", label: "Todos os tipos", color: "" },
    ...getAllTypeMetadata()
      .sort((a, b) => a.label.localeCompare(b.label, "pt-BR"))
      .map(({ key, label, color }) => ({ key, label, color })),
  ];
}


