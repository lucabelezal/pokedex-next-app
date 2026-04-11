# 04 — Queries GraphQL e mapeamento de schema

## Endpoint

```
POST https://graphql.pokeapi.co/v1beta2
Content-Type: application/json
```

O schema v1beta2 removeu o prefixo `pokemon_v2_` de todas as tabelas (ex: `pokemon_v2_pokemon` → `pokemon`).

## Busca de um único Pokémon

```graphql
query getPokemonById($id: Int!) {
  pokemon(where: {id: {_eq: $id}}) {
    id
    name
    height
    weight
    pokemontypes(order_by: {slot: asc}) {
      slot
      type {
        name
        # Eficácias onde este tipo é o DEFENSOR → permite calcular fraquezas
        TypeefficaciesByTargetTypeId {
          damage_factor   # 0=imune, 50=½, 200=2x
          type { name }   # tipo atacante
        }
      }
    }
    pokemonabilities(order_by: {slot: asc}) {
      is_hidden
      ability { name }
    }
    pokemonsprites(limit: 1) { sprites }
    pokemonspecy {
      gender_rate
      generation { name }
      pokemonspeciesnames(where: {language: {name: {_in: ["en", "pt-br"]}}}) {
        name
        language { name }
      }
      pokemonspeciesflavortexts(
        where: {language: {name: {_in: ["en", "pt-br"]}}}
        order_by: {version_id: asc}
        limit: 6
      ) {
        flavor_text
        language { name }
      }
      # genus agora vem de pokemonspeciesnames (campo genus)
      evolutionchain {
        pokemonspecies(order_by: {order: asc}) {
          id
          name
          order
          evolves_from_species_id      # aponta para o pai na cadeia
          pokemonevolutions(limit: 1) {
            min_level
          }
        }
      }
    }
  }
}
```

## Busca em lote (catálogo)

Mesmos campos — só muda o filtro:

```graphql
query getPokemonBatch($ids: [Int!]!) {
  pokemon(where: {id: {_in: $ids}}, order_by: {id: asc}) {
    # mesmos campos
  }
}
```

## Mapeamento schema GraphQL → PokemonCatalogItem

| Campo em `PokemonCatalogItem` | Origem no schema GraphQL |
|-------------------------------|--------------------------|
| `id`, `name`, `height`, `weight` | Campos diretos de `pokemon` |
| `image` | `pokemonsprites[0].sprites.other.official-artwork.front_default` (fallback: URL do GitHub) |
| `types` | `pokemontypes[].type.name` via `getTypeMetadata()` |
| `weaknesses` | `pokemontypes[].type.TypeefficaciesByTargetTypeId` com `damage_factor >= 200` |
| `ability` | `pokemonabilities` — primeiro não-oculto |
| `description` | `pokemonspecy.pokemonspeciesflavortexts` — pt-br first, fallback en |
| `name` (localizado) | `pokemonspecy.pokemonspeciesnames` — pt-br first, fallback en |
| `category` | `pokemonspecy.pokemonspeciesnames` — campo `genus` no item em inglês, sem " Pokémon" |
| `gender` | `pokemonspecy.gender_rate` |
| `generation` | `pokemonspecy.generation.name` |
| `evolution` | `pokemonspecy.evolutionchain.pokemonspecies[]` lista plana → cadeia linear |

## Diferença na cadeia evolutiva

**REST (árvore aninhada):**
```json
{ "chain": { "species": "bulbasaur", "evolves_to": [{ "species": "ivysaur", ... }] } }
```

**GraphQL (lista plana com `evolves_from_species_id`):**
```json
[
  { "id": 1,  "name": "bulbasaur", "evolves_from_species_id": null },
  { "id": 2,  "name": "ivysaur",   "evolves_from_species_id": 1 },
  { "id": 3,  "name": "venusaur",  "evolves_from_species_id": 2 }
]
```

O mapper reconstrói a cadeia linear percorrendo os `evolves_from_species_id`.
