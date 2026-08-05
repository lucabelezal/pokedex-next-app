import type { PokemonTypeTag } from "@/lib/pokedex-types";

export type TypeMetadata = PokemonTypeTag & {
  cardColor: string;
  heroColor: string;
};

// Mapa estático com metadados visuais de todos os 18 tipos (Gen 1-8).
// cardColor/heroColor derivados do mock original; tipos sem Pokémon no mock
// (dark, fighting, flying, ice, ghost) usam heroColor igual ao color do tipo.
const TYPE_REGISTRY: Record<string, TypeMetadata> = {
  bug:      { key: "bug",      label: "Inseto",    color: "#9bc233", textColor: "#111111", cardColor: "#dce3d6", heroColor: "#9bc233" },
  dark:     { key: "dark",     label: "Noturno",   color: "#5f636b", textColor: "#111111", cardColor: "#dcdde0", heroColor: "#5f636b" },
  dragon:   { key: "dragon",   label: "Dragão",    color: "#2d83d4", textColor: "#111111", cardColor: "#d8e0e8", heroColor: "#2d83d4" },
  electric: { key: "electric", label: "Elétrico",  color: "#e9cd2c", textColor: "#111111", cardColor: "#ece2c6", heroColor: "#e9cd2c" },
  fairy:    { key: "fairy",    label: "Fada",      color: "#d584d9", textColor: "#111111", cardColor: "#e8d9e8", heroColor: "#d584d9" },
  fighting: { key: "fighting", label: "Lutador",   color: "#d44d6d", textColor: "#111111", cardColor: "#e8d9dd", heroColor: "#d44d6d" },
  fire:     { key: "fire",     label: "Fogo",      color: "#f39b52", textColor: "#111111", cardColor: "#e9e0d9", heroColor: "#f39b52" },
  flying:   { key: "flying",   label: "Voador",    color: "#7faae6", textColor: "#111111", cardColor: "#d9e0eb", heroColor: "#7faae6" },
  ghost:    { key: "ghost",    label: "Fantasma",  color: "#7c62a3", textColor: "#111111", cardColor: "#e0dce8", heroColor: "#7c62a3" },
  grass:    { key: "grass",    label: "Grama",     color: "#57b956", textColor: "#111111", cardColor: "#dce3d6", heroColor: "#6ec06b" },
  ground:   { key: "ground",   label: "Terrestre", color: "#c9763e", textColor: "#111111", cardColor: "#e7e4de", heroColor: "#c9763e" },
  ice:      { key: "ice",      label: "Gelo",      color: "#72ccc4", textColor: "#111111", cardColor: "#d9ebea", heroColor: "#72ccc4" },
  normal:   { key: "normal",   label: "Normal",    color: "#9ca3ab", textColor: "#111111", cardColor: "#dfdfe0", heroColor: "#9ca3ab" },
  poison:   { key: "poison",   label: "Venenoso",  color: "#b466d8", textColor: "#111111", cardColor: "#e2dce8", heroColor: "#b466d8" },
  psychic:  { key: "psychic",  label: "Psíquico",  color: "#f06e7a", textColor: "#111111", cardColor: "#eadcdf", heroColor: "#f06e7a" },
  rock:     { key: "rock",     label: "Pedra",     color: "#b9aa7f", textColor: "#111111", cardColor: "#e6e3dd", heroColor: "#b9aa7f" },
  steel:    { key: "steel",    label: "Metal",     color: "#6b9bb2", textColor: "#111111", cardColor: "#d9dee2", heroColor: "#6b9bb2" },
  water:    { key: "water",    label: "Água",      color: "#79a8e5", textColor: "#111111", cardColor: "#d7dde5", heroColor: "#4d8dd9" },
};

export function getTypeMetadata(key: string): TypeMetadata {
  return TYPE_REGISTRY[key] ?? TYPE_REGISTRY.normal;
}

export function getAllTypeMetadata(): TypeMetadata[] {
  return Object.values(TYPE_REGISTRY);
}
