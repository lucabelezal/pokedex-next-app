import { describe, expect, it } from "vitest";
import { mapToCatalogItem } from "@/lib/pokeapi-mappers";
import type {
  RawEvolutionChain,
  RawPokemon,
  RawPokemonSpecies,
  RawType,
} from "@/lib/pokeapi-client";

function makeBulbasaur(): RawPokemon {
  return {
    id: 1,
    name: "bulbasaur",
    weight: 69,
    height: 7,
    types: [
      { slot: 1, type: { name: "grass", url: "" } },
      { slot: 2, type: { name: "poison", url: "" } },
    ],
    abilities: [
      { ability: { name: "overgrow", url: "" }, is_hidden: false, slot: 1 },
    ],
    sprites: {
      other: {
        "official-artwork": {
          front_default:
            "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png",
        },
      },
    },
    species: { name: "bulbasaur", url: "" },
  };
}

function makeBulbasaurSpecies(): RawPokemonSpecies {
  return {
    id: 1,
    name: "bulbasaur",
    gender_rate: 1,
    generation: { name: "generation-i", url: "" },
    flavor_text_entries: [
      {
        flavor_text:
          "A strange seed was\nplanted on its\nback at birth.\fThe plant sprouts\nand grows with\nthis POKéMON.",
        language: { name: "en", url: "" },
        version: { name: "red", url: "" },
      },
      {
        flavor_text:
          "Uma semente estranha\nfoi plantada nas\ncostas ao nascer.\nA planta brota\ne cresce com\nesse POKéMON.",
        language: { name: "pt-br", url: "" },
        version: { name: "red", url: "" },
      },
    ],
    genera: [
      {
        genus: "Seed Pokémon",
        language: { name: "en", url: "" },
      },
    ],
    names: [
      { name: "Bulbasaur", language: { name: "en", url: "" } },
      { name: "Bulbassauro", language: { name: "pt-br", url: "" } },
    ],
    evolution_chain: { url: "" },
  };
}

function makeBulbasaurChain(): RawEvolutionChain {
  return {
    id: 1,
    chain: {
      species: { name: "bulbasaur", url: "https://pokeapi.co/api/v2/pokemon-species/1/" },
      evolves_to: [
        {
          species: { name: "ivysaur", url: "https://pokeapi.co/api/v2/pokemon-species/2/" },
          evolves_to: [
            {
              species: {
                name: "venusaur",
                url: "https://pokeapi.co/api/v2/pokemon-species/3/",
              },
              evolves_to: [],
              evolution_details: [{ min_level: 32 }],
            },
          ],
          evolution_details: [{ min_level: 16 }],
        },
      ],
      evolution_details: [],
    },
  };
}

function makeTypeDetails(): RawType[] {
  return [
    {
      damage_relations: {
        double_damage_from: [
          { name: "fire", url: "" },
          { name: "ice", url: "" },
          { name: "flying", url: "" },
          { name: "psychic", url: "" },
        ],
        half_damage_from: [
          { name: "water", url: "" },
          { name: "electric", url: "" },
          { name: "grass", url: "" },
          { name: "fighting", url: "" },
          { name: "fairy", url: "" },
        ],
        no_damage_from: [],
      },
    },
    {
      damage_relations: {
        double_damage_from: [
          { name: "ground", url: "" },
          { name: "psychic", url: "" },
        ],
        half_damage_from: [
          { name: "fighting", url: "" },
          { name: "poison", url: "" },
          { name: "bug", url: "" },
          { name: "grass", url: "" },
          { name: "fairy", url: "" },
        ],
        no_damage_from: [],
      },
    },
  ];
}

describe("mapToCatalogItem", () => {
  it("should map Bulbasaur to a complete catalog item", () => {
    const pokemon = makeBulbasaur();
    const species = makeBulbasaurSpecies();
    const chain = makeBulbasaurChain();
    const typeDetails = makeTypeDetails();

    const item = mapToCatalogItem(pokemon, species, chain, typeDetails);

    expect(item.id).toBe(1);
    expect(item.name).toBe("Bulbassauro");
    expect(item.slug).toBe("bulbasaur");
    expect(item.number).toBe("N°001");
    expect(item.region).toBe("kanto");
    expect(item.generation).toBe(1);
    expect(item.weight).toBe("6,9 kg");
    expect(item.height).toBe("0,7 m");
    expect(item.category).toBe("Seed");
    expect(item.ability).toBe("Overgrow");
  });

  it("should have PT-BR description when available", () => {
    const pokemon = makeBulbasaur();
    const species = makeBulbasaurSpecies();
    const chain = makeBulbasaurChain();
    const typeDetails = makeTypeDetails();

    const item = mapToCatalogItem(pokemon, species, chain, typeDetails);

    expect(item.description).toBe(
      "Uma semente estranha foi plantada nas costas ao nascer. A planta brota e cresce com esse POKéMON."
    );
  });

  it("should fallback to EN name when PT-BR is missing", () => {
    const pokemon = makeBulbasaur();
    const species = {
      ...makeBulbasaurSpecies(),
      names: [{ name: "Bulbasaur", language: { name: "en", url: "" } }],
    };
    const chain = makeBulbasaurChain();
    const typeDetails = makeTypeDetails();

    const item = mapToCatalogItem(pokemon, species, chain, typeDetails);

    expect(item.name).toBe("Bulbasaur");
  });

  it("should assign types sorted by slot", () => {
    const pokemon = makeBulbasaur();
    const species = makeBulbasaurSpecies();
    const chain = makeBulbasaurChain();
    const typeDetails = makeTypeDetails();

    const item = mapToCatalogItem(pokemon, species, chain, typeDetails);

    expect(item.types).toHaveLength(2);
    expect(item.types[0].key).toBe("grass");
    expect(item.types[1].key).toBe("poison");
  });

  it("should compute combined weaknesses correctly for Bulbasaur (Grass/Poison)", () => {
    const pokemon = makeBulbasaur();
    const species = makeBulbasaurSpecies();
    const chain = makeBulbasaurChain();
    const typeDetails = makeTypeDetails();

    const item = mapToCatalogItem(pokemon, species, chain, typeDetails);

    const weaknessKeys = item.weaknesses.map((w) => w.key);
    expect(weaknessKeys).toContain("fire");
    expect(weaknessKeys).toContain("psychic");
    expect(weaknessKeys).toContain("flying");
    expect(weaknessKeys).toContain("ice");
    expect(weaknessKeys).not.toContain("water");
  });

  it("should build evolution chain with levels", () => {
    const pokemon = makeBulbasaur();
    const species = makeBulbasaurSpecies();
    const chain = makeBulbasaurChain();
    const typeDetails = makeTypeDetails();

    const item = mapToCatalogItem(pokemon, species, chain, typeDetails);

    expect(item.evolution).toHaveLength(3);
    expect(item.evolution[0].name).toBe("Bulbasaur");
    expect(item.evolution[0].level).toBeNull();
    expect(item.evolution[1].name).toBe("Ivysaur");
    expect(item.evolution[1].level).toBe("Nível 16");
    expect(item.evolution[2].name).toBe("Venusaur");
    expect(item.evolution[2].level).toBe("Nível 32");
  });

  it("should assign correct cardColor and heroColor from primary type", () => {
    const pokemon = makeBulbasaur();
    const species = makeBulbasaurSpecies();
    const chain = makeBulbasaurChain();
    const typeDetails = makeTypeDetails();

    const item = mapToCatalogItem(pokemon, species, chain, typeDetails);

    expect(item.cardColor).toMatch(/^#[0-9a-fA-F]{6}$/);
    expect(item.heroColor).toMatch(/^#[0-9a-fA-F]{6}$/);
  });

  it("should handle gender_rate correctly", () => {
    const pokemon = makeBulbasaur();
    const species = makeBulbasaurSpecies();
    const chain = makeBulbasaurChain();
    const typeDetails = makeTypeDetails();

    const item = mapToCatalogItem(pokemon, species, chain, typeDetails);

    expect(item.gender.male).toBe(87.5);
    expect(item.gender.female).toBe(12.5);
  });

  it("should fallback to EN description when PT-BR not available", () => {
    const pokemon = makeBulbasaur();
    const species: RawPokemonSpecies = {
      ...makeBulbasaurSpecies(),
      flavor_text_entries: [
        {
          flavor_text: "A strange seed was planted on its back at birth.",
          language: { name: "en", url: "" },
          version: { name: "red", url: "" },
        },
      ],
    };
    const chain = makeBulbasaurChain();
    const typeDetails = makeTypeDetails();

    const item = mapToCatalogItem(pokemon, species, chain, typeDetails);

    expect(item.description).toBe("A strange seed was planted on its back at birth.");
  });

  it("should use fallback image when official-artwork is null", () => {
    const pokemon: RawPokemon = {
      ...makeBulbasaur(),
      sprites: {
        other: {
          "official-artwork": { front_default: null },
        },
      },
    };
    const species = makeBulbasaurSpecies();
    const chain = makeBulbasaurChain();
    const typeDetails = makeTypeDetails();

    const item = mapToCatalogItem(pokemon, species, chain, typeDetails);

    expect(item.image).toBe(
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png"
    );
  });
});
