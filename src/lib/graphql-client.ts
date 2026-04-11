const GQL_ENDPOINT = "https://graphql.pokeapi.co/v1beta2";


// Valor padrão de cache: 24h
const DEFAULT_REVALIDATE = 86400;

export class GraphQLError extends Error {
  constructor(
    public readonly errors: unknown[],
    query: string,
  ) {
    super(`GraphQL error: ${JSON.stringify(errors)} | query: ${query.slice(0, 80)}`);
    this.name = "GraphQLError";
  }
}

export async function graphqlFetch<T>(
  query: string,
  variables?: Record<string, unknown>,
  operationName?: string,
  revalidate?: number,
): Promise<T> {
  const res = await fetch(GQL_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables, operationName }),
    next: { revalidate: revalidate ?? DEFAULT_REVALIDATE },
  });

  if (!res.ok) {
    throw new Error(`GraphQL HTTP ${res.status}: ${GQL_ENDPOINT}`);
  }

  const json = (await res.json()) as { data?: T | null; errors?: unknown[] };

  if (json.errors?.length) {
    throw new GraphQLError(json.errors, query);
  }
  if (json.data == null) {
    throw new Error(
      `GraphQL response missing data: ${GQL_ENDPOINT} | query: ${query.slice(0, 80)}`,
    );
  }
  return json.data;
}
