import { getTypeMetadata } from "@/lib/type-metadata";
import type {
  DamageRelations,
  EvolutionChainLink,
  RawEvolutionChain,
  RawPokemon,
  RawPokemonSpecies,
  RawType,
} from "@/lib/pokeapi-client";
import type {
  PokemonCatalogItem,
  PokemonEvolutionItem,
  PokemonGender,
  PokemonTypeTag,
} from "@/lib/pokedex-types";

const GENERATION_NUMBERS: Record<string, number> = {
  "generation-i":    1,
  "generation-ii":   2,
  "generation-iii":  3,
  "generation-iv":   4,
  "generation-v":    5,
  "generation-vi":   6,
  "generation-vii":  7,
  "generation-viii": 8,
};

const REGION_BY_ID: [number, string][] = [
  [151, "kanto"],
  [251, "johto"],
  [386, "hoenn"],
  [493, "sinnoh"],
  [649, "unova"],
  [721, "kalos"],
  [809, "alola"],
  [905, "galar"],
];

// Todos os tipos Gen 1-8 na ordem usada pela PokéAPI
const ALL_TYPES = [
  "normal", "fighting", "flying", "poison", "ground", "rock",
  "bug", "ghost", "steel", "fire", "water", "grass",
  "electric", "psychic", "ice", "dragon", "dark", "fairy",
] as const;

function getRegionFromId(id: number): string {
  for (const [max, region] of REGION_BY_ID) {
    if (id <= max) return region;
  }
  return "galar";
}

function formatNumber(id: number): string {
  return `N°${String(id).padStart(3, "0")}`;
}

function formatWeight(hectograms: number): string {
  const kg = hectograms / 10;
  return `${kg.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} kg`;
}

function formatHeight(decimeters: number): string {
  const m = decimeters / 10;
  return `${m.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} m`;
}

function formatSlugAsName(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function getDisplayName(species: RawPokemonSpecies, fallbackSlug: string): string {
  const ptBr = species.names.find((n) => n.language.name === "pt-br")?.name;
  if (ptBr) return ptBr;
  const en = species.names.find((n) => n.language.name === "en")?.name;
  if (en) return en;
  return formatSlugAsName(fallbackSlug);
}

function getDescription(species: RawPokemonSpecies): string {
  // Tenta PT-BR primeiro (language 13 na PokéAPI), fallback para EN
  const entry =
    species.flavor_text_entries.find((e) => e.language.name === "pt-br") ??
    species.flavor_text_entries.find((e) => e.language.name === "en");
  if (!entry) return "";
  return entry.flavor_text
    .replace(/[\f\n\r\u000c]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getCategory(species: RawPokemonSpecies): string {
  const en = species.genera.find((g) => g.language.name === "en");
  return en ? en.genus.replace(" Pokémon", "").trim() : "";
}

function getAbility(pokemon: RawPokemon): string {
  const main = pokemon.abilities.find((a) => !a.is_hidden) ?? pokemon.abilities[0];
  if (!main) return "";
  return main.ability.name
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function getGender(genderRate: number): PokemonGender {
  // -1 indica Pokémon sem gênero
  if (genderRate === -1) return { male: 0, female: 0 };
  const female = (genderRate / 8) * 100;
  return { male: 100 - female, female };
}

function typeToTag(typeName: string): PokemonTypeTag {
  const meta = getTypeMetadata(typeName);
  return { key: meta.key, label: meta.label, color: meta.color, textColor: meta.textColor };
}

function computeWeaknesses(
  pokemonTypes: string[],
  typeDetails: RawType[],
): PokemonTypeTag[] {
  // Calcula efetividade combinada para todos os tipos de ataque (Gen 1-8)
  return ALL_TYPES.filter((attackType) => {
    let multiplier = 1;

    for (let i = 0; i < pokemonTypes.length; i++) {
      const relations: DamageRelations | undefined = typeDetails[i]?.damage_relations;
      if (!relations) continue;

      if (relations.no_damage_from.some((t) => t.name === attackType)) {
        multiplier = 0;
        break; // imune: multiplica por zero, não precisa continuar
      } else if (relations.double_damage_from.some((t) => t.name === attackType)) {
        multiplier *= 2;
      } else if (relations.half_damage_from.some((t) => t.name === attackType)) {
        multiplier *= 0.5;
      }
    }

    return multiplier >= 2;
  }).map(typeToTag);
}

function extractIdFromUrl(url: string): number {
  const match = url.match(/\/(\d+)\/?$/);
  return match ? parseInt(match[1], 10) : 0;
}

function officialArtworkUrl(id: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}

function flattenEvolutionChain(chain: RawEvolutionChain): PokemonEvolutionItem[] {
  const items: PokemonEvolutionItem[] = [];

  function traverse(link: EvolutionChainLink, level: string | null): void {
    const id = extractIdFromUrl(link.species.url);
    items.push({
      id,
      name: formatSlugAsName(link.species.name),
      number: formatNumber(id),
      image: officialArtworkUrl(id),
      level,
    });

    // Segue apenas o primeiro ramo para manter cadeia linear
    // Evoluções ramificadas (ex: Eevee) podem ser aprimoradas futuramente
    if (link.evolves_to.length > 0) {
      const next = link.evolves_to[0];
      const minLevel = next.evolution_details[0]?.min_level ?? null;
      traverse(next, minLevel !== null ? `Nível ${minLevel}` : null);
    }
  }

  traverse(chain.chain, null);
  return items;
}

export function mapToCatalogItem(
  pokemon: RawPokemon,
  species: RawPokemonSpecies,
  evolutionChain: RawEvolutionChain,
  typeDetails: RawType[],
): PokemonCatalogItem {
  const pokemonTypes = pokemon.types
    .sort((a, b) => a.slot - b.slot)
    .map((t) => t.type.name);

  const primaryTypeName = pokemonTypes[0] ?? "normal";
  const primaryMeta = getTypeMetadata(primaryTypeName);

  return {
    id: pokemon.id,
    name: getDisplayName(species, pokemon.name),
    slug: pokemon.name,
    number: formatNumber(pokemon.id),
    image:
      pokemon.sprites.other["official-artwork"].front_default ??
      officialArtworkUrl(pokemon.id),
    cardColor: primaryMeta.cardColor,
    heroColor: primaryMeta.heroColor,
    region: getRegionFromId(pokemon.id),
    generation: GENERATION_NUMBERS[species.generation.name] ?? 1,
    types: pokemonTypes.map(typeToTag),
    description: getDescription(species),
    weight: formatWeight(pokemon.weight),
    height: formatHeight(pokemon.height),
    category: getCategory(species),
    ability: getAbility(pokemon),
    gender: getGender(species.gender_rate),
    weaknesses: computeWeaknesses(pokemonTypes, typeDetails),
    evolution: flattenEvolutionChain(evolutionChain),
  };
}
