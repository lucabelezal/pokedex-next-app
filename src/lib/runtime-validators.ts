import type {
  AppConfig,
  PokemonCatalogItem,
  PokemonEvolutionItem,
  PokemonGender,
  PokemonTypeTag,
  RegionItem,
  UserProfile,
} from "@/lib/pokedex-types";

type JsonRecord = Record<string, unknown>;

const isRecord = (value: unknown): value is JsonRecord => {
  return typeof value === "object" && value !== null;
};

const isString = (value: unknown): value is string => {
  return typeof value === "string";
};

const isNumber = (value: unknown): value is number => {
  return typeof value === "number" && Number.isFinite(value);
};

const isPositiveInteger = (value: unknown): value is number => {
  return isNumber(value) && Number.isInteger(value) && value > 0;
};

const isBoolean = (value: unknown): value is boolean => {
  return typeof value === "boolean";
};

const hasStringRecordValues = (value: unknown): value is Record<string, string> => {
  if (!isRecord(value)) {
    return false;
  }

  return Object.values(value).every((entry) => isString(entry));
};

const isPokemonTypeTag = (value: unknown): value is PokemonTypeTag => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    isString(value.key) &&
    isString(value.label) &&
    isString(value.color) &&
    isString(value.textColor)
  );
};

const isPokemonEvolutionItem = (value: unknown): value is PokemonEvolutionItem => {
  if (!isRecord(value)) {
    return false;
  }

  const isLevelValid = value.level === null || isString(value.level);

  return (
    isNumber(value.id) &&
    isString(value.name) &&
    isString(value.number) &&
    isString(value.image) &&
    isLevelValid
  );
};

const isPokemonGender = (value: unknown): value is PokemonGender => {
  if (!isRecord(value)) {
    return false;
  }

  return isNumber(value.male) && isNumber(value.female);
};

const isPokemonCatalogItem = (value: unknown): value is PokemonCatalogItem => {
  if (!isRecord(value)) {
    return false;
  }

  if (
    !isNumber(value.id) ||
    !isString(value.name) ||
    !isString(value.slug) ||
    !isString(value.number) ||
    !isString(value.image) ||
    !isString(value.cardColor) ||
    !isString(value.heroColor) ||
    !isString(value.region) ||
    !isNumber(value.generation) ||
    !isString(value.description) ||
    !isString(value.weight) ||
    !isString(value.height) ||
    !isString(value.category) ||
    !isString(value.ability)
  ) {
    return false;
  }

  if (!Array.isArray(value.types) || !value.types.every((item) => isPokemonTypeTag(item))) {
    return false;
  }

  if (!Array.isArray(value.weaknesses) || !value.weaknesses.every((item) => isPokemonTypeTag(item))) {
    return false;
  }

  if (!Array.isArray(value.evolution) || !value.evolution.every((item) => isPokemonEvolutionItem(item))) {
    return false;
  }

  return isPokemonGender(value.gender);
};

const isRegionItem = (value: unknown): value is RegionItem => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    isString(value.key) &&
    isString(value.name) &&
    isString(value.generation) &&
    isString(value.color) &&
    isString(value.accent) &&
    Array.isArray(value.starterIds) &&
    value.starterIds.every((id) => isNumber(id))
  );
};

const isUserProfile = (value: unknown): value is UserProfile => {
  if (!isRecord(value)) {
    return false;
  }

  if (!isString(value.username) || !isString(value.email) || !isString(value.displayName)) {
    return false;
  }

  const settings = value.settings;
  if (!isRecord(settings)) {
    return false;
  }

  return (
    isBoolean(settings.megaEvolutions) &&
    isBoolean(settings.otherForms) &&
    isBoolean(settings.notifyUpdates) &&
    isBoolean(settings.notifyPokemonWorld) &&
    isString(settings.interfaceLanguage) &&
    isString(settings.gameLanguage)
  );
};

const isAppConfig = (value: unknown): value is AppConfig => {
  if (!isRecord(value)) {
    return false;
  }

  const app = value.app;
  const theme = value.theme;

  if (!isRecord(app) || !isRecord(theme)) {
    return false;
  }

  return (
    isString(app.name) &&
    isString(app.version) &&
    isString(app.locale) &&
    isString(theme.background) &&
    isString(theme.surface) &&
    isString(theme.text) &&
    isString(theme.mutedText) &&
    isString(theme.line) &&
    isString(theme.tabActive) &&
    isString(theme.tabInactive) &&
    isString(theme.heartActive) &&
    hasStringRecordValues(value.texts)
  );
};

const assertWithMessage = <TType>(
  condition: (input: unknown) => input is TType,
  input: unknown,
  sourceName: string
): TType => {
  if (!condition(input)) {
    throw new Error(`Estrutura invalida em ${sourceName}.`);
  }

  return input;
};

export const parseAppConfig = (input: unknown, sourceName: string): AppConfig => {
  return assertWithMessage(isAppConfig, input, sourceName);
};

export const parsePokemonCatalog = (input: unknown, sourceName: string): PokemonCatalogItem[] => {
  if (!Array.isArray(input) || !input.every((item) => isPokemonCatalogItem(item))) {
    throw new Error(`Estrutura invalida em ${sourceName}.`);
  }

  return input;
};

export const parseRegions = (input: unknown, sourceName: string): RegionItem[] => {
  if (!Array.isArray(input) || !input.every((item) => isRegionItem(item))) {
    throw new Error(`Estrutura invalida em ${sourceName}.`);
  }

  return input;
};

export const parseUserProfile = (input: unknown, sourceName: string): UserProfile => {
  return assertWithMessage(isUserProfile, input, sourceName);
};

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
