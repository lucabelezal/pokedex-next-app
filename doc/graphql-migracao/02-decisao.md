# 02 — Decisão: GraphQL nativo, sem Apollo Client

## Por que GraphQL?

A PokéAPI disponibiliza um endpoint GraphQL em `https://graphql.pokeapi.co/v1beta2` usando **Hasura + PostgreSQL**.

Com uma única query GQL, conseguimos buscar todos os dados de 100 Pokémon — incluindo tipos, fraquezas, habilidades, espécie, cadeia evolutiva e sprites — em **uma requisição HTTP**. Isso resolve todos os problemas do modelo REST:

| Problema REST | Solução GraphQL |
|---------------|-----------------|
| 4 calls por Pokémon | 1 query por lote de 100 |
| Overfetch (campos não usados) | Query pede só os campos necessários |
| Underfetch (URL da evolution_chain) | Cadeia evolutiva embutida na query |
| N+1 nos tipos | Fraquezas calculadas via `TypeefficaciesByTargetTypeId` na mesma query |

## Por que sem Apollo Client?

O projeto usa **Next.js App Router com Server Components**. Os dados são buscados em tempo de build ou servidor — não no browser.

Apollo Client foi projetado para **Client Components** (React hooks `useQuery`, cache reativo no browser). Usá-lo aqui seria:
- Antecipar complexidade desnecessária (bundle maior, configuração de Provider)
- Incompatível com Server Components sem add-ons específicos

A alternativa correta para Server Components é simplesmente **`fetch` nativo do Node.js** com um POST JSON — o que GraphQL é na prática:

```ts
// GraphQL é só um POST com JSON. Não precisamos de uma lib.
const res = await fetch("https://graphql.pokeapi.co/v1beta2", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ query, variables }),
  next: { revalidate: 86400 }, // cache Next.js nativo
});
```

## Quando Apollo Client faria sentido?

Se o projeto evoluir para permitir que o usuário faça **queries dinâmicas no browser** (ex: busca em tempo real, filtros com debounce contra a API), aí faria sentido adicionar Apollo Client apenas nos Client Components que precisarem disso.

## Decisão registrada

- **GraphQL com fetch nativo** para Server Components (build e SSR)
- **Sem Apollo Client** nesta fase
- **Cache Next.js via `revalidate`** mantido igual ao anterior
