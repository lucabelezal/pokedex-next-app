// Tipos que espelham a resposta GraphQL da PokéAPI v1beta2

export type GqlTypeEfficacy = {
  damage_factor: number; // 0=imune, 50=resistente, 100=normal, 200=fraco, 400=muito fraco
  type: { name: string }; // tipo atacante
};

export type GqlPokemonType = {
  slot: number;
  type: {
    name: string;
    // Eficácias onde ESTE tipo é o defensor — usadas para calcular fraquezas
    TypeefficaciesByTargetTypeId: GqlTypeEfficacy[];
  };
};

export type GqlPokemonAbility = {
  is_hidden: boolean;
  slot: number;
  ability: { name: string };
};

export type GqlSpritesJson = {
  other?: { "official-artwork"?: { front_default?: string | null } };
  front_default?: string | null;
};

export type GqlPokemonSprites = {
  sprites: GqlSpritesJson | string | null;
};

export type GqlEvolutionSpecies = {
  id: number;
  name: string;
  order: number;
  evolves_from_species_id: number | null;
  // Condições de evolução para chegar NESTA espécie a partir da anterior
  pokemonevolutions: Array<{ min_level: number | null }>;
};

export type GqlPokemonSpecy = {
  gender_rate: number;
  generation: { name: string };
  pokemonspeciesnames: Array<{
    name: string;
    genus: string | null;
    language: { name: string };
  }>;
  pokemonspeciesflavortexts: Array<{
    flavor_text: string;
    language: { name: string };
  }>;
  evolutionchain: {
    pokemonspecies: GqlEvolutionSpecies[];
  };
};

export type GqlPokemon = {
  id: number;
  name: string;
  height: number;
  weight: number;
  pokemontypes: GqlPokemonType[];
  pokemonabilities: GqlPokemonAbility[];
  pokemonsprites: GqlPokemonSprites[];
  pokemonspecy: GqlPokemonSpecy;
};

// Fragmento reutilizável com todos os campos necessários para montar PokemonCatalogItem
const POKEMON_FIELDS = `
  id
  name
  height
  weight
  pokemontypes(order_by: {slot: asc}) {
    slot
    type {
      name
      TypeefficaciesByTargetTypeId {
        damage_factor
        type { name }
      }
    }
  }
  pokemonabilities(order_by: {slot: asc}) {
    is_hidden
    slot
    ability { name }
  }
  pokemonsprites(limit: 1) {
    sprites
  }
  pokemonspecy {
    gender_rate
    generation { name }
    pokemonspeciesnames(where: {language: {name: {_in: ["en", "pt-br"]}}}) {
      name
      genus
      language { name }
    }
    pokemonspeciesflavortexts(
      where: {language: {name: {_in: ["en", "pt-br"]}}}
      order_by: {version_id: asc}
      limit: 6
    ) {
      flavor_text
      language { name }
    }
    evolutionchain {
      pokemonspecies(order_by: {order: asc}) {
        id
        name
        order
        evolves_from_species_id
        pokemonevolutions(limit: 1) {
          min_level
        }
      }
    }
  }
`;

// Busca um único Pokémon por ID
export const GET_POKEMON_BY_ID = `
  query getPokemonById($id: Int!) {
    pokemon(where: {id: {_eq: $id}}) {
      ${POKEMON_FIELDS}
    }
  }
`;

// Busca um lote de Pokémon por lista de IDs — substitui N requests REST por 1 request GraphQL
export const GET_POKEMON_BATCH = `
  query getPokemonBatch($ids: [Int!]!) {
    pokemon(
      where: {id: {_in: $ids}}
      order_by: {id: asc}
    ) {
      ${POKEMON_FIELDS}
    }
  }
`;

export type GetPokemonByIdResult = { pokemon: GqlPokemon[] };
export type GetPokemonBatchResult = { pokemon: GqlPokemon[] };
