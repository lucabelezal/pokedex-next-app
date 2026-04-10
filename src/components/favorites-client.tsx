"use client";

import Image from "next/image";
import { useMemo } from "react";
import { PokemonCard } from "@/components/pokemon-card";
import { SwipeToDelete } from "@/components/swipe-to-delete";
import { TabBar } from "@/components/tab-bar";
import { useFavorites } from "@/hooks/use-favorites";
import type { AppConfig, PokemonCatalogItem } from "@/lib/pokedex-types";

type FavoritesClientProps = {
  config: AppConfig;
  catalog: PokemonCatalogItem[];
};

export function FavoritesClient({ config, catalog }: FavoritesClientProps) {
  const { favoriteIds, loading, error, toggleFavorite } = useFavorites();

  const favoritePokemons = useMemo(() => {
    return catalog.filter((pokemon) => favoriteIds.includes(pokemon.id));
  }, [catalog, favoriteIds]);

  return (
    <main className="mobile-shell flex flex-col bg-white">
      <header className="border-b border-[#d7d7d7] px-4 pb-5 pt-[calc(16px+env(safe-area-inset-top))]">
        <h1 className="text-[36px] font-black tracking-[-0.03em] text-[#222327]">{config.texts.favoritesTitle}</h1>
      </header>

      <section className="flex-1 px-4 pb-6 pt-6">
        {error ? (
          <p
            role="alert"
            className="mb-4 rounded-2xl border border-[#f3a2a2] bg-[#ffe9e9] px-4 py-3 text-sm font-semibold text-[#8b1f1f]"
          >
            {error}
          </p>
        ) : null}

        {loading ? (
          <p className="text-center text-lg font-semibold text-[#6d6e73]">Carregando...</p>
        ) : null}

        {!loading && favoritePokemons.length === 0 ? (
          <div className="flex flex-col items-center pt-10 text-center">
            <Image
              src="/assets/empty/magikarp-jump.svg"
              alt="Ilustracao de Magikarp"
              width={160}
              height={185}
              className="h-auto w-[160px]"
              priority
            />
            <h2 className="mt-5 text-[24px] font-black leading-[1.1] tracking-[-0.02em] text-[#2f3035]">
              {config.texts.favoritesEmptyTitle}
            </h2>
            <p className="mt-3 max-w-[280px] text-[16px] leading-[1.5] text-[#5f6066]">
              {config.texts.favoritesEmptyDescription}
            </p>
          </div>
        ) : null}

        {!loading && favoritePokemons.length > 0 ? (
          <div className="space-y-3">
            {favoritePokemons.map((pokemon) => (
              <SwipeToDelete key={pokemon.id} onDelete={() => toggleFavorite(pokemon.id)}>
                <PokemonCard
                  pokemon={pokemon}
                  favorite
                  onToggleFavorite={toggleFavorite}
                />
              </SwipeToDelete>
            ))}
          </div>
        ) : null}
      </section>

      <TabBar />
    </main>
  );
}
