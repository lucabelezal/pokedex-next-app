# 02 — Abordagens

## Todas as alternativas avaliadas

---

### Visão geral

```
PADRÃO              MEMÓRIA    FLUÊNCIA    COMPLEXIDADE    DEPS EXTRAS
──────────────────  ─────────  ──────────  ──────────────  ───────────
Render tudo         ❌ Alta    ❌ Baixa    ✅ Zero         Nenhuma
Paginação clássica  ✅ Baixa   ⚠️  Média   ✅ Baixa        Nenhuma
Load More manual    ✅ Baixa   ⚠️  Média   ✅ Baixa        Nenhuma
Infinite Scroll IO  ✅ Baixa   ✅ Alta     ⚠️  Média        Nenhuma ← adotado
Virtualização       ✅ Mínima  ✅ Máxima   ❌ Alta         tanstack-virtual
React Query inf.    ✅ Baixa   ✅ Alta     ⚠️  Média        @tanstack/query
```

---

### 1. Render tudo (solução atual antes desta implementação)

```
┌─────────────────────┐
│  Card 1             │
│  Card 2             │
│  Card 3             │  ← todos no DOM simultaneamente
│  ...                │
│  Card 905           │
└─────────────────────┘
```

**Quando usar**: listas com menos de 50 itens simples.

**Por que não aqui**: 905 cards complexos → DOM gigante → jank em WebView.
Ver [01-problema.md](./01-problema.md) para números.

---

### 2. Paginação clássica

```
┌─────────────────────┐     ┌─────────────────────┐
│  Card 1..20         │     │  Card 21..40         │
│                     │     │                      │
│  [← 1  2  3  →]    │ ──> │  [← 1  2  3  →]     │
└─────────────────────┘     └─────────────────────┘
     página 1                    página 2
```

**Quando usar**: admin dashboards, resultados de busca estruturada,
documentação, qualquer contexto onde o usuário precisa de referência
de posição ("estou na página 3 de 10").

**Por que não aqui**: em catálogos mobile de exploração, botões de paginação
criam fricção. O usuário não está procurando o "Pokémon número 47" — está
navegando e descobrindo. Paginação interrompe esse fluxo.

---

### 3. Load More manual

```
┌─────────────────────┐
│  Card 1             │
│  Card 2             │
│  Card 3             │
│  ...                │
│  Card 20            │
│                     │
│  [ Carregar mais ]  │ ← clique explícito do usuário
└─────────────────────┘
```

**Quando usar**: catálogos de e-commerce onde o usuário quer controle
(ex: Amazon, Shopee), galerias de projetos (Behance).

**Por que não aqui**: adiciona um passo de interação desnecessário para
um catálogo de exploração. No mobile WebView, o scroll já tem inércia
natural — interromper com um botão quebra o ritmo.

**Nota**: Load More é um bom fallback para acessibilidade (usuários de
teclado ou leitores de tela que não disparam o IO). Documentado em
[07-ux.md](./07-ux.md).

---

### 4. Infinite Scroll + IntersectionObserver ← ADOTADO

```
┌─────────────────────┐ ← topo do viewport
│  Card 1             │
│  Card 2             │
│  Card 3             │ ← borda visível
├ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┤ ← rootMargin -200px: IO dispara AQUI
│  Card 4             │   próximo lote já está sendo preparado
│  [sentinel ●]       │   antes do usuário chegar no fim
├─────────────────────┤
│                     │
│  (não renderizado)  │
│  Cards 21..905      │
│                     │
└─────────────────────┘
```

**Como funciona**:
1. Renderiza os primeiros 20 cards
2. Um `<div>` sentinel vive após o último card
3. `IntersectionObserver` detecta quando o sentinel entra no viewport
   (com `rootMargin: "200px"` de antecipação)
4. Incrementa a página → slice expande → React renderiza mais 20
5. Repete até `hasMore === false`

**Quando filtros mudam**: `page` reseta para `1`, scroll vai ao topo.
O usuário inicia uma nova exploração — a posição anterior não tem valor.

**Por que aqui**:
- Zero dependências externas
- Dados já em memória (sem fetch)
- Fluência nativa do scroll mobile
- Compatible com todos os filtros existentes
- `IntersectionObserver` tem suporte ≥ 98% nos browsers modernos

---

### 5. Virtualização (windowing)

```
┌─────────────────────┐
│  [espaço virtual]   │ ← altura calculada para itens não renderizados
│  Card 42            │ ← nó DOM real
│  Card 43            │ ← nó DOM real
│  Card 44            │ ← nó DOM real
│  [espaço virtual]   │ ← altura calculada para itens abaixo
└─────────────────────┘

DOM sempre tem ~5-10 nós reais, independente de quantos itens existam.
```

**Bibliotecas**: `@tanstack/react-virtual`, `react-window`, `react-virtuoso`

**Quando usar**: listas com 10.000+ itens, altura de item fixa e conhecida,
tabelas de dados financeiros, feeds em tempo real com reordenação constante.

**Por que não aqui**:
- Altura dos cards não é uniforme (Pokémon com 1 tipo vs. 2 tipos)
- 905 itens é manejável com slice simples
- Adicionaria complexidade e uma dependência para ganho marginal
- Scroll "elástico" do iOS pode travar com virtual scroll em WebView

**Fase futura**: se o catálogo crescer para 5.000+ itens ou cards ficarem
mais complexos, virtualização com `@tanstack/react-virtual` é a evolução
natural. Ver [roadmap em 09-stack.md](./09-stack.md#roadmap).

---

### 6. React Query `useInfiniteQuery`

```typescript
const { data, fetchNextPage, hasNextPage } = useInfiniteQuery({
  queryKey: ['pokemon', { type, sort, query }],
  queryFn: ({ pageParam }) => fetchPokemon({ cursor: pageParam, limit: 20 }),
  getNextPageParam: (lastPage) => lastPage.nextCursor,
});
```

**Quando usar**: quando há uma **API real** no backend. Oferece cache
automático, deduplicação de requests, revalidação em background, e
gerenciamento de estado de loading/error de graça.

**Por que não aqui**: os dados são JSON estático em memória. Instalar
`@tanstack/react-query` apenas para paginar um array local seria
over-engineering — adicionaria 13KB ao bundle sem nenhum benefício real.

**Para projetos com API**: ver [05-api-design.md](./05-api-design.md) e
[09-stack.md](./09-stack.md) para a arquitetura recomendada com React Query.

---

→ Próximo: [03-decisao.md](./03-decisao.md)
