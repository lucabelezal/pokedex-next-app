# Context API e Providers

## O problema

Dados que precisam ser acessados por múltiplos componentes em diferentes partes da árvore:

```
App
├── PokedexPage
│   └── PokedexListClient  ← precisa de favoriteIds
├── FavoritesPage
│   └── FavoritesClient    ← precisa de favoriteIds
└── DetailPage
    └── DetailFavoriteToggle ← precisa de favoriteIds
```

Sem Context: cada componente chama `useFavorites()` → **3 fetches duplicados** para `/api/favorites`.

Com Context: Provider faz **1 fetch** → 3 componentes leem do mesmo estado.

## A solução do projeto

```tsx
// src/lib/favorites-context.tsx
"use client";

import { createContext, useContext } from "react";
import { useFavorites } from "@/hooks/use-favorites";

type FavoritesContextType = ReturnType<typeof useFavorites>;
const FavoritesContext = createContext<FavoritesContextType | null>(null);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const favorites = useFavorites();  // ⬅️ ÚNICO fetch
  return (
    <FavoritesContext.Provider value={favorites}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavoritesContext() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavoritesContext must be used within FavoritesProvider");
  }
  return context;
}
```

## Uso no layout

```tsx
// src/app/layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <FavoritesProvider>
          {children}  {/* todas as páginas têm acesso ao contexto */}
        </FavoritesProvider>
      </body>
    </html>
  );
}
```

## Uso nos componentes

```tsx
// src/components/pokedex-list-client.tsx
export function PokedexListClient({ initialCatalog, typeFilters, config }) {
  const { favoriteIds, toggleFavorite } = useFavoritesContext();
  // já está carregado pelo Provider, zero fetches extras
}

// src/components/detail-favorite-toggle.tsx
export function DetailFavoriteToggle({ id, name }) {
  const { favoriteIds, toggleFavorite } = useFavoritesContext();
  const favorite = favoriteIds.includes(id);
  // toggle aqui atualiza o contexto → PokedexListClient vê a mudança
}
```

## Antes vs Depois

| | Antes (sem context) | Depois (com context) |
|---|---|---|
| Fetches | 3 (um por consumidor) | 1 (no Provider) |
| Sincronização | Toggle no detail → lista desatualizada | Toggle no detail → lista atualizada instantâneo |
| Código duplicado | DetailFavoriteToggle: 78 linhas (fetch próprio) | DetailFavoriteToggle: 32 linhas (usa contexto) |

## Swift (SwiftUI)

```swift
// EnvironmentObject — mais próximo de Context
class FavoritesStore: ObservableObject {
    @Published var favoriteIds: [Int] = []
    // ...
}

// No App
@main
struct PokedexApp: App {
    @StateObject var favorites = FavoritesStore()

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(favorites)  // Provider
        }
    }
}

// Em qualquer View
struct PokemonCard: View {
    @EnvironmentObject var favorites: FavoritesStore  // useContext
}
```

## Quando usar Context

| Situação | Use Context |
|---|---|
| Dados usados por 3+ componentes em diferentes ramos | ✅ |
| Estado que precisa sincronizar entre páginas (favoritos) | ✅ |
| Dados que só 1-2 componentes usam | ❌ Use props |
| Estado local de formulário | ❌ Use useState |

## Provider no projeto

O projeto tem apenas um Context: `FavoritesProvider`. Isso é intencional — adicionar Context só quando há necessidade real de compartilhar estado.
