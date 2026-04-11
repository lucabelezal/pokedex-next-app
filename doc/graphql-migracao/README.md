# GraphQL na Pokédex — Índice da Documentação

Esta pasta documenta a migração do consumo de dados da [PokéAPI](https://pokeapi.co) de REST para GraphQL no front-end da Pokédex.

## Motivação

O modelo REST exigia múltiplas chamadas para compor cada tela, causando N+1, overfetch e underfetch. Com GraphQL conseguimos buscar todos os dados necessários em uma única requisição por lote.

## Arquivos

| Arquivo | Conteúdo |
|---------|----------|
| [01-problema.md](01-problema.md) | Diagnóstico dos problemas com REST |
| [02-decisao.md](02-decisao.md) | Por que GraphQL e por que sem Apollo Client |
| [03-arquitetura.md](03-arquitetura.md) | Arquitetura da implementação |
| [04-queries.md](04-queries.md) | Queries GQL e mapeamento de schema |
| [05-impacto.md](05-impacto.md) | Redução de chamadas e ganhos de performance |

## Endpoint

```
POST https://graphql.pokeapi.co/v1beta2
```

> ⚠️ Beta com rate limit de ~100 req/h. Dados cacheados por 24 h no Next.js.
