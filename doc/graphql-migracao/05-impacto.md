# 05 — Impacto e redução de chamadas

## Comparação direta

| | REST (anterior) | GraphQL (atual) |
|--|-----------------|-----------------|
| Chamadas para 1 Pokémon | 4 (pokemon + species + evolution + types) | 1 query GQL |
| Chamadas para catálogo completo (905) | ~3.620 requests HTTP | ~10 queries GQL |
| Chamadas para uma região (ex: Kanto, 151) | ~604 requests HTTP | 2 queries GQL |
| Overfetch | Sim (moves, game_indices, etc.) | Não (só campos solicitados) |
| Underfetch / calls extras | Sim (evolution_chain URL → 2ª chamada) | Não (tudo na mesma query) |
| Rate limit REST | Sem limite explícito | GQL: ~100 req/h (cache mitiga) |

## Estratégia de mitigação do rate limit GraphQL

O endpoint `graphql.pokeapi.co/v1beta2` tem rate limit de ~100 req/h por IP.

Com a implementação atual:
- **Build completo (905)**: ~10 requests GQL — muito abaixo do limite
- **Cache `revalidate: 3600`** (1h) no `unstable_cache` + **24h no fetch** evitam re-fetch desnecessário
- Em desenvolvimento, o cache do processo Node.js é reaproveitado entre hot-reloads

## O que NÃO muda para o usuário

- Todas as telas funcionam exatamente igual
- Tipos de saída (`PokemonCatalogItem`) são idênticos
- Nenhum componente precisou ser alterado
- Cache behaviour mantido via `unstable_cache`

## Limitações conhecidas

- Endpoint GraphQL é **beta** — schema pode mudar sem aviso
- Instância GCP e2-micro com reboot diário às 1h UTC (~2 min de downtime)
- Se o endpoint estiver indisponível no build, o Next.js vai falhar (mesmo comportamento do REST)
- Evoluções ramificadas (ex: Eevee) seguem apenas o primeiro ramo — comportamento herdado do mapper anterior

## Próximos passos possíveis

- Adicionar retry com backoff para erros 5xx do endpoint GraphQL
- Monitorar schema changes via CI (introspection query + snapshot)
- Se o endpoint se tornar instável para produção: criar BFF próprio que expõe apenas os dados necessários
