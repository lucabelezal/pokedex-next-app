import { getTypeMetadata } from "@/lib/type-metadata";
import type {
  GqlEvolutionSpecies,
  GqlPokemon,
  GqlPokemonType,
  GqlSpritesJson,
} from "@/lib/graphql-queries";
import type {
  PokemonCatalogItem,
  PokemonEvolutionItem,
  PokemonGender,
  PokemonTypeTag,
} from "@/lib/pokedex-types";

// Todos os tipos Gen 1-8 na ordem usada pela PokéAPI
const ALL_TYPES = [
  "normal", "fighting", "flying", "poison", "ground", "rock",
  "bug", "ghost", "steel", "fire", "water", "grass",
  "electric", "psychic", "ice", "dragon", "dark", "fairy",
] as const;

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

function officialArtworkUrl(id: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}

function typeToTag(typeName: string): PokemonTypeTag {
  const meta = getTypeMetadata(typeName);
  return { key: meta.key, label: meta.label, color: meta.color, textColor: meta.textColor };
}

function getImage(pokemon: GqlPokemon): string {
  const raw = pokemon.pokemonsprites[0]?.sprites;
  if (raw) {
    // Hasura retorna JSONB como objeto, mas pode vir como string em algumas versões
    const parsed: GqlSpritesJson =
      typeof raw === "string" ? (JSON.parse(raw) as GqlSpritesJson) : raw;
    const frontDefault = parsed?.other?.["official-artwork"]?.front_default;
    if (frontDefault) return frontDefault;
  }
  return officialArtworkUrl(pokemon.id);
}

function getDisplayName(pokemon: GqlPokemon): string {
  const names = pokemon.pokemonspecy.pokemonspeciesnames;
  const ptBr = names.find((n) => n.language.name === "pt-br")?.name;
  if (ptBr) return ptBr;
  const en = names.find((n) => n.language.name === "en")?.name;
  if (en) return en;
  return formatSlugAsName(pokemon.name);
}

function getDescription(pokemon: GqlPokemon): string {
  const texts = pokemon.pokemonspecy.pokemonspeciesflavortexts;
  const entry =
    texts.find((e) => e.language.name === "pt-br") ??
    texts.find((e) => e.language.name === "en");
  if (!entry) return "";
  return entry.flavor_text
    .replace(/[\f\n\r\u000c]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getCategory(pokemon: GqlPokemon): string {
  const enEntry = pokemon.pokemonspecy.pokemonspeciesnames.find(
    (n) => n.language.name === "en",
  );
  const genus = enEntry?.genus ?? "";
  return genus.replace(" Pokémon", "").trim();
}

function getAbility(pokemon: GqlPokemon): string {
  const abilities = pokemon.pokemonabilities;
  const main = abilities.find((a) => !a.is_hidden) ?? abilities[0];
  if (!main) return "";
  return main.ability.name
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function getGender(genderRate: number): PokemonGender {
  if (genderRate === -1) return { male: 0, female: 0 };
  const female = (genderRate / 8) * 100;
  return { male: 100 - female, female };
}

// Calcula fraquezas a partir dos dados de eficácia do schema GraphQL.
// TypeefficaciesByTargetTypeId traz, para cada tipo do Pokémon, todos os tipos
// atacantes e seus fatores de dano (0=imune, 50=½, 200=2x).
function computeWeaknesses(pokemontypes: GqlPokemonType[]): PokemonTypeTag[] {
  return ALL_TYPES.filter((attackType) => {
    let multiplier = 1;

    for (const pokemonType of pokemontypes) {
      const efficacy = pokemonType.type.TypeefficaciesByTargetTypeId.find(
        (e) => e.type.name === attackType,
      );

      if (!efficacy) continue;

      if (efficacy.damage_factor === 0) {
        multiplier = 0;
        break;
      } else if (efficacy.damage_factor === 200) {
        multiplier *= 2;
      } else if (efficacy.damage_factor === 50) {
        multiplier *= 0.5;
      }
    }

    return multiplier >= 2;
  }).map(typeToTag);
}

// Reconstrói a cadeia evolutiva linear a partir da lista plana com evolves_from_species_id.
// Hasura retorna a chain como lista plana; a REST API retornava árvore aninhada.
// Seguimos apenas o primeiro ramo para manter cadeia linear (igual ao mapper REST).
function buildEvolutionChain(speciesList: GqlEvolutionSpecies[]): PokemonEvolutionItem[] {
  const items: PokemonEvolutionItem[] = [];

  // Pokémon-raiz não tem ancestral; começa a cadeia por ele
  let current = speciesList.find((s) => s.evolves_from_species_id === null);

  while (current) {
    const evo = current.pokemonevolutions?.[0];
    items.push({
      id: current.id,
      name: formatSlugAsName(current.name),
      number: formatNumber(current.id),
      image: officialArtworkUrl(current.id),
      // pokemonevolutions traz as condições de evolução PARA CHEGAR nesta espécie
      level: evo && evo.min_level != null ? `Nível ${evo.min_level}` : null,
    });

    const next = speciesList.find(
      (s) => s.evolves_from_species_id === current!.id,
    );
    current = next;
  }

  return items;
}

export function mapGqlPokemonToCatalogItem(pokemon: GqlPokemon): PokemonCatalogItem {
  const species = pokemon.pokemonspecy;
  const primaryTypeName = pokemon.pokemontypes[0]?.type.name ?? "normal";
  const primaryMeta = getTypeMetadata(primaryTypeName);

  return {
    id: pokemon.id,
    name: getDisplayName(pokemon),
    slug: pokemon.name,
    number: formatNumber(pokemon.id),
    image: getImage(pokemon),
    cardColor: primaryMeta.cardColor,
    heroColor: primaryMeta.heroColor,
    region: getRegionFromId(pokemon.id),
    generation: GENERATION_NUMBERS[species.generation.name] ?? 1,
    types: pokemon.pokemontypes.map((t) => typeToTag(t.type.name)),
    description: getDescription(pokemon),
    weight: formatWeight(pokemon.weight),
    height: formatHeight(pokemon.height),
    category: getCategory(pokemon),
    ability: getAbility(pokemon),
    gender: getGender(species.gender_rate),
    weaknesses: computeWeaknesses(pokemon.pokemontypes),
    evolution: buildEvolutionChain(species.evolutionchain.pokemonspecies),
  };
}
