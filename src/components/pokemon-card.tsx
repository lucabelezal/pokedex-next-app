"use client";

import Image from "next/image";
import Link from "next/link";
import { memo } from "react";
import { HeartIcon } from "@/components/icons";
import { ElementoOutline } from "@/components/elemento-outline";
import { TypeBadge } from "@/components/type-badge";
import type { PokemonCatalogItem } from "@/lib/pokedex-types";

type PokemonCardProps = {
  pokemon: PokemonCatalogItem;
  favorite: boolean;
  onToggleFavorite: (id: number) => void;
};

export const PokemonCard = memo(function PokemonCard({
  pokemon,
  favorite,
  onToggleFavorite,
}: PokemonCardProps) {
  return (
    <article className="relative min-h-[136px] overflow-hidden rounded-[16px]" style={{ backgroundColor: pokemon.cardColor }}>
      {/* Link cobre o card inteiro — botão de favorito fica acima com z-20 */}
      <Link
        href={`/pokedex/${pokemon.id}`}
        className="absolute inset-0 z-10"
        aria-label={`Ver detalhes de ${pokemon.name}`}
        transitionTypes={["nav-forward"]}
      />

      <div className="flex min-h-[136px]">
        <div className="pointer-events-none flex min-w-0 flex-1 flex-col justify-start gap-1 px-4 pb-3 pt-3 pr-4">
          <p className="text-[12px] font-semibold leading-[18px] text-[#333333]">{pokemon.number}</p>
          <h3 className="text-[20px] font-semibold leading-[28px] text-[#000000]">{pokemon.name}</h3>
          <div className="mt-1 flex flex-wrap gap-1">
            {pokemon.types.map((type) => (
              <TypeBadge key={type.key} type={type} />
            ))}
          </div>
        </div>

        <div className="relative w-[126px] flex-shrink-0" style={{ backgroundColor: pokemon.heroColor }}>
          <ElementoOutline typeKey={pokemon.types[0]?.key} className="absolute left-1/2 top-1/2 h-[116px] w-[116px] -translate-x-1/2 -translate-y-1/2" />

          <Image
            src={pokemon.image}
            alt={pokemon.name}
            width={64}
            height={64}
            className="absolute left-1/2 top-1/2 h-[64px] w-[64px] -translate-x-1/2 -translate-y-1/2 object-contain drop-shadow-sm"
            priority={pokemon.id <= 9}
            style={{ viewTransitionName: `pokemon-img-${pokemon.id}` }}
          />

          <div className="absolute right-[8px] top-[8px] z-20">
            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-full border-[1.5px] border-white bg-black/30 text-white backdrop-blur-[3.5px]"
              onClick={() => onToggleFavorite(pokemon.id)}
              aria-label={favorite ? `Remover ${pokemon.name} dos favoritos` : `Favoritar ${pokemon.name}`}
            >
              <HeartIcon className="h-4 w-4" filled={favorite} />
            </button>
          </div>
        </div>
      </div>

    </article>
  );
});

