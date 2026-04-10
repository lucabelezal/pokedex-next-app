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
