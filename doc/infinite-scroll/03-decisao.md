# 03 — Decisão (ADR)

## Architecture Decision Record: Scroll Infinito

**Data**: Abril 2026
**Status**: Aceito
**Autores**: Engenharia Frontend

---

### Contexto

A tela de Pokédex renderiza um catálogo de 905 itens via `force-static` no
Next.js App Router. Os dados chegam como prop ao componente cliente e são
filtrados/ordenados em memória via `usePokedexFilters`. O app é entregue como
PWA em WebView nativo (iOS WKWebView / Android WebView baseado em Chromium).

Sem paginação, o React monta todos os cards no DOM simultaneamente, gerando:
- ~7.240 nós no DOM
- ~60MB de memória estimada em WebView
- Total Blocking Time (TBT) de ~160ms em dispositivos mid-range
- Risco de OOM crash em Android com < 3GB RAM

---

### Opções consideradas

| Opção | Descartada por |
|---|---|
| Render tudo | Causa o problema descrito above |
| Paginação clássica | Fricção desnecessária em catálogo de exploração mobile |
| Load More manual | Interrompe o fluxo de scroll nativo |
| **Infinite Scroll + IO** | **← ESCOLHIDA** |
| Virtualização | Complexidade alta; ROI baixo para 905 itens sem altura fixa |
| React Query infinite | Over-engineering; dados locais não precisam de fetch |

---

### Decisão

**Implementar scroll infinito com `IntersectionObserver` nativo e slice
client-side do array filtrado.**

Hook criado: `src/hooks/use-infinite-scroll.ts`

```
useInfiniteScroll<T>(items: T[], options?)
  ↓
  page: number        (estado interno, começa em 1)
  visibleItems: T[]   (items.slice(0, page × pageSize))
  hasMore: boolean    (visibleItems.length < items.length)
  sentinelRef         (ref para o div sentinel)
```

Quando `items` muda (novo filtro aplicado pelo usuário), o hook:
1. Reseta `page` para `1`
2. Chama `window.scrollTo({ top: 0, behavior: "instant" })`

Isso garante que o usuário sempre inicia uma nova exploração do topo —
comportamento padrão em Instagram, TikTok, App Store e Google Play.

---

### Consequências

**Positivas**:
- DOM máximo de ~160 nós (20 cards × 8 nós) vs. ~7.240 anterior
- TBT esperado: < 20ms (melhora de ~87%)
- Zero dependências adicionais — bundle inalterado
- `usePokedexFilters` permanece intocado (separação clara de responsabilidades)
- IntersectionObserver é 100% passivo: não bloqueia o thread principal

**Negativas / Trade-offs aceitos**:
- Usuário não pode "voltar" a uma posição exata após navegar para detalhe
  (mitigação: botão Voltar restaura a página anterior via historia do browser)
- `cmd+F` / busca do browser não encontra itens não renderizados
  (mitigação: há campo de busca próprio no componente)
- Scroll reseta ao trocar filtros (comportamento intencional, documentado)

---

### Critérios de aceite

- [ ] `npm run type-check` passa sem erros
- [ ] `npm run build` gera build estático com sucesso
- [ ] DOM nodes < 200 após carregamento inicial (DevTools Memory)
- [ ] Trocar filtro → lista reseta para primeiros 20 itens
- [ ] Scroll até o fim → todos os 905 Pokémon são carregados
- [ ] Spinner visível durante carregamento do próximo lote
- [ ] Mensagem "Você viu todos os Pokémon" ao chegar no fim

---

### Revisão futura

Esta decisão deve ser revisitada se:
- O catálogo crescer para 5.000+ itens (considerar virtualização)
- Cards ficarem significativamente mais pesados (HTML/JS por card)
- Um backend real for implementado (migrar para React Query `useInfiniteQuery`)
- Memory pressure reports dos usuários indicarem problemas em low-end

→ Próximo: [04-arquitetura.md](./04-arquitetura.md)
