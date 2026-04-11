# 01 — Migração REST → GraphQL no Frontend

## Problemas do modelo REST atual

O consumo da PokéAPI via REST apresenta limitações clássicas:
- **N+1 requests**: Para montar a Pokédex, são necessárias múltiplas requisições por Pokémon (detalhes, espécies, evoluções, etc.).
- **Overfetch/Underfetch**: O REST retorna dados além do necessário (overfetch) ou exige múltiplas chamadas para obter tudo (underfetch).
- **Latência e rate limit**: Muitas requisições em sequência aumentam a latência e podem atingir o limite de requisições da API (HTTP 429).
- **Manutenção complexa**: O código precisa lidar com múltiplos endpoints, erros e normalização manual dos dados.

## Por que migrar para GraphQL

- **Consulta sob demanda**: O frontend requisita apenas os campos necessários, reduzindo overfetch.
- **Menos requisições**: Uma query GraphQL pode substituir várias chamadas REST.
- **Schema tipado**: O contrato é explícito, facilitando manutenção e evolução.
- **Ferramentas modernas**: Integração facilitada com Apollo Client, cache automático e devtools.

## Como implementar: removendo REST e usando GraphQL

1. **Remover chamadas REST**: Substitua o uso de `pokeapi-client.ts` e `pokeapi-service.ts` por queries GraphQL via Apollo Client.
2. **Configurar Apollo Client**: Crie um provider em `src/lib/graphql-client.ts` e envolva o app.
3. **Criar queries GraphQL**: Defina queries em `src/lib/graphql-queries.ts`.
4. **Atualizar mappers**: Adapte os mappers para consumir o novo formato de dados.
5. **Exemplo prático**:

### Antes (REST)
```ts
// src/lib/pokeapi-service.ts
const pokemon = await getPokemonById(id); // fetch REST
const species = await getPokemonSpecies(id); // fetch REST
```

### Depois (GraphQL)
```ts
// src/lib/graphql-queries.ts
const { data } = useQuery(GET_POKEMON_DETAIL, { variables: { id } });
```

## Pontos de atenção
- **Rate limit**: O endpoint GraphQL da PokéAPI ainda pode impor limites. Considere cache local e SSR/ISR.
- **Instabilidade**: O schema GraphQL é beta e pode mudar.
- **Fallback**: Mantenha fallback para REST apenas se necessário.

## Exemplo de código antes/depois

### REST
```ts
const pokemon = await getPokemonById(id);
const species = await getPokemonSpecies(id);
return {
  ...pokemon,
  description: species.flavor_text_entries[0].flavor_text,
};
```

### GraphQL
```ts
const { data } = useQuery(GET_POKEMON_DETAIL, { variables: { id } });
return {
  ...data.pokemon,
  description: data.pokemon.species.flavor_text,
};
```

## Referências
- [Padrão de documentação: infinite-scroll](../infinite-scroll/README.md)
- [Apollo Client Docs](https://www.apollographql.com/docs/react/)
- [PokéAPI GraphQL](https://beta.pokeapi.co/graphql/v1beta)
