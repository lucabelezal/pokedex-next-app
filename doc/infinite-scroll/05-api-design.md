# 05 — API Design

## PokéAPI (fonte atual) e design de API REST paginada

> **Atualizado:** o projeto integra a [PokéAPI](https://pokeapi.co/api/v2) como
> fonte de dados em build-time (SSG). A segunda metade desta seção documenta
> o design de paginação para quando houver uma API própria.

---

### Endpoints PokéAPI utilizados no build

```
GET /pokemon/{id}
  → id, name, weight (hg), height (dm), types[], abilities[], sprites

GET /pokemon-species/{id}
  → descrição (pt-br language=13, fallback en), generation, gender_rate,
    genera (categoria), names (nome localizado), evolution_chain.url

GET /evolution-chain/{url}
  → cadeia de evolução (chain.species, evolves_to, evolution_details.min_level)

GET /type/{name}
  → damage_relations.double_damage_from (fraquezas ×2 por tipo duplo)
```

**Cache**: `fetch(url, { next: { revalidate: 86400 } })` — Next.js deduplica
fetches idênticos em memória durante o mesmo build. Os ~18 tipos únicos são
buscados uma única vez mesmo que compartilhados por centenas de Pokémon.

**Localização**: descrições em `pt-br` (language ID 13) com fallback para `en`.

---

### Campos sem equivalente na PokéAPI

| Campo | Origem | Estratégia |
|---|---|---|
| `cardColor` | Tipo primário | `type-metadata.ts` — mapa estático |
| `heroColor` | Tipo primário | `type-metadata.ts` — mapa estático |
| `types[].label` (PT-BR) | Tipo | `type-metadata.ts` — mapa estático |
| `types[].color/textColor` | Tipo | `type-metadata.ts` — mapa estático |

---

### Por que pensar na API agora

O scroll infinito no frontend é desacoplado da estratégia de paginação
no backend. Mas o contrato entre os dois define a experiência completa:
latência percebida, consistência dos dados, cache na CDN.

Dois padrões dominam o mercado. A escolha errada cria bugs difíceis de
depurar em produção.

---

### Padrão 1: Offset-based Pagination

**Request**:
```
GET /api/pokemon?offset=0&limit=20&type=fire&sort=az

GET /api/pokemon?offset=20&limit=20&type=fire&sort=az

GET /api/pokemon?offset=40&limit=20&type=fire&sort=az
```

**Response**:
```json
{
  "items": [
    { "id": 4, "name": "Charmander", "types": ["fire"] },
    ...
  ],
  "total": 52,
  "offset": 0,
  "limit": 20,
  "hasMore": true
}
```

**Quando usar**: dashboards administrativos, relatórios, qualquer
contexto onde o dataset é estável e o usuário precisa de "página 3 de 10".

**Problema fundamental — duplicatas com dados mutáveis**:

```
t=0: Dataset tem 100 itens ordenados por A-Z
     Usuário vê offset=0..19 (itens 1-20)

          ↓ admin insere "Aipom" na posição 3

t=1: GET offset=20
     Backend retorna itens 21..40 (antes da inserção)
     = itens 20..39 (depois da inserção)
     ↳ Item 20 aparece de novo → DUPLICATA visível ❌

          ↓ ou admin remove item da posição 8

t=2: GET offset=20
     Item que estava na posição 21 agora está na 20
     ↳ Um item é PULADO e nunca aparece ❌
```

---

### Padrão 2: Cursor-based Pagination ← RECOMENDADO

**Request**:
```
# Primeira página (sem cursor)
GET /api/pokemon?limit=20&type=fire&sort=az

# Páginas seguintes (com cursor opaco)
GET /api/pokemon?cursor=eyJpZCI6MjAsInNvcnQiOiJheiJ9&limit=20&type=fire&sort=az
```

**Response**:
```json
{
  "items": [
    { "id": 4, "name": "Charmander", "types": ["fire"] },
    ...
  ],
  "nextCursor": "eyJpZCI6NDB9",
  "hasMore": true
}
```

O cursor é opaco para o cliente (base64 do estado interno):
```
eyJpZCI6MjAsInNvcnQiOiJheiJ9
         ↓ decode
{ "id": 20, "sort": "az", "type": "fire" }
```

O backend usa o cursor para saber exatamente de onde continuar,
independente de inserções ou remoções anteriores na lista.

**Resultado**: zero duplicatas, zero itens pulados. Padrão usado por
Twitter/X API, Instagram Graph API, Slack API, Stripe API.

---

### Diagrama de sequência de requests

```
Client              CDN Edge            Origin API          Database
  │                    │                    │                   │
  ├─ GET ?cursor=∅ ───>│                    │                   │
  │                    ├─ MISS ────────────>│                   │
  │                    │                    ├─ SELECT...LIMIT 20>│
  │                    │                    │<── rows ──────────┤
  │<── 200 + body ─────│<── cache(5min) ────┤                   │
  │                    │                    │                   │
  │                    │                    │                   │
  │  [scroll → IO]     │                    │                   │
  ├─ GET ?cursor=abc ─>│                    │                   │
  │                    ├─ HIT ─────────────────────────────────>│
  │<── 200 cached ─────┤   (sem bater no origin)                │
  │                    │                    │                   │
  │                    │                    │                   │
  │  [filtro muda]     │                    │                   │
  ├─ GET ?type=water ─>│                    │                   │
  │                    ├─ MISS ────────────>│                   │
  │                    │                    ├─ SELECT WHERE      │
  │                    │                    │   type='water' ───>│
  │<── 200 + body ─────│<── cache(5min) ────┤                   │
```

**Observe**: requests com cursor são cacheados na CDN. O segundo request
para a mesma página de "fogo ordenado A-Z" não chega no Origin — serve
diretamente do edge. O frontend pré-fetches a próxima página 200px antes
do fim, então o cache já está quente quando o scroll chega lá.

---

### Headers HTTP recomendados

**Response headers do servidor**:
```http
HTTP/2 200 OK
Content-Type: application/json; charset=utf-8
Content-Encoding: br                          ← Brotli (30% menor que gzip)
Cache-Control: public, max-age=300, stale-while-revalidate=60
ETag: "abc123def456"
Vary: Accept-Encoding
X-Total-Count: 52                             ← total de itens (sem paginação)
```

**Por que Brotli**: em redes móveis 4G/5G, a latência é baixa mas a
banda pode ser limitada. Brotli comprime JSON de listas repetitivas
(como catálogos de Pokémon) em 40-60% do tamanho original.

**Por que `stale-while-revalidate`**: o CDN serve o cache imediatamente
enquanto revalida em background. O usuário nunca espera — mesmo se o
cache expirou faz 5 segundos. Padrão da Cloudflare e Vercel Edge Network.

---

### Tipagem TypeScript do contrato

```typescript
// Tipos do contrato de API paginada

type PaginatedResponse<T> = {
  items: T[];
  nextCursor: string | null;  // null quando hasMore === false
  hasMore: boolean;
};

type PokemonQueryParams = {
  cursor?: string;
  limit?: number;             // padrão: 20, máximo: 100
  type?: string;              // "all" | "fire" | "water" | ...
  sort?: SortKey;             // "az" | "za" | "number-asc" | "number-desc"
  q?: string;                 // busca por nome ou número
};

// Integração com React Query (para quando houver backend)
import { useInfiniteQuery } from "@tanstack/react-query";

const { data, fetchNextPage, hasNextPage } = useInfiniteQuery({
  queryKey: ["pokemon", { type, sort, q }],
  queryFn: ({ pageParam }) =>
    fetchPokemon({ cursor: pageParam ?? undefined, limit: 20, type, sort, q }),
  getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  initialPageParam: null,
});

// Os itens ficam achatados para o hook de scroll
const allItems = data?.pages.flatMap((page) => page.items) ?? [];
```

---

### Comparativo: solução atual vs. com API

```
SOLUÇÃO ATUAL                        SOLUÇÃO COM API PRÓPRIA
─────────────────────────────────    ──────────────────────────────────

PokéAPI (build-time, SSG)            Next.js Route Handler
    │                                /api/pokemon
    │ 905 fetches em lotes de 50          │
    │ revalidate: 86400 (cache 24h)       │ retorna 20 itens + cursor
    ▼                                     ▼
page.tsx serializa 905 itens         useInfiniteQuery (React Query)
    │ como props no HTML estático         │ cache automático + prefetch
    ▼                                     ▼
usePokedexFilters                    usePokedexFilters
    │ filtra em memória                   │ filtra em memória
    ▼                                     ▼
useInfiniteScroll                    useInfiniteScroll
    │ slice client-side                   │ slice client-side
    ▼                                     ▼
DOM (20 cards)                       DOM (20 cards)

Bundle:     +0 KB extra              Bundle: +13 KB (@tanstack/query)
Latência:   0ms (dados no HTML)      Latência: 50-200ms (network)
Offline:    ✅ (dados no HTML)       Offline: ⚠️ (depende de cache)
Freshness:  revalidado a cada build  Freshness: controlado por Cache-Control
Build time: ~2-3min (905 fetches)    Build time: <30s (sem fetches)
```

→ Próximo: [06-performance.md](./06-performance.md)

---

## Problemas clássicos de gestão de dados

Esta seção documenta os 10 problemas clássicos de data management e como
cada um se manifesta (ou foi resolvido) neste projeto.

---

### 1. N+1 Query Problem

**O que é**: para exibir N itens, o sistema faz 1 query para obter a lista
e depois N queries individuais para buscar o detalhe de cada item.
Resultado: latência cresce linearmente com o número de itens.

```
Exemplo:
  1 query → "liste os IDs"       → banco retorna [1, 2, 3, ..., 905]
  905 queries → "detalhe do ID"  → 905 roundtrips ao banco/API

  Total: 906 queries
  Esperado: 1 query com JOIN
```

**Neste projeto**:

```
Camada 1 (Por Pokémon):
  GET /pokemon/{id}          × 905
  GET /pokemon-species/{id}  × 905
  GET /evolution-chain/{url} × 905 (~440 únicas — duplicatas resolvidas por React cache())
  GET /type/{name}           × ~1.400 (~18 únicas — ampliado por 2 tipos por Pokémon)

Camada 2 (Evolution chains):
  905 fetches, ~440 únicas → ~465 fetches desnecessários

Camada 3 (Types):
  ~1.400 fetches, 18 únicos → ~1.382 fetches desnecessários

Total bruto:      ~4.525 requests
Total necessário: ~2.268 requests
```

**Solução aplicada**: `pokeapi-service.ts` usa `React.cache()` para
deduplicar evolution chains e types dentro de uma mesma execução de build.
O N+1 de Pokémon é aceito em build-time (acontece uma única vez).
Em runtime, o JSON local elimina completamente requests de API.

---

### 2. Underfetching

**O que é**: a API retorna menos dados do que o necessário, obrigando
uma segunda (ou terceira) chamada para completar a informação.

```
Exemplo típico (REST):
  GET /pokemon/1 → { id: 1, name: "bulbasaur", types: ["grass", "poison"] }
    ↓ não retorna descrição, evolução, fraquezas
  GET /pokemon-species/1 → { description, evolution_chain.url }
    ↓ não retorna a cadeia completa — apenas a URL
  GET /evolution-chain/1 → { chain: { ... } }
    ↓ finalmente o dado completo
  3 roundtrips para exibir 1 card de detalhe
```

**Neste projeto**:

A PokéAPI exibe underfetching por design — cada endpoint retorna apenas
um subconjunto do domínio. O `pokeapi-service.ts` resolve fazendo 2 rodadas
paralelas (Round 1: `pokemon` + `species`; Round 2: `evolution` + `types`).

**O que elimina o problema em runtime**: `pokemon-catalog.json` agrega
todos os campos em um único objeto `PokemonCatalogItem`. Uma única leitura
do arquivo já fornece tudo que a lista E o detalhe precisam — sem rodadas
adicionais.

---

### 3. Overfetching

**O que é**: a API retorna mais dados do que o necessário para a tela atual.
Banda desperdiçada, parse desnecessário, memória inflada.

```
Exemplo típico (REST):
  GET /pokemon/1 → { 100 campos }
    Tela de lista usa apenas: id, name, number, image, types
    99% dos campos descartados pelo componente
```

**Neste projeto**:

A PokéAPI retorna payloads grandes (cada `/pokemon/{id}` tem ~300KB de JSON
incluindo sprites múltiplos, moves, stat base, etc.). `pokeapi-mappers.ts`
filtra e normaliza apenas os campos necessários, reduzindo para ~500 bytes
por Pokémon no `PokemonCatalogItem`.

```
/pokemon/{id} raw:    ~300KB (JSON completo com 80+ campos)
                ↓
     pokeapi-mappers.ts
                ↓
PokemonCatalogItem:   ~500B  (apenas os campos usados na UI)
```

**Solução em runtime**: o JSON local já contém apenas os campos mapeados —
zero overfetching.

---

### 4. Cache inexistente

**O que é**: cada request vai até a origem mesmo que o mesmo dado tenha
sido buscado recentemente. Latência artificial e carga desnecessária no
backend.

```
Sem cache:
  Request A → PokeAPI /type/fire → 200ms → responde
  Request B → PokeAPI /type/fire → 200ms → responde (mesmo dado)
  Request C → PokeAPI /type/fire → 200ms → responde (mesmo dado)
  3 × 200ms = 600ms perdidos
```

**Neste projeto**:

Três camadas de cache foram aplicadas:

```
1. React.cache() (build-time)
   → deduplica chamadas idênticas dentro de uma mesma execução do servidor
   → os 18 tipos únicos são buscados uma única vez por build

2. fetch({ next: { revalidate: 86400 } }) (build-time)
   → Next.js persiste o resultado em disco por 24h
   → rebuilds dentro da janela não refazem os requests

3. Service Worker / Cache API (runtime)
   → assets e sprites em CacheFirst (30 dias para images, 1 ano para JS)
   → segunda visita não faz nenhum request para a rede
```

---

### 5. Requests sequenciais (Waterfall)

**O que é**: o sistema aguarda o resultado de um request antes de disparar
o próximo, mesmo quando não há dependência de dados entre eles. Latência
total = soma das latências individuais.

```
Sequencial (ruim):
  t=0ms  → GET /pokemon/1   →  resposta em 200ms
  t=200ms → GET /pokemon/2  →  resposta em 200ms
  t=400ms → GET /pokemon/3  →  resposta em 200ms
  ...
  Total para 905 Pokémon: ~180 segundos ❌

Paralelo (correto):
  t=0ms  → GET /pokemon/{1..50} (50 em paralelo)
  t=200ms → GET /pokemon/{51..100} (próximo lote)
  ...
  Total: ~19 batches × 200ms ≈ 3.8 segundos ✅ (ainda lento, mas 47x melhor)
```

**Neste projeto**:

`pokeapi-service.ts` usava waterfall em alguns pontos. A implementação
correta usa `Promise.all` dentro de batches de 50 para paralelizar requests
do mesmo tipo, enquanto a dependência entre rodadas (Rodada 1 → Rodada 2)
é respeitada.

**Eliminado em runtime**: JSON local é leitura síncrona — sem waterfall possível.

---

### 6. Payload gigante

**O que é**: a API retorna payloads desnecessariamente grandes para a tela
atual, aumentando o tempo de download e parse, especialmente em mobile.

```
Tela de lista (mostra 20 cards):
  Recebe 905 Pokémon serializados no HTML
  HTML serializado: ~1.2MB (antes de compressão)
  Com Brotli:       ~180KB
  
  Necessário para renderizar os 20 cards visíveis: ~10KB
```

**Neste projeto**:

A arquitetura SSG serializa todos os 905 Pokémon no HTML de uma única vez.
Isso é intencional — elimina a necessidade de qualquer fetch posterior para
filtros e ordenação. O trade-off é aceito porque:

- Brotli/gzip comprimem JSON repetitivo de forma muito eficiente (~85%)
- O SSG significa que o HTML vem do CDN (< 100ms de latência)
- O `useInfiniteScroll` garante que apenas ~160 nós DOM são montados

Para APIs reais, a paginação cursor-based (ver acima) resolve o problema
de payload para listas longas.

---

### 7. Re-fetch desnecessário

**O que é**: o sistema busca novamente um dado que já está disponível em
memória ou cache, sem que o dado tenha mudado.

```
Exemplo:
  Usuário abre tela de Pokédex → 905 Pokémon buscados
  Usuário navega para detalhe de Bulbasaur
  Usuário pressiona Voltar
  → Sistema busca os 905 Pokémon novamente ❌
    (os dados não mudaram, estavam em memória)
```

**Neste projeto**:

O Next.js App Router preserva o estado do Client Component entre navegações
(sem unmount completo ao usar `<Link>`). O `initialCatalog` prop chegou via
SSG e nunca precisa ser re-buscado.

**Potencial problema**: se o componente for desmontado por qualquer motivo
(ex: pressão de memória do sistema operacional em um WebView), o dado é
perdido. Mitigação: o Service Worker tem o HTML em cache — reload é rápido.

---

### 8. Acoplamento forte entre UI e fonte de dados

**O que é**: componentes dependem diretamente de funções de busca de dados,
dificultando testes, troca de fonte e manutenção.

```
Acoplamento forte (ruim):
  PokemonCard ──imports──> fetch('/api/pokemon/1')
  ↓
  Teste de PokemonCard exige mock da rede
  Trocar PokeAPI por API própria exige mudar o componente

Acoplamento via props (correto):
  page.tsx ──calls──> getPokemonCatalog()
  page.tsx ──passes──> <PokedexListClient initialCatalog={catalog} />
  PokedexListClient ──passes──> <PokemonCard item={item} />
  ↓
  PokemonCard não sabe de onde vieram os dados
  Trocas na fonte de dados afetam apenas page.tsx
```

**Neste projeto**: a separação entre `pokedex-service.ts` (fonte) e
componentes (UI) segue o padrão correto. A única mudança necessária para
trocar a fonte de dados foi alterar o import em 5 arquivos de página —
zero mudanças nos componentes.

---

### 9. Chuva de requests (Thundering Herd)

**O que é**: múltiplos clients fazem o mesmo request ao mesmo tempo, quando
o cache expira ou o servidor reinicia — sobrecarregando a origem.

```
Cache expirou às 12:00:00
  t=12:00:01 → 1.000 usuários abrem o app
  → 1.000 requests idênticos chegam na origin ao mesmo tempo
  → origin fica sobrecarregado
  → latência sobe, alguns requests falham
  → usuários tentam novamente → ainda mais requests
```

**Neste projeto**:

O SSG elimina o thundering herd para HTML — o CDN serve o arquivo estático
sem nunca bater na origin após o deploy. Para assets, o Service Worker
adiciona uma camada de cache local: cada device tem seu próprio cache,
sem coordenação central necessária.

Para APIs reais, o padrão `stale-while-revalidate` (documentado na seção
de Headers HTTP) distribui a revalidação no tempo, evitando picos.

---

### 10. Estado inconsistente

**O que é**: diferentes partes da UI mostram versões diferentes do mesmo
dado porque foram buscados em momentos diferentes ou de fontes diferentes.

```
Exemplo:
  Lista mostra "Bulbasaur — Favorito: ✅"
  Detalhe mostra "Bulbasaur — Favorito: ❌"
  
  → Buscados em momentos diferentes; estado de favorito divergiu
```

**Neste projeto**:

O estado de favoritos é gerenciado pelo `use-favorites.ts` + `favorites-store.ts`
(localStorage), que é a única fonte de verdade. O componente de toggle na
lista e na tela de detalhe leem do mesmo store — impossível divergir.

Para o catálogo de Pokémon (dados imutáveis no JSON local), inconsistência
é impossível por design: há apenas uma cópia do dado, nunca sincronizada
entre instâncias.

---

### Resumo: como este projeto resolve cada problema

| Problema | Camada de resolução |
|---|---|
| N+1 | JSON local em runtime; `React.cache()` no build |
| Underfetching | `PokemonCatalogItem` agrega tudo em um objeto |
| Overfetching | `pokeapi-mappers.ts` filtra ao construir o JSON |
| Cache inexistente | `React.cache()` + `revalidate:86400` + Service Worker |
| Requests sequenciais | `Promise.all` em batches de 50 no build |
| Payload gigante | Brotli + SSG + `useInfiniteScroll` (DOM limitado) |
| Re-fetch desnecessário | SSG + App Router preserva estado entre rotas |
| Acoplamento forte | Service separado de componentes (props boundary) |
| Chuva de requests | CDN estático + Service Worker (cache local por device) |
| Estado inconsistente | Store único de favoritos + JSON imutável |

→ Próximo: [06-performance.md](./06-performance.md)
