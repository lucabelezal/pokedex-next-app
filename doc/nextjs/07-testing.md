# Testes no Projeto

## Stack

- **Vitest** — test runner (equivalente ao Jest, mas mais rápido e compatível com ESM)
- **Testing Library** — renderização e interação com componentes
- **jsdom** — simula o browser DOM em Node.js
- **MSW** — mock de API (não usado ainda, mas disponível)

## Estrutura

Testes co-localizados com o código que testam:

```
src/
├── lib/
│   └── __tests__/
│       ├── favorites-store.test.ts       ← 5 testes (localStorage)
│       ├── runtime-validators.test.ts    ← 8 testes (validators)
│       ├── type-metadata.test.ts         ← 6 testes (18 tipos)
│       └── pokeapi-mappers.test.ts       ← 10 testes (mapToCatalogItem)
├── hooks/
│   └── __tests__/
│       ├── use-favorites.test.ts         ← 3 testes (hook + fetch)
│       └── use-pokedex-filters.test.ts   ← 13 testes (sort/filter)
├── components/
│   └── __tests__/
│       └── favorites-client.test.tsx     ← 4 testes (UI + interação)
└── app/
    └── api/
        └── favorites/
            ├── __tests__/
            │   └── route.test.ts         ← 3 testes (GET/POST)
            └── [id]/
                └── __tests__/
                    └── route.test.ts     ← 2 testes (DELETE)
```

## Como escrever um teste

### Teste de função pura

```ts
// src/lib/__tests__/type-metadata.test.ts
import { describe, expect, it } from "vitest";
import { getTypeMetadata } from "@/lib/type-metadata";

describe("getTypeMetadata", () => {
  it("should return metadata for all 18 types", () => {
    const types = ["bug", "dark", "dragon", /* ... */];
    for (const key of types) {
      const meta = getTypeMetadata(key);
      expect(meta.key).toBe(key);
      expect(meta.color).toMatch(/^#[0-9a-fA-F]{6}$/);
    }
  });

  it("should return normal type as fallback for unknown key", () => {
    const meta = getTypeMetadata("nonexistent");
    expect(meta.key).toBe("normal");
  });
});
```

**Swift:**
```swift
func testGetTypeMetadata() throws {
    let meta = getTypeMetadata(key: "fire")
    XCTAssertEqual(meta.key, "fire")
}
```

### Teste de hook

```ts
// src/hooks/__tests__/use-favorites.test.ts
import { renderHook, waitFor } from "@testing-library/react";

it("should load favorites on mount", async () => {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ ids: [1, 25] }),
  }));

  const { result } = renderHook(() => useFavorites());

  await waitFor(() => {
    expect(result.current.loading).toBe(false);
  });

  expect(result.current.favoriteIds).toEqual([1, 25]);
});
```

### Teste de componente

```ts
// src/components/__tests__/favorites-client.test.tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

it("should render only pokémons that are in favorites", () => {
  render(<FavoritesClient config={configMock} catalog={[bulbasaur, pikachu]} />);

  expect(screen.getByText("Pikachu")).toBeDefined();
  expect(screen.queryByText("Bulbasaur")).toBeNull();
});
```

## Mocking

### Mock de módulo

```ts
vi.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(),
  useRouter: () => ({ replace: vi.fn() }),
}));
```

### Mock de componente

```ts
vi.mock("@/components/pokemon-card", () => ({
  PokemonCard: ({ pokemon }: { pokemon: PokemonCatalogItem }) => (
    <div>{pokemon.name}</div>
  ),
}));
```

### Mock de fetch

```ts
const fetchMock = vi.fn().mockResolvedValue({
  ok: true,
  json: async () => ({ ids: [1, 25] }),
});
vi.stubGlobal("fetch", fetchMock);
```

## Configuração

```ts
// vitest.config.ts
export default defineConfig({
  test: {
    environment: "jsdom",
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
    setupFiles: ["src/setupTests.ts"],
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
});
```

## Comandos

```bash
npm run test           # roda todos os testes (54)
npm run test:watch     # watch mode
npm run test:coverage  # relatório de cobertura
```

## Swift (XCTest)

```swift
// XCTest é mais verboso mas similar em conceito
final class PokemonMappersTests: XCTestCase {
    func testMapToCatalogItem() throws {
        let item = mapToCatalogItem(pokemon: bulbasaur, species: species, ...)
        XCTAssertEqual(item.name, "Bulbassauro")
        XCTAssertEqual(item.id, 1)
    }
}
```

## Exercício prático

1. Rode `npm run test` — veja todos os 54 testes passando
2. Abra `src/lib/__tests__/pokeapi-mappers.test.ts` — veja como mockamos dados da API
3. Adicione um teste para `PokemonGender` no `pokeapi-mappers.test.ts`: gender_rate -1 → male: 0, female: 0
