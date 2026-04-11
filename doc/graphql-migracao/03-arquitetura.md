# 03 — Arquitetura da implementação

## Estrutura de arquivos

```
src/lib/
  graphql-client.ts    ← wrapper fetch para o endpoint GQL
  graphql-queries.ts   ← queries GQL + tipos TypeScript da resposta
  graphql-mappers.ts   ← converte resposta GQL → PokemonCatalogItem
  pokeapi-service.ts   ← orquestrador (atualizado para usar GQL)
  pokeapi-client.ts    ← legado REST (mantido, sem uso ativo)
  pokeapi-mappers.ts   ← legado mapper REST (mantido, sem uso ativo)
```

## Fluxo de dados

```
Next.js Server Component
  └─ pokeapi-service.ts
       └─ graphql-client.ts  ──POST──▶ graphql.pokeapi.co/v1beta2
       └─ graphql-mappers.ts ◀── mapeia resposta → PokemonCatalogItem
            └─ type-metadata.ts  (dados locais de cores/labels de tipos)
```

## graphql-client.ts

Cliente minimalista: recebe query + variáveis, faz POST, valida erros e retorna o `data` tipado.

Não há dependências externas — apenas `fetch` nativo que o Next.js já intercepta para aplicar o cache `revalidate`.

## graphql-queries.ts

Define:
- Tipos TypeScript que espelham a resposta do schema Hasura (`GqlPokemon`, `GqlPokemonType`, etc.)
- Fragmento `POKEMON_FIELDS` reutilizado nas duas queries
- `GET_POKEMON_BY_ID` — busca um Pokémon por ID
- `GET_POKEMON_BATCH` — busca lote de Pokémon por lista de IDs

## graphql-mappers.ts

Converte `GqlPokemon` → `PokemonCatalogItem` sem alterar os tipos de saída.

Os nomes dos campos no schema GraphQL diferem do REST:
- REST: `damage_relations.double_damage_from[]` → GraphQL: `TypeefficaciesByTargetTypeId[].damage_factor`
- REST: `chain.evolves_to[]` (árvore) → GraphQL: `pokemonspecies[].evolves_from_species_id` (lista plana)

A lógica de cálculo de fraquezas e cadeia evolutiva foi reimplementada para o novo formato mantendo o mesmo comportamento de saída.

## pokeapi-service.ts

Mudanças:
- Removeu imports de `pokeapi-client.ts` e `pokeapi-mappers.ts`
- `buildPokemonCatalogItem` substituído por `fetchPokemonBatch` (1 query GQL por lote)
- `BATCH_SIZE` aumentou de 50 para 100 (uma query GQL aguenta mais dados)
- `getPokemonById` agora também usa GQL (1 query)
- Funções de dados estáticos (JSON local) — sem alteração
