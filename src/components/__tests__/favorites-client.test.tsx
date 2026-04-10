// @vitest-environment jsdom

import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ImgHTMLAttributes, ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { FavoritesClient } from "@/components/favorites-client";
import type { AppConfig, PokemonCatalogItem } from "@/lib/pokedex-types";

vi.mock("next/image", () => ({
  default: (props: ImgHTMLAttributes<HTMLImageElement>) => {
    return <div role="img" aria-label={props.alt ?? ""} />;
  },
}));

vi.mock("@/components/tab-bar", () => ({
  TabBar: () => <div data-testid="tab-bar" />,
}));

vi.mock("@/components/swipe-to-delete", () => ({
  SwipeToDelete: ({ children, onDelete }: { children: ReactNode; onDelete: () => void }) => (
    <div>
      {children}
      <button onClick={onDelete}>Remover</button>
    </div>
  ),
}));

vi.mock("@/components/pokemon-card", () => ({
  PokemonCard: ({ pokemon }: { pokemon: PokemonCatalogItem }) => <div>{pokemon.name}</div>,
}));

const mockToggleFavorite = vi.fn();

vi.mock("@/hooks/use-favorites", () => ({
  useFavorites: () => mockUseFavoritesState(),
}));

let mockUseFavoritesState: () => {
  favoriteIds: number[];
  loading: boolean;
  error: string | null;
  toggleFavorite: (id: number) => void;
};

const configMock: AppConfig = {
  app: {
    name: "Pokedex",
    version: "1.0.0",
    locale: "pt-BR",
  },
  theme: {
    background: "#fff",
    surface: "#fff",
    text: "#000",
    mutedText: "#666",
    line: "#ddd",
    tabActive: "#1d4fd7",
    tabInactive: "#8f9094",
    heartActive: "#ff5f78",
  },
  texts: {
    favoritesTitle: "Favoritos",
    favoritesEmptyTitle: "Nenhum favorito",
    favoritesEmptyDescription: "Adicione itens para aparecer aqui.",
  },
};

const typeGrass = { key: "grass", label: "Grama", color: "#78C850", textColor: "#fff" };
const typeElectric = { key: "electric", label: "Elétrico", color: "#F8D030", textColor: "#000" };

const bulbasaurMock: PokemonCatalogItem = {
  id: 1,
  name: "Bulbasaur",
  slug: "bulbasaur",
  number: "001",
  image: "/bulbasaur.png",
  cardColor: "#78C850",
  heroColor: "#6abf40",
  region: "kanto",
  generation: 1,
  types: [typeGrass],
  description: "Semente.",
  weight: "6.9 kg",
  height: "0.7 m",
  category: "Seed",
  ability: "Overgrow",
  gender: { male: 87.5, female: 12.5 },
  weaknesses: [typeGrass],
  evolution: [],
};

const pikachuMock: PokemonCatalogItem = {
  id: 25,
  name: "Pikachu",
  slug: "pikachu",
  number: "025",
  image: "/pikachu.png",
  cardColor: "#F8D030",
  heroColor: "#e8c020",
  region: "kanto",
  generation: 1,
  types: [typeElectric],
  description: "Souris.",
  weight: "6 kg",
  height: "0.4 m",
  category: "Mouse",
  ability: "Static",
  gender: { male: 50, female: 50 },
  weaknesses: [typeGrass],
  evolution: [],
};

describe("FavoritesClient", () => {
  beforeEach(() => {
    mockToggleFavorite.mockReset();
  });

  afterEach(() => {
    cleanup();
  });

  it("should render error message when hook returns error", () => {
    mockUseFavoritesState = () => ({
      favoriteIds: [],
      loading: false,
      error: "Nao foi possivel carregar favoritos.",
      toggleFavorite: mockToggleFavorite,
    });

    render(<FavoritesClient config={configMock} catalog={[]} />);

    const alert = screen.getByRole("alert");
    expect(alert.textContent).toBe("Nao foi possivel carregar favoritos.");
  });

  it("should render empty state when there are no favorites", () => {
    mockUseFavoritesState = () => ({
      favoriteIds: [],
      loading: false,
      error: null,
      toggleFavorite: mockToggleFavorite,
    });

    render(<FavoritesClient config={configMock} catalog={[bulbasaurMock, pikachuMock]} />);

    expect(screen.getByText("Nenhum favorito")).toBeDefined();
    expect(screen.getByText("Adicione itens para aparecer aqui.")).toBeDefined();
  });

  it("should render only pokémons that are in favorites", () => {
    mockUseFavoritesState = () => ({
      favoriteIds: [25],
      loading: false,
      error: null,
      toggleFavorite: mockToggleFavorite,
    });

    render(<FavoritesClient config={configMock} catalog={[bulbasaurMock, pikachuMock]} />);

    expect(screen.getByText("Pikachu")).toBeDefined();
    expect(screen.queryByText("Bulbasaur")).toBeNull();
  });

  it("should call toggleFavorite with pokémon id when SwipeToDelete fires onDelete", async () => {
    mockUseFavoritesState = () => ({
      favoriteIds: [25],
      loading: false,
      error: null,
      toggleFavorite: mockToggleFavorite,
    });

    render(<FavoritesClient config={configMock} catalog={[pikachuMock]} />);

    await userEvent.click(screen.getByRole("button", { name: "Remover" }));

    expect(mockToggleFavorite).toHaveBeenCalledOnce();
    expect(mockToggleFavorite).toHaveBeenCalledWith(25);
  });
});
