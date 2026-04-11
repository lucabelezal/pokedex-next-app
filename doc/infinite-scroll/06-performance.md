# 06 — Performance

## Frame budget, memória e otimizações específicas para WebView

---

### O frame budget de 60fps

Qualquer trabalho que exceda 16.6ms por frame causa jank visível.
No WebView, esse budget é ainda mais crítico porque JS e render
compartilham o mesmo processo.

```
1 frame = 16.6ms (60fps)

  0ms       4ms        8ms       12ms      16ms
  ├─────────┼──────────┼─────────┼─────────┤
  │  JS     │  Style   │  Layout │  Paint  │  Composite
  │  ████   │  ██      │  ████   │  ██     │  █
  ↑
  Se JS > ~10ms → browser não consegue fazer Style+Layout+Paint no tempo
  → frame é atrasado → usuário percebe como "travamento" (jank)
```

**Com 905 cards sem scroll infinito**:
```
  0ms                                                      180ms
  ├────────────────────────────────────────────────────────┤
  │  React mount (905 × fiber diff)                        │
  │  ~80ms                                                 │
                  │  Layout recalc                         │
                  │  ~60ms                                 │
                            │  Paint                       │
                            │  ~40ms                       │
  └─ 10-11 frames perdidos ────────────────────────────────┘
     usuário vê scroll travado ao abrir a tela
```

**Com scroll infinito (20 cards)**:
```
  0ms    2ms    4ms    8ms    12ms   16ms
  ├──────┼──────┼──────┼──────┼──────┤
  │  JS  │Style │Layout│Paint │ idle │ ← frame OK
  │  ██  │ █    │  ██  │ █    │ ░░░░ │
```

---

### Por que `rootMargin: "200px"` é o número certo

```
Velocidade de scroll típica em mobile: ~1000px/s (dedo rápido)

Tempo para percorrer 200px: 200 / 1000 = 0.2s

Tempo para renderizar 20 cards: ~2ms (em tela, já hidratado)

Margem: 0.2s >> 2ms
→ O próximo lote está pronto ANTES de o usuário chegar no sentinel
→ Zero flash de conteúdo vazio
```

Com `rootMargin: "0px"`:
```
┌────────────────────┐
│  Card 19           │ ← último card visível
│  Card 20           │ ← último card renderizado
│  [sentinel]  ●     │ ← IO dispara AQUI (borda do viewport)
└────────────────────┘
         ↓ 2ms de render
┌────────────────────┐
│  Card 21..40       │ ← aparecem DEPOIS que o usuário já chegou
└────────────────────┘

Resultado: flash branco momentâneo → jank de conteúdo ❌
```

Com `rootMargin: "200px"`:
```
┌────────────────────┐
│  Card 18           │
│  Card 19           │ ← borda do viewport
│  Card 20           │
├ ─ ─ ─ ─ ─ ─ ─ ─ ─┤ ← 200px abaixo: IO dispara AQUI
│  [sentinel]  ●     │   render começa enquanto usuário ainda scrollia
└────────────────────┘
```

---

### IntersectionObserver é passivo por natureza

O scroll no browser tem dois tipos de event listeners:

```
scroll listener ativo:        scroll listener passivo:
  window.addEventListener(      window.addEventListener(
    'scroll',                     'scroll',
    handler,                      handler,
    { passive: false }            { passive: true }   ← padrão IO
  )
  ↓                               ↓
  browser aguarda o handler       browser não aguarda
  antes de fazer scroll           → scroll é imediato
  → pode causar scroll jank       → sem bloqueio
```

`IntersectionObserver` nunca bloqueia o scroll thread. Ele usa o
Compositor Thread do browser para detectar interseções, sem afetar
o Main Thread onde o JS corre. É por isso que é preferível a qualquer
`onScroll` manual.

---

### Impacto no uso de memória

```
ANTES (905 cards)                    DEPOIS (20 cards)
─────────────────                    ─────────────────

DOM Nodes:     ~7.240               DOM Nodes:     ~160
JS Heap:       ~45 MB               JS Heap:       ~8 MB
Layout time:   ~60ms/frame          Layout time:   ~2ms/frame
Style recalc:  ~40ms                Style recalc:  ~1ms
Paint:         ~20ms                Paint:         ~1ms

Total por interação: ~120ms         Total por interação: ~4ms
```

> O array completo (905 itens) ainda vive na memória JS — mas como
> dados primitivos (strings, numbers), não como nós do DOM. A diferença
> é que o DOM é gerenciado pelo browser em C++ e tem custo de layout/paint.
> Um array JS de 905 objetos simples ocupa ~500KB — negligível.

---

### Otimização complementar: `content-visibility`

Para cards que estão fora da área visível mas já foram renderizados
(acumulados após muitos scrolls), o CSS pode economizar tempo de layout:

```css
/* Em PokemonCard */
.pokemon-card {
  content-visibility: auto;
  contain-intrinsic-size: 0 88px; /* altura estimada do card */
}
```

O browser pula o layout de cards fora do viewport, mesmo que estejam
no DOM. Benefício cresce com o número de itens renderizados.

**Por que não implementado aqui**: os cards têm altura variável (1 ou 2
badges de tipo). `contain-intrinsic-size` fixo causaria CLS (Cumulative
Layout Shift). Ativar apenas se os cards tiverem altura uniforme.

---

### Checklist de performance para WebView

- [x] IntersectionObserver em vez de `onScroll`
- [x] `rootMargin: "200px"` para prefetch antes do fim
- [x] `useCallback` no `loadMore` (observer estável, sem recriação)
- [x] `useMemo` no `visibleItems` (sem slice desnecessário em re-renders)
- [x] `behavior: "instant"` no `scrollTo` ao filtrar (sem animação de scroll — evita jank duplo)
- [ ] `content-visibility: auto` nos cards (quando altura for uniforme)
- [ ] Preload de imagens da próxima página (quando houver API real)

→ Próximo: [07-ux.md](./07-ux.md)

---

## Custo de RAM do JSON local

```
Componente                   Tamanho    Custo de RAM estimado
─────────────────────────    ─────────  ─────────────────────
pokemon-catalog.json         ~20MB      ~20MB (string no FS)
                                        ~25MB (objeto JS parseado)
app-config.json              ~1KB       desprezível
regions.json                 ~2KB       desprezível
user-profile.json            ~1KB       desprezível

Node.js process baseline     ---        ~200-300MB
(V8 + runtime + Next.js)

Total do processo            ---        ~225-330MB
```

**~25MB de dados de Pokémon representa menos de 10% do processo Node.js.**

O Module Registry do Node.js garante que o JSON é parsed apenas uma vez
por processo — chamadas subsequentes a `require('./pokemon-catalog.json')`
retornam a referência ao objeto já em memória, sem I/O adicional.

```
Process startup:
  require('./pokemon-catalog.json')
       │
       ├─ I/O (leitura do disco): ~20ms (uma única vez)
       ├─ JSON.parse: ~50ms (uma única vez)
       └─ Module Registry armazena resultado em RAM
              │
              ▼
  Requisição 1: Module Registry HIT → ~0ms
  Requisição 2: Module Registry HIT → ~0ms
  Requisição N: Module Registry HIT → ~0ms
```

Comparativo com a alternativa PokeAPI:

```
JSON local (runtime):                  PokeAPI (runtime):
  20MB em RAM   →  ~0ms/request          ~0MB em RAM   →  ~30s/request
  (custo fixo na inicialização)          (custo variável por navegação)

  Para 100 navegações:                   Para 100 navegações:
  100 × 0ms   = 0ms em requests          100 × 30s = 50 minutos ❌
```

O trade-off é favorável: pagar 25MB de RAM uma única vez para eliminar toda
a latência de rede em runtime.

→ Próximo: [07-ux.md](./07-ux.md)
