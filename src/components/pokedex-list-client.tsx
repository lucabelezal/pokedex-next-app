"use client";

import Link from "next/link";
import { BackIcon } from "@/components/icons";
import { PokedexFilters } from "@/components/pokedex-filters";
import { PokemonCard } from "@/components/pokemon-card";
import { TabBar } from "@/components/tab-bar";
import { useFavoritesContext } from "@/lib/favorites-context";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import { usePokedexFilters } from "@/hooks/use-pokedex-filters";
import type { PokedexTypeFilter } from "@/hooks/use-pokedex-filters";
import type { AppConfig, PokemonCatalogItem, SortKey } from "@/lib/pokedex-types";

type PokedexListClientProps = {
  initialCatalog: PokemonCatalogItem[];
  typeFilters: PokedexTypeFilter[];
  config: AppConfig;
  title?: string;
  backHref?: string;
  defaultSort?: SortKey;
};

export function PokedexListClient({ initialCatalog, typeFilters, config, title, backHref, defaultSort = "az" }: PokedexListClientProps) {
  const { favoriteIds, toggleFavorite } = useFavoritesContext();
  const {
    query,
    setQuery,
    type,
    setType,
    sort,
    setSort,
    selectedTypeColor,
    filtered,
  } = usePokedexFilters({
    initialCatalog,
    typeFilters,
    defaultSort,
  });

  const { visibleItems, hasMore, sentinelRef } = useInfiniteScroll(filtered);

  return (
    <main className="mobile-shell bg-white shadow-[0_4px_4px_rgba(0,0,0,0.25)]">
      <section className="border-b border-[#f2f2f2] px-4 pb-6 pt-[calc(14px+env(safe-area-inset-top))]">
        {title && backHref && (
          <div className="mb-4 flex items-center gap-3">
            <Link
              href={backHref}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f2f3f5]"
              aria-label="Voltar"
            >
              <BackIcon className="h-5 w-5 text-[#1f2024]" />
            </Link>
            <h1 className="text-[24px] font-black tracking-[-0.02em] text-[#1f2024]">{title}</h1>
          </div>
        )}
        <PokedexFilters
          query={query}
          onQueryChange={setQuery}
          type={type}
          onTypeChange={setType}
          sort={sort}
          onSortChange={setSort}
          typeFilters={typeFilters}
          selectedTypeColor={selectedTypeColor}
          texts={config.texts}
        />
      </section>

      <section className="space-y-3 px-4 pb-[calc(22px+env(safe-area-inset-bottom))] pt-4">
        {visibleItems.map((pokemon) => (
          <PokemonCard
            key={pokemon.id}
            pokemon={pokemon}
            favorite={favoriteIds.includes(pokemon.id)}
            onToggleFavorite={toggleFavorite}
          />
        ))}

        {hasMore && (
          <div ref={sentinelRef} className="flex items-center justify-center py-6" aria-hidden="true">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#cccccc] border-t-[#333333]" />
          </div>
        )}

        {!hasMore && filtered.length > 0 && (
          <p className="py-6 text-center text-[13px] text-[#999999]">
            Você viu todos os Pokémon
          </p>
        )}
      </section>

      <TabBar />
    </main>
  );
}
