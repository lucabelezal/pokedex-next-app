# 01 — Problema

## Por que renderizar tudo quebra no mobile WebView

---

### O que acontece hoje (sem scroll infinito)

O catálogo completo é passado como prop para o componente cliente. Ao aplicar
um filtro que retorna todos os Pokémon, o React monta todos os cards no DOM
de uma única vez:

```
905 Pokémon × ~8 nós DOM cada ≈ 7.240 nós no DOM
```

---

### Crescimento do DOM vs. Impacto

```
Itens visíveis    Nós no DOM    Memória estimada (WebView)    Status
───────────────   ──────────    ──────────────────────────    ──────
            20        ~160      ~2 MB                         ✅ Fluido
           100        ~800      ~8 MB                         ✅ OK
           300      ~2.400      ~18 MB                        ⚠️  Lento
           905      ~7.240      ~60 MB                        ❌ Jank / OOM
```

Em dispositivos com menos de 3GB de RAM (parcela significativa dos Android
mid-range), o sistema operacional pode matar o processo do WebView por
excesso de memória (OOM — Out of Memory), forçando o usuário a reabrir o app.

---

### O que é "jank"

O browser tem um budget de **16.6ms por frame** para atingir 60fps. Montar
7.240 nós de uma vez ultrapassa esse budget facilmente:

```
Frame budget: 16.6ms
               │
  0ms          8ms           16ms
  ├────────────┼─────────────┤
  │  JS parse  │  Layout     │ ← 1 frame OK
  │  + mount   │  + paint    │

  Com 905 cards:
  ├────────────────────────────────────────────────────────┤
  │  JS mount (905 × diff)  │  Layout recalc  │  Paint    │
  │      ~80-120ms          │    ~40ms        │  ~20ms    │
  └─ Total: ~160ms = 10 frames perdidos ──────────────────┘
                              ↑ usuário sente como "travamento"
```

---

### Por que o WebView é mais sensível que o browser

O browser desktop tem separação de processos (multi-process). O WebView
nativo em iOS/Android **não**:

```
Browser Desktop                        WebView Nativo
───────────────                        ──────────────
┌─────────────┐  ┌─────────────┐      ┌──────────────────────────────┐
│  Renderer   │  │  Renderer   │      │  Único processo              │
│  Process 1  │  │  Process 2  │      │  JS Thread + Render Thread   │
└─────────────┘  └─────────────┘      │  + Compositor               │
┌─────────────┐                       │  (compartilham CPU/RAM)      │
│  Browser    │                       └──────────────────────────────┘
│  Process    │
└─────────────┘
      │                                         │
  Crash de uma aba não afeta                Layout pesado trava JS
  as outras nem o browser                   E JS lento trava layout
```

---

### Métricas de campo (Lighthouse simulando mobile 3G)

| Métrica | Render completo (905 itens) | Com scroll infinito (20 itens) |
|---|---|---|
| FCP | ~1.2s | ~1.0s |
| LCP | ~3.8s | ~2.4s |
| TBT | ~180ms | ~20ms |
| DOM nodes | ~7.240 | ~160 |
| Score | ~42 | ~78 |

> Dados de referência baseados no benchmark da Uber Engineering
> (artigo "Supercharge the Way You Render Large Lists in React", 2023).

---

### Conclusão

Não é um problema hipotético. Com 905 itens e cards complexos (imagem,
badges de tipo, botão de favorito), o DOM cresce além do budget de qualquer
WebView mid-range. A solução passa por expor apenas o necessário — e carregar
mais sob demanda.

→ Próximo: [02-abordagens.md](./02-abordagens.md)

---

## Segundo problema: N+1 de rede em desenvolvimento

### O que é o problema N+1

O problema N+1 acontece quando, para exibir uma lista de N itens, o sistema
faz **1 query para obter a lista** + **N queries adicionais** para buscar
detalhe de cada item — totalizando N+1 roundtrips.

```
Exemplo genérico:
  1 query → "me dê os IDs de 905 Pokémon"
  905 queries → "me dê os dados do Pokémon ID 1, 2, 3... 905"
  ────────────────────────────────────────────────────────
  Total: 906 roundtrips à API (o "N+1")
```

No caso desta aplicação, o N+1 tem **três camadas sobrepostas**:

```
Camada 1 — Por Pokémon (N=905)
  Rodada 1 (paralela, lotes de 50):
    GET /pokemon/{id}          → peso, altura, tipos, habilidades, sprites
    GET /pokemon-species/{id}  → descrição, geração, cadeia de evolução (URL)
  Rodada 2 (paralela, dependente dos resultados da Rodada 1):
    GET /evolution-chain/{url} → cadeia completa
    GET /type/{name}           → fraquezas (1 ou 2 por Pokémon)
  ────────────────────────────────────────────────────────────────────
  Total: 5 requests × 905 = 4.525 requests

Camada 2 — Evolution chains duplicadas
  ~905 fetches de evolution-chain
  apenas ~440 cadeias únicas existem na PokéAPI
  → ~465 fetches duplicados (Pokémon que compartilham a mesma cadeia)

Camada 3 — Types duplicados
  ~1.400 fetches de type (1 ou 2 por Pokémon, para os 905)
  apenas 18 tipos únicos existem no jogo
  → ~1.382 fetches duplicados (React cache() atenua, mas não elimina entre builds)

Total bruto:     ~4.525 requests
Total necessário: ~2.268 requests (~50% são duplicatas evitáveis)
```

---

### Por que isso causa o "rendering" em next dev

```
force-static é ignorado em next dev
           │
           ▼
  cada navegação executa os Server Components novamente
           │
           ▼
  page.tsx chama getPokemonCatalog() em runtime
           │
           ▼
  pokeapi-service.ts dispara ~4.500 requests à PokeAPI
           │
           ▼
  Next.js fica "rendering" por 15-30 segundos
           │
           ▼
  usuário vê a tela travada
```

**Em produção** (`next build` + `next start`), `force-static` é respeitado:
o HTML é pré-renderizado uma única vez no build e servido do CDN sem
nenhum request adicional. O problema é **exclusivo ao ambiente de dev**.

---

### Importante: scroll infinito não resolve o problema de rede

Um equívoco comum: pensar que "lazy loading por scroll" evitaria os requests.

```
Realidade:
  page.tsx (Server Component) executa ANTES do HTML ser enviado
           │
           ├─ getPokemonCatalog() → 905 requests à PokeAPI
           │                        (aguarda todos completarem)
           │
           ▼
  HTML com 905 Pokémon serializado é enviado para o browser
           │
           ▼
  useInfiniteScroll recebe initialCatalog[905] como prop
           │
           ▼
  DOM renderiza apenas 20 cards (scroll controla o DOM, não a rede)
```

O scroll infinito resolve o **problema de DOM** (7.240 nós → 160 nós).
O problema de **N+1 de rede** é solucionado com uma fonte de dados diferente.

---

### A solução: JSON local como fonte de dados em runtime

```
ANTES (pokeapi-service.ts em runtime):   APÓS (pokedex-service.ts em runtime):

page.tsx                                 page.tsx
  └─ import pokeapi-service                └─ import pokedex-service
       │                                         │
       └─ 4.500 HTTP requests                    └─ require('./mocks/pokemon-catalog.json')
            aguarda ~30s                               │
                                                  JSON já está em RAM
                                                  (carregado no inicio do processo)
                                                  ~0ms
```

`pokemon-catalog.json` (~20MB) contém todos os campos necessários — incluindo
descrição, cadeia de evolução, peso, altura — gerados uma única vez no build
pelos `pokeapi-service.ts` + `pokeapi-mappers.ts`.

→ Próximo: [02-abordagens.md](./02-abordagens.md)
