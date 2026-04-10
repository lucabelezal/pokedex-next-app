const BASE_URL = "https://pokeapi.co/api/v2";

// Cache de 24h: dados da PokéAPI mudam raramente
const CACHE_OPTIONS = { next: { revalidate: 86400 } } as const;

type NamedAPIResource = { name: string; url: string };

export type RawPokemon = {
  id: number;
  name: string;
  weight: number; // hectogramas (÷10 = kg)
  height: number; // decímetros (÷10 = m)
  types: { slot: number; type: NamedAPIResource }[];
  abilities: { ability: NamedAPIResource; is_hidden: boolean; slot: number }[];
  sprites: {
    other: {
      "official-artwork": { front_default: string | null };
    };
  };
  species: NamedAPIResource;
};

export type RawPokemonSpecies = {
  id: number;
  name: string;
  gender_rate: number; // -1 = sem gênero, 0-8 (rate/8 = % fêmea)
  generation: NamedAPIResource;
  flavor_text_entries: {
    flavor_text: string;
    language: NamedAPIResource;
    version: NamedAPIResource;
  }[];
  genera: { genus: string; language: NamedAPIResource }[];
  names: { name: string; language: NamedAPIResource }[];
  evolution_chain: { url: string };
};

export type EvolutionChainLink = {
  species: NamedAPIResource;
  evolves_to: EvolutionChainLink[];
  evolution_details: { min_level: number | null }[];
};

export type RawEvolutionChain = {
  id: number;
  chain: EvolutionChainLink;
};

export type DamageRelations = {
  double_damage_from: NamedAPIResource[];
  half_damage_from: NamedAPIResource[];
  no_damage_from: NamedAPIResource[];
};

export type RawType = {
  damage_relations: DamageRelations;
};

async function apiFetch<T>(url: string): Promise<T> {
  const res = await fetch(url, CACHE_OPTIONS);
  if (!res.ok) {
    throw new Error(`PokéAPI ${res.status}: ${url}`);
  }
  return res.json() as Promise<T>;
}

export function fetchPokemon(id: number): Promise<RawPokemon> {
  return apiFetch<RawPokemon>(`${BASE_URL}/pokemon/${id}`);
}

export function fetchPokemonSpecies(id: number): Promise<RawPokemonSpecies> {
  return apiFetch<RawPokemonSpecies>(`${BASE_URL}/pokemon-species/${id}`);
}

export function fetchEvolutionChain(url: string): Promise<RawEvolutionChain> {
  return apiFetch<RawEvolutionChain>(url);
}

export function fetchType(name: string): Promise<RawType> {
  return apiFetch<RawType>(`${BASE_URL}/type/${name}`);
}
