# View Transition API

O projeto usa a View Transition API nativa do browser (Chrome 111+, Safari 18.2+) para animar navegação entre páginas.

## Conceito

View Transition tira um "snapshot" da página antes da navegação e outro depois. Depois anima a transição entre os dois snapshots via CSS.

```
[Snapshot A]  ──animação──▶  [Snapshot B]
(página atual)               (nova página)
```

## Direcional (push navigation)

O projeto implementa navegação push estilo iOS:

```tsx
// src/components/directional-transition.tsx
import { ViewTransition } from "react";

export function DirectionalTransition({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransition
      enter={{
        "nav-forward": "nav-forward",
        "nav-back": "nav-back",
        default: "none",
      }}
      exit={{
        "nav-forward": "nav-forward",
        "nav-back": "nav-back",
        default: "none",
      }}
      default="none"
    >
      {children}
    </ViewTransition>
  );
}
```

**Forward (lista → detalhe):** `addTransitionType("nav-forward")`
**Back (detalhe → lista):** `addTransitionType("nav-back")`

## CSS da animação

```css
/* src/app/globals.css */

/* Forward: old sai 30% esquerda, new entra da direita */
::view-transition-old(.nav-forward) {
  animation: 400ms ease-out both push-out-left,
             150ms ease-in both fade reverse;
}
::view-transition-new(.nav-forward) {
  animation: 400ms ease-out both push-in-from-right,
             210ms ease-out 150ms both fade;
}

/* Back: old sai 30% direita, new entra da esquerda */
::view-transition-old(.nav-back) {
  animation: 400ms ease-out both push-out-right,
             150ms ease-in both fade reverse;
}
::view-transition-new(.nav-back) {
  animation: 400ms ease-out both push-in-from-left,
             210ms ease-out 150ms both fade;
}
```

## Shared Element Morph

A imagem do Pokémon na lista "morph" para a imagem no detalhe:

```tsx
// src/components/pokemon-card.tsx (lista)
<ViewTransition name={`pokemon-img-${pokemon.id}`} share="morph" default="none">
  <Image src={pokemon.image} ... />
</ViewTransition>

// src/components/detail-hero.tsx (detalhe) — MESMO name
<ViewTransition name={`pokemon-img-${pokemon.id}`} share="morph">
  <Image src={pokemon.image} ... />
</ViewTransition>
```

Mesmo `name` = mesmo elemento = animação de morph entre as duas views.

## Trigger da animação

A navegação PRECISA estar dentro de `startTransition`:

```tsx
// src/components/pokemon-card.tsx — Link do Next.js com transitionTypes
<Link
  href={`/pokedex/${pokemon.id}`}
  transitionTypes={["nav-forward"]}
  onClick={() => sessionStorage.setItem("prev-route", window.location.pathname)}
/>

// src/components/back-button.tsx — manual com startTransition
const handleClick = useCallback(() => {
  startTransition(() => {
    addTransitionType("nav-back");
    router.push(prev);  // router.back() NÃO funciona com VT!
  });
}, [router, transitionTypes]);
```

## Elementos persistentes

Tab bar não deve participar da transição (persiste entre páginas):

```tsx
// src/components/tab-bar.tsx
<ViewTransition name="tab-bar">
  <nav className="tab-shell ...">...</nav>
</ViewTransition>
```

```css
::view-transition-old(tab-bar) { display: none; }
::view-transition-new(tab-bar) { animation: none; }
```

## Swift (SwiftUI)

```swift
// SwiftUI matchedGeometryEffect — equivalente ao shared element morph
struct PokemonList: View {
    @Namespace var namespace

    var body: some View {
        Image(pokemon.image)
            .matchedGeometryEffect(id: pokemon.id, in: namespace)
    }
}

struct PokemonDetail: View {
    @Namespace var namespace

    var body: some View {
        Image(pokemon.image)
            .matchedGeometryEffect(id: pokemon.id, in: namespace)
    }
}
```

A grande diferença: SwiftUI faz isso com animações implícitas de layout. View Transition API tira snapshots reais do DOM.

## Exercício prático

1. Navegue entre `/pokedex` e `/pokedex/1` — observe o push + morph
2. Abra `src/app/globals.css` linhas ~200-230 — CSS das animações
3. Compare com `src/components/directional-transition.tsx` — como o JS mapeia tipos → classes CSS
