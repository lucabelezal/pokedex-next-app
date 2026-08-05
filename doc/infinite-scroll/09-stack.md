# 09 — Stack

## Como WebView + React + Next.js trabalham juntos

---

### As camadas da aplicação

```
┌──────────────────────────────────────────────────────────────────┐
│  HARDWARE (CPU / GPU / RAM)                                      │
├──────────────────────────────────────────────────────────────────┤
│  SISTEMA OPERACIONAL (iOS / Android)                             │
│  Gerenciamento de memória, processos, OOM killer                 │
├──────────────────────────────────────────────────────────────────┤
│  NATIVE APP SHELL (Swift/SwiftUI · Kotlin/Jetpack Compose)       │
│  Navegação nativa, push notifications, permissões                │
│  Deep links, splash screen, ícone do app, App Store              │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  WKWebView (iOS) / WebView/Chromium (Android)              │  │
│  │                                                            │  │
│  │  Chromium rendering engine (Blink + V8)                    │  │
│  │  ┌──────────────────────────────────────────────────────┐  │  │
│  │  │  Service Worker (sw.js — Workbox via next-pwa)        │  │  │
│  │  │                                                       │  │  │
│  │  │  Intercepta todos os requests HTTP do WebView         │  │  │
│  │  │  ┌───────────────────────────────────────────────┐   │  │  │
│  │  │  │  Cache API (por estratégia)                   │   │  │  │
│  │  │  │  /_next/static/**   → CacheFirst (1 ano)      │   │  │  │
│  │  │  │  /assets/**         → CacheFirst (7 dias)     │   │  │  │
│  │  │  │  PokeAPI sprites    → CacheFirst (30 dias)    │   │  │  │
│  │  │  │  /api/**            → NetworkFirst (1 dia)    │   │  │  │
│  │  │  │  Navegação (HTML)   → StaleWhileRevalidate    │   │  │  │
│  │  │  └───────────────────────────────────────────────┘   │  │  │
│  │  └───────────────────┬──────────────────────────────────┘  │  │
│  │                      │ requests que passam pelo SW          │  │
│  │  ┌───────────────────▼──────────────────────────────────┐  │  │
│  │  │  HTML + CSS + JavaScript                             │  │  │
│  │  │                                                      │  │  │
│  │  │  ┌────────────────────────────────────────────────┐  │  │  │
│  │  │  │  Next.js App Router                            │  │  │  │
│  │  │  │  Roteamento, SSG/SSR, layouts, Server Actions  │  │  │  │
│  │  │  │  ┌──────────────────────────────────────────┐  │  │  │  │
│  │  │  │  │  React 19 (Concurrent)                   │  │  │  │  │
│  │  │  │  │  Component tree, hooks, fiber scheduler  │  │  │  │  │
│  │  │  │  │  ┌────────────────────────────────────┐  │  │  │  │  │
│  │  │  │  │  │  Componentes da aplicação          │  │  │  │  │  │
│  │  │  │  │  │  PokedexListClient                 │  │  │  │  │  │
│  │  │  │  │  │  usePokedexFilters                 │  │  │  │  │  │
│  │  │  │  │  │  useInfiniteScroll                 │  │  │  │  │  │
│  │  │  │  │  └────────────────────────────────────┘  │  │  │  │  │
│  │  │  │  └──────────────────────────────────────────┘  │  │  │  │
│  │  │  └────────────────────────────────────────────────┘  │  │  │
│  │  └──────────────────────────────────────────────────────┘  │  │
│  └────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
```

---

### Por que o Service Worker fica ENTRE o WebView e o HTML

O Service Worker é um script JavaScript que roda em uma **thread separada**
(fora da página), com acesso à Fetch API do browser. Ele intercepta todos
os requests antes que cheguem à rede:

```
Sem Service Worker:           Com Service Worker:
  Página faz fetch()            Página faz fetch()
       │                              │
       ▼                        Service Worker intercepta
    Rede                              │
  (CDN / origem)               ┌─────▼──────────────────┐
       │                       │  Cache API              │
       ▼                       │  HIT?  → resposta local │
  Resposta                     │  MISS? → Rede → Cache   │
                               └─────────────────────────┘
```

**Resultado prático**:
- Segunda visita: 0 requests à rede para HTML e assets estáticos
- Offline: o app abre e funciona normalmente com dados do cache

---

### O ciclo de vida completo: do build até o usuário

```
DESENVOLVEDOR                                          USUÁRIO
────────────                                           ───────

npm run build
     │
     ├─ Next.js executa page.tsx no Node.js (server-side)
     │   getAppConfig()           → appConfig.json (local, sync)
     │   getPokemonCatalog()      → unstable_cache → PokéAPI (905 × 4 requests)
     │   getAvailableTypeFilters() → type-metadata (local, sync)
     │
     ├─ Gera arquivos estáticos:
     │   out/index.html           (HTML com dados embutidos)
     │   _next/static/chunks/*.js (código React/Next.js)
     │   _next/static/media/*     (fontes, imagens otimizadas)
     │
     └─ Deploy → CDN (Vercel Edge / Cloudflare)

                                USUÁRIO ABRE O APP
                                     │
                              Native Shell inicializa WebView
                                     │
                              WebView faz GET /
                                     │
                              CDN responde com HTML (< 100ms)
                                     │
                              Browser parser lê HTML → FCP
                              "Primeiro conteúdo visível"
                              (cards pré-renderizados como HTML estático)
                                     │
                              Browser baixa JS chunks em paralelo
                                     │
                              React 19 hidrata o DOM
                              (conecta event listeners ao HTML existente)
                                     │
                              usePokedexFilters inicializa
                              useInfiniteScroll(filtered, {pageSize: 20})
                              IntersectionObserver registrado
                                     │
                              TTI — "Time to Interactive"
                              usuário pode scrollar e filtrar
```

---

### O que é "hidratação" e por que importa para performance

```
SEM HIDRATAÇÃO (SPA pura):          COM HIDRATAÇÃO (Next.js SSG):

GET /                               GET /
     │                                   │
  HTML vazio:                         HTML com conteúdo:
  <div id="root"></div>               <div id="root">
                                        <div class="card">Bulbasaur</div>
     │                                   <div class="card">Ivysaur</div>
  Download JS (~500KB)                   ...
     │                               </div>
  React monta TODO o DOM                 │
     │                               Download JS (~500KB)
  FCP = LCP = TTI (~3-4s)                │
                                    React "liga" o HTML existente
                                    (não recria os nós DOM)
                                         │
                                    FCP (~0.5s) ← usuário já vê conteúdo
                                    TTI (~1.5s) ← React hidrata
```

No WebView, isso é especialmente importante: o usuário vê os primeiros
cards **imediatamente** enquanto o JS ainda está sendo baixado e parseado.

---

### React 19: Concurrent Rendering no WebView

React 19 introduz o Concurrent Mode por padrão. Para scroll infinito,
o benefício é que React pode **interromper** renders pesados:

```
SEM CONCURRENT (React 17):          COM CONCURRENT (React 19):

Usuário digita no filtro            Usuário digita no filtro
     │                                   │
React começa re-render de               React inicia re-render
905 itens (batch)                        │
     │                              useTransition / startTransition
  Main Thread bloqueado                  │
  por ~80ms                        Render é interrompível
     │                                   │
  Teclado não responde             Input responde imediatamente
  Input parece "travado"           Render acontece em background
```

O `usePokedexFilters` e `useInfiniteScroll` se beneficiam disso:
filtrar por tipo pode ser wrapped em `startTransition` se necessário,
mantendo o input responsivo enquanto o slice é calculado.

---

### WebView vs. Browser: diferenças críticas

```
BROWSER DESKTOP / MOBILE             WEBVIEW NATIVO
────────────────────────             ───────────────

Processos separados por aba          Processo único
  ┌──────────┐ ┌──────────┐          ┌──────────────────────────┐
  │Renderer 1│ │Renderer 2│          │ JS Thread                │
  └──────────┘ └──────────┘          │ + Render Thread          │
  ┌──────────────────────┐           │ + Compositor             │
  │  Browser Process     │           │ (compartilham CPU/RAM)   │
  └──────────────────────┘           └──────────────────────────┘

Crash de aba não afeta browser  →  Crash = app fecha para o usuário

Budget de memória ~1-2GB        →  Budget ~200-400MB (pode ser menos)

OS não mata o processo          →  OOM Killer pode matar o WebView
                                   se memória exceder o budget

Sobre-scroll termina no limite  →  Over-scroll pode ter scroll elástico
                                   customizado pela Shell nativa

DevTools sempre disponíveis     →  Requer configuração (Safari Web Inspector
                                   / Chrome Remote Debugging via USB)
```

---

### Fluxo de threads no WebView

```
Main Thread (JS + DOM)          Compositor Thread
──────────────────────          ─────────────────

usePokedexFilters               Detecta interseção do sentinel
  └─ useMemo (filter)     ←─── IntersectionObserver callback
  └─ useMemo (sort)             dispara no Compositor Thread
                                (não bloqueia o Main Thread)
useInfiniteScroll
  └─ setPage(page + 1)    ←─── IO callback chama loadMore()
  └─ useMemo (slice)            que via React schedule vai
                                para o Main Thread

DOM update                      Scroll handling
  └─ 20 novos card nodes        └─ smooth, nunca bloqueado
  └─ React diff + commit          pelo JS (IO é passivo)
  └─ ~2ms
```

---

### Roadmap de evolução arquitetural

```
FASE 1 (atual)              FASE 2                    FASE 3
──────────────              ──────                    ──────
JSON estático               API REST                  + Otimizações
+ client slice              + React Query             avançadas

force-static SSG            Server Route              Edge Runtime
    │                       /api/pokemon              + KV Cache
    │                           │                         │
usePokedexFilters           useInfiniteQuery          Streaming RSC
    │                           │                         │
useInfiniteScroll           useInfiniteScroll         Virtualização
    │                           │                     (@tanstack/virtual)
DOM (20 cards)              DOM (20 cards)            DOM (10 cards fixos)
                            + prefetch next           + memory release
                            + background revalidation   de páginas antigas
```

**Quando migrar para Fase 2**:
- Backend real com banco de dados
- Catálogo dinâmico (atualizações frequentes)
- Múltiplos usuários com dados personalizados

**Quando migrar para Fase 3**:
- Catálogo > 5.000 itens
- Low-end device crashes por memória
- Scroll performance < 60fps em benchmark

→ Próximo: [10-prompts.md](./10-prompts.md)
