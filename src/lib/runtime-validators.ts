import type { AppConfig, PokemonCatalogItem, RegionItem, UserProfile } from "@/lib/pokedex-types";

type JsonRecord = Record<string, unknown>;

const isRecord = (value: unknown): value is JsonRecord => {
  return typeof value === "object" && value !== null;
};

const isNumber = (value: unknown): value is number => {
  return typeof value === "number" && Number.isFinite(value);
};

const isPositiveInteger = (value: unknown): value is number => {
  return isNumber(value) && Number.isInteger(value) && value > 0;
};

const isString = (value: unknown): value is string => {
  return typeof value === "string";
};

const isBoolean = (value: unknown): value is boolean => {
  return typeof value === "boolean";
};

const isArray = (value: unknown): value is unknown[] => {
  return Array.isArray(value);
};

const isStringRecord = (value: unknown): value is Record<string, string> => {
  if (!isRecord(value)) return false;
  return Object.values(value).every(isString);
};

function assertField<T>(record: JsonRecord, key: string, guard: (v: unknown) => v is T, label: string): T {
  const value = record[key];
  if (!guard(value)) {
    throw new Error(`Validação de dados falhou: campo "${label}" inválido.`);
  }
  return value;
}

export const parseFavoriteIdsResponse = (input: unknown): number[] => {
  if (!isRecord(input) || !Array.isArray(input.ids) || !input.ids.every((id) => isPositiveInteger(id))) {
    throw new Error("Resposta invalida da API de favoritos.");
  }

  return input.ids;
};

export const parseFavoritePostPayload = (input: unknown): { id: number } => {
  if (!isRecord(input) || !isPositiveInteger(input.id)) {
    throw new Error("Payload invalido. Informe um id numerico positivo.");
  }

  return { id: input.id };
};

export const parseFavoriteIdParam = (input: string): number => {
  const parsed = Number(input);

  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error("Id invalido. Informe um id numerico positivo.");
  }

  return parsed;
};

export function validateAppConfig(input: unknown): AppConfig {
  if (!isRecord(input)) throw new Error("AppConfig: esperado objeto.");
  const app = assertField(input, "app", isRecord, "app");
  const theme = assertField(input, "theme", isRecord, "theme");
  const texts = assertField(input, "texts", isStringRecord, "texts");

  return {
    app: {
      name: assertField(app, "name", isString, "app.name"),
      version: assertField(app, "version", isString, "app.version"),
      locale: assertField(app, "locale", isString, "app.locale"),
    },
    theme: {
      background: assertField(theme, "background", isString, "theme.background"),
      surface: assertField(theme, "surface", isString, "theme.surface"),
      text: assertField(theme, "text", isString, "theme.text"),
      mutedText: assertField(theme, "mutedText", isString, "theme.mutedText"),
      line: assertField(theme, "line", isString, "theme.line"),
      tabActive: assertField(theme, "tabActive", isString, "theme.tabActive"),
      tabInactive: assertField(theme, "tabInactive", isString, "theme.tabInactive"),
      heartActive: assertField(theme, "heartActive", isString, "theme.heartActive"),
    },
    texts,
  };
}

function validatePokemonTypeTag(input: unknown) {
  if (!isRecord(input)) throw new Error("PokemonTypeTag: esperado objeto.");
  return {
    key: assertField(input, "key", isString, "key"),
    label: assertField(input, "label", isString, "label"),
    color: assertField(input, "color", isString, "color"),
    textColor: assertField(input, "textColor", isString, "textColor"),
  };
}

function validatePokemonGender(input: unknown) {
  if (!isRecord(input)) throw new Error("PokemonGender: esperado objeto.");
  return {
    male: assertField(input, "male", isNumber, "male"),
    female: assertField(input, "female", isNumber, "female"),
  };
}

function validateEvolutionItem(input: unknown) {
  if (!isRecord(input)) throw new Error("EvolutionItem: esperado objeto.");
  return {
    id: assertField(input, "id", isNumber, "id"),
    name: assertField(input, "name", isString, "name"),
    number: assertField(input, "number", isString, "number"),
    image: assertField(input, "image", isString, "image"),
    level: input["level"] === null ? null : isString(input["level"]) ? input["level"] : null,
  };
}

function validatePokemonCatalogItem(input: unknown): PokemonCatalogItem {
  if (!isRecord(input)) throw new Error("PokemonCatalogItem: esperado objeto.");
  const types = assertField(input, "types", isArray, "types");
  const weaknesses = assertField(input, "weaknesses", isArray, "weaknesses");
  const evolution = assertField(input, "evolution", isArray, "evolution");

  return {
    id: assertField(input, "id", isNumber, "id"),
    name: assertField(input, "name", isString, "name"),
    slug: assertField(input, "slug", isString, "slug"),
    number: assertField(input, "number", isString, "number"),
    image: assertField(input, "image", isString, "image"),
    cardColor: assertField(input, "cardColor", isString, "cardColor"),
    heroColor: assertField(input, "heroColor", isString, "heroColor"),
    region: assertField(input, "region", isString, "region"),
    generation: assertField(input, "generation", isNumber, "generation"),
    types: types.map(validatePokemonTypeTag),
    description: assertField(input, "description", isString, "description"),
    weight: assertField(input, "weight", isString, "weight"),
    height: assertField(input, "height", isString, "height"),
    category: assertField(input, "category", isString, "category"),
    ability: assertField(input, "ability", isString, "ability"),
    gender: validatePokemonGender(input["gender"]),
    weaknesses: weaknesses.map(validatePokemonTypeTag),
    evolution: evolution.map(validateEvolutionItem),
  };
}

export function validatePokemonCatalog(input: unknown): PokemonCatalogItem[] {
  if (!isArray(input)) throw new Error("PokemonCatalog: esperado array.");
  return input.map(validatePokemonCatalogItem);
}

export function validateRegionItem(input: unknown): RegionItem {
  if (!isRecord(input)) throw new Error("RegionItem: esperado objeto.");
  const starterIds = assertField(input, "starterIds", isArray, "starterIds");
  return {
    key: assertField(input, "key", isString, "key"),
    name: assertField(input, "name", isString, "name"),
    generation: assertField(input, "generation", isString, "generation"),
    color: assertField(input, "color", isString, "color"),
    accent: assertField(input, "accent", isString, "accent"),
    starterIds: starterIds.every(isNumber) ? (starterIds as number[]) : [],
  };
}

export function validateRegions(input: unknown): RegionItem[] {
  if (!isArray(input)) throw new Error("Regions: esperado array.");
  return input.map(validateRegionItem);
}

export function validateUserProfile(input: unknown): UserProfile {
  if (!isRecord(input)) throw new Error("UserProfile: esperado objeto.");
  const settings = assertField(input, "settings", isRecord, "settings");
  return {
    username: assertField(input, "username", isString, "username"),
    email: assertField(input, "email", isString, "email"),
    displayName: assertField(input, "displayName", isString, "displayName"),
    settings: {
      megaEvolutions: assertField(settings, "megaEvolutions", isBoolean, "settings.megaEvolutions"),
      otherForms: assertField(settings, "otherForms", isBoolean, "settings.otherForms"),
      notifyUpdates: assertField(settings, "notifyUpdates", isBoolean, "settings.notifyUpdates"),
      notifyPokemonWorld: assertField(settings, "notifyPokemonWorld", isBoolean, "settings.notifyPokemonWorld"),
      interfaceLanguage: assertField(settings, "interfaceLanguage", isString, "settings.interfaceLanguage"),
      gameLanguage: assertField(settings, "gameLanguage", isString, "settings.gameLanguage"),
    },
  };
}
