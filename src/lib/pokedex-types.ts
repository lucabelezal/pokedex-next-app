export type PokemonTypeTag = {
  key: string;
  label: string;
  color: string;
  textColor: string;
};

export type PokemonEvolutionItem = {
  id: number;
  name: string;
  number: string;
  image: string;
  level: string | null;
};

export type PokemonGender = {
  male: number;
  female: number;
};

export type PokemonCatalogItem = {
  id: number;
  name: string;
  slug: string;
  number: string;
  image: string;
  cardColor: string;
  heroColor: string;
  region: string;
  generation: number;
  types: PokemonTypeTag[];
  description: string;
  weight: string;
  height: string;
  category: string;
  ability: string;
  gender: PokemonGender;
  weaknesses: PokemonTypeTag[];
  evolution: PokemonEvolutionItem[];
};

export type AppConfig = {
  app: {
    name: string;
    version: string;
    locale: string;
  };
  theme: {
    background: string;
    surface: string;
    text: string;
    mutedText: string;
    line: string;
    tabActive: string;
    tabInactive: string;
    heartActive: string;
  };
  texts: Record<string, string>;
};

export type SortKey = "az" | "za" | "number-asc" | "number-desc";

export type RegionItem = {
  key: string;
  name: string;
  generation: string;
  color: string;
  accent: string;
  starterIds: number[];
};

export type UserProfile = {
  username: string;
  email: string;
  displayName: string;
  settings: {
    megaEvolutions: boolean;
    otherForms: boolean;
    notifyUpdates: boolean;
    notifyPokemonWorld: boolean;
    interfaceLanguage: string;
    gameLanguage: string;
  };
};
