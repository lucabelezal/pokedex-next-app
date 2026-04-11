# 01 — Problema: múltiplas chamadas REST

## Contexto

Para montar a tela de detalhe de um único Pokémon, o código REST anterior precisava de **4 requisições sequenciais ou paralelas**:

```
GET /pokemon/{id}               ← dados básicos
GET /pokemon-species/{id}       ← nome, descrição, geração, cadeia evolutiva
GET /evolution-chain/{id}       ← cadeia de evolução completa
GET /type/{nome}   (× 1 ou 2)  ← relações de dano para calcular fraquezas
```

Para o catálogo completo com 905 Pokémon:

```
905 Pokémon × 4 chamadas = ~3.620 requisições HTTP
```

Além disso, para cada Pokémon com 2 tipos, a chamada de fraquezas era feita duas vezes em paralelo, aumentando ainda mais o volume.

## Problemas identificados

### N+1
Para listar Pokémon com tipos e fraquezas era necessário buscar cada tipo individualmente após obter os dados do Pokémon.

```
fetchPokemon(id)              → sabe que tem tipos [fire, flying]
fetchType("fire")             → chamada extra #1
fetchType("flying")           → chamada extra #2
```

### Overfetch
A REST API retornava campos não utilizados. Exemplo: `/pokemon/{id}` devolve moves, game_indices, past_types — nenhum usado na tela.

### Underfetch
Uma única chamada não era suficiente. O campo `evolution_chain` de `/pokemon-species` retornava apenas uma URL, obrigando uma segunda chamada para obter a cadeia.

### Impacto no build
Com `unstable_cache` e `BATCH_SIZE = 50`, o build fazia 50 chamadas paralelas em sequência. Com 905 Pokémon e os requests de tipos, o build ficava sujeito a rate limit e lentidão de rede.

## Arquivo responsável (antes da migração)

- `src/lib/pokeapi-client.ts` — funções `fetchPokemon`, `fetchPokemonSpecies`, `fetchEvolutionChain`, `fetchType`
- `src/lib/pokeapi-service.ts` — orquestração com `buildPokemonCatalogItem` e `Promise.all`
