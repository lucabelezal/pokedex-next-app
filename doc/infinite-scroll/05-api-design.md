# 05 — API Design

## Design de API REST paginada para quando houver backend

> Esta seção é forward-looking: o projeto atual usa dados estáticos.
> Documente aqui para quando um backend real for implementado — ou como
> referência para outros projetos que já possuem API.

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
SOLUÇÃO ATUAL (MVP)                  SOLUÇÃO COM API (PRODUÇÃO)
───────────────────                  ──────────────────────────

page.tsx (SSG)                       Next.js Route Handler
    │                                /api/pokemon
    │ serializa props (905 itens)         │
    │ no HTML estático                    │ retorna 20 itens + cursor
    ▼                                     ▼
usePokedexFilters                    useInfiniteQuery (React Query)
    │ filtra em memória                   │ cache automático
    ▼                                     │ prefetch
useInfiniteScroll                         │ dedup de requests
    │ slice client-side               useInfiniteScroll
    ▼                                     │
DOM (20 cards)                        DOM (20 cards)

Bundle:    +0 KB                     Bundle: +13 KB (@tanstack/query)
Latência:  0ms (memória)             Latência: 50-200ms (network)
Offline:   ✅ (dados no HTML)        Offline: ⚠️ (depende de cache)
Staleness: nunca (build time)        Staleness: controlado por Cache-Control
```

→ Próximo: [06-performance.md](./06-performance.md)
