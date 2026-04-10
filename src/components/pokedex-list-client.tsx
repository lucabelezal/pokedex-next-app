"use client";

import Link from "next/link";
import { BackIcon, ChevronDownIcon, SearchIcon } from "@/components/icons";
import { PokemonCard } from "@/components/pokemon-card";
import { TabBar } from "@/components/tab-bar";
import { useFavorites } from "@/hooks/use-favorites";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import { usePokedexFilters } from "@/hooks/use-pokedex-filters";
import type { AppConfig, PokemonCatalogItem, SortKey } from "@/lib/pokedex-types";

type TypeFilter = {
  key: string;
  label: string;
  color: string;
};

type PokedexListClientProps = {
  initialCatalog: PokemonCatalogItem[];
  typeFilters: TypeFilter[];
  config: AppConfig;
  title?: string;
  backHref?: string;
  defaultSort?: SortKey;
};

export function PokedexListClient({ initialCatalog, typeFilters, config, title, backHref, defaultSort = "az" }: PokedexListClientProps) {
  const { favoriteIds, toggleFavorite } = useFavorites();
  const {
    query,
    setQuery,
    type,
    setType,
    sort,
    setSort,
    parseSortKey,
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
        <label className="relative block">
          <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#666666]" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={config.texts.searchPlaceholder}
            className="h-12 w-full rounded-[32px] border-[1.5px] border-[#cccccc] bg-white pl-12 pr-4 text-[14px] font-normal leading-[21px] text-[#333333] outline-none placeholder:text-[#999999]"
            autoComplete="off"
          />
        </label>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <label className="relative block">
            <select
              value={type}
              onChange={(event) => setType(event.target.value)}
              className="h-[42px] w-full appearance-none rounded-[48px] px-4 pr-9 text-[14px] font-semibold leading-[21px] text-white outline-none transition-colors"
              style={{ backgroundColor: selectedTypeColor || "#333333" }}
            >
              {typeFilters.map((option) => (
                <option key={option.key} value={option.key}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDownIcon className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white" />
          </label>

          <label className="relative block">
            <select
              value={sort}
              onChange={(event) => setSort(parseSortKey(event.target.value))}
              className="h-[42px] w-full appearance-none rounded-[48px] bg-[#333333] px-4 pr-9 text-[14px] font-semibold leading-[21px] text-white outline-none"
            >
              <option value="az">{config.texts.sortAzLabel}</option>
              <option value="za">{config.texts.sortZaLabel}</option>
              <option value="number-asc">{config.texts.sortNumberAscLabel}</option>
              <option value="number-desc">{config.texts.sortNumberDescLabel}</option>
            </select>
            <ChevronDownIcon className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white" />
          </label>
        </div>
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
