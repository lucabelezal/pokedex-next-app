const GQL_ENDPOINT = "https://graphql.pokeapi.co/v1beta2";

// Cache de 24h: dados da PokéAPI mudam raramente
const CACHE_OPTIONS = { next: { revalidate: 86400 } } as const;

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
): Promise<T> {
  const res = await fetch(GQL_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables, operationName }),
    ...CACHE_OPTIONS,
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
