import { cache } from "react";
import {
  PokeApiError,
  fetchEvolutionChain,
  fetchPokemon,
  fetchPokemonSpecies,
  fetchType,
} from "@/lib/pokeapi-client";
import { mapToCatalogItem } from "@/lib/pokeapi-mappers";
import { getAllTypeMetadata } from "@/lib/type-metadata";
import type { PokemonCatalogItem, SortKey } from "@/lib/pokedex-types";

// Re-exporta funções que continuam usando dados estáticos (JSON local)
export {
  getAppConfig,
  getRegionByKey,
  getRegionsCatalog,
  getUserProfile,
  sortPokemonList,
} from "@/lib/pokedex-service";

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

// Tamanho de lote para requisições paralelas à PokéAPI
const BATCH_SIZE = 50;

async function buildPokemonCatalogItem(id: number): Promise<PokemonCatalogItem | null> {
  try {
    const [pokemon, species] = await Promise.all([
      fetchPokemon(id),
      fetchPokemonSpecies(id),
    ]);

    const [evolutionChain, ...typeDetails] = await Promise.all([
      fetchEvolutionChain(species.evolution_chain.url),
      ...pokemon.types
        .sort((a, b) => a.slot - b.slot)
        .map((t) => fetchType(t.type.name)),
    ]);

    return mapToCatalogItem(pokemon, species, evolutionChain, typeDetails);
  } catch (error) {
    // 404: Pokémon inexistente no intervalo, retorna null sem ruído
    if (error instanceof PokeApiError && error.status === 404) {
      return null;
    }
    // Outros erros (rede, rate limit, 5xx): loga e repropaga para falhar o build
    console.error(`[pokeapi] Falha ao construir item do catálogo para id ${id}:`, error);
    throw error;
  }
}

async function fetchInBatches(ids: number[]): Promise<PokemonCatalogItem[]> {
  const results: PokemonCatalogItem[] = [];

  for (let i = 0; i < ids.length; i += BATCH_SIZE) {
    const batch = ids.slice(i, i + BATCH_SIZE);
    const batchResults = await Promise.all(batch.map(buildPokemonCatalogItem));
    results.push(...batchResults.filter((p): p is PokemonCatalogItem => p !== null));
  }

  return results;
}

export const getPokemonCatalog = cache(async (): Promise<PokemonCatalogItem[]> => {
  const ids = Array.from({ length: 905 }, (_, i) => i + 1);
  return fetchInBatches(ids);
});

export async function getPokemonById(id: number): Promise<PokemonCatalogItem | null> {
  return buildPokemonCatalogItem(id);
}

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

export type { SortKey };
