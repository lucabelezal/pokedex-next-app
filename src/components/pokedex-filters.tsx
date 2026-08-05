"use client";

import { ChevronDownIcon, SearchIcon } from "@/components/icons";
import type { PokedexTypeFilter } from "@/hooks/use-pokedex-filters";
import type { SortKey } from "@/lib/pokedex-types";

type PokedexFiltersProps = {
  query: string;
  onQueryChange: (value: string) => void;
  type: string;
  onTypeChange: (value: string) => void;
  sort: SortKey;
  onSortChange: (value: SortKey) => void;
  typeFilters: PokedexTypeFilter[];
  selectedTypeColor: string;
  texts: Record<string, string>;
};

export function PokedexFilters({
  query,
  onQueryChange,
  type,
  onTypeChange,
  sort,
  onSortChange,
  typeFilters,
  selectedTypeColor,
  texts,
}: PokedexFiltersProps) {
  return (
    <>
      <label className="relative block">
        <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#666666]" />
        <input
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder={texts.searchPlaceholder}
          className="h-12 w-full rounded-[32px] border-[1.5px] border-[#cccccc] bg-white pl-12 pr-4 text-[14px] font-normal leading-[21px] text-[#333333] outline-none placeholder:text-[#999999]"
          autoComplete="off"
        />
      </label>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <label className="relative block">
          <select
            value={type}
            onChange={(event) => onTypeChange(event.target.value)}
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
            onChange={(event) => onSortChange(event.target.value as SortKey)}
            className="h-[42px] w-full appearance-none rounded-[48px] bg-[#333333] px-4 pr-9 text-[14px] font-semibold leading-[21px] text-white outline-none"
          >
            <option value="az">{texts.sortAzLabel}</option>
            <option value="za">{texts.sortZaLabel}</option>
            <option value="number-asc">{texts.sortNumberAscLabel}</option>
            <option value="number-desc">{texts.sortNumberDescLabel}</option>
          </select>
          <ChevronDownIcon className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white" />
        </label>
      </div>
    </>
  );
}
