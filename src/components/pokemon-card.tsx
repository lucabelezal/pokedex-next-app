"use client";

import Image from "next/image";
import Link from "next/link";
import { HeartIcon } from "@/components/icons";
import { ElementoOutline } from "@/components/elemento-outline";
import { TypeBadge } from "@/components/type-badge";
import type { PokemonCatalogItem } from "@/lib/pokedex-types";

type PokemonCardProps = {
  pokemon: PokemonCatalogItem;
  favorite: boolean;
  onToggleFavorite: (id: number) => void;
  showDeleteAction?: boolean;
};

export function PokemonCard({
  pokemon,
  favorite,
  onToggleFavorite,
  showDeleteAction = false,
}: PokemonCardProps) {
  return (
    <article className="relative h-[102px] overflow-hidden rounded-[15px]" style={{ backgroundColor: pokemon.cardColor }}>
      {/* Link cobre o card inteiro — botão de favorito fica acima com z-20 */}
      <Link
        href={`/pokedex/${pokemon.id}`}
        className="absolute inset-0 z-10"
        aria-label={`Ver detalhes de ${pokemon.name}`}
      />

      <div className="absolute inset-y-0 right-0 w-[126px]" style={{ backgroundColor: pokemon.heroColor }}>
        <ElementoOutline typeKey={pokemon.types[0]?.key} className="absolute left-1/2 top-1/2 h-[116px] w-[116px] -translate-x-1/2 -translate-y-1/2" />

        <Image
          src={pokemon.image}
          alt={pokemon.name}
          width={64}
          height={64}
          className="absolute left-1/2 top-1/2 h-[64px] w-[64px] -translate-x-1/2 -translate-y-1/2 object-contain drop-shadow-sm"
          priority={pokemon.id <= 9}
        />

        <div className="absolute right-[6px] top-[6px] z-20">
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

      <div className="absolute left-4 top-3 flex h-[78px] max-w-[176px] flex-col justify-center gap-1 pointer-events-none">
        <p className="text-[12px] font-semibold leading-[18px] text-[#333333]">{pokemon.number}</p>
        <h3 className="text-[21px] font-semibold leading-[32px] text-[#000000]">{pokemon.name}</h3>
        <div className="mt-0.5 flex flex-wrap gap-1">
          {pokemon.types.map((type) => (
            <TypeBadge key={type.key} type={type} />
          ))}
        </div>
      </div>

      {showDeleteAction && (
        <div className="absolute inset-y-0 right-0 flex w-[102px] items-center justify-center bg-[#dd2f33]">
          <button
            type="button"
            className="rounded-xl border border-white/30 px-4 py-3 text-sm font-semibold text-white"
            onClick={() => onToggleFavorite(pokemon.id)}
            aria-label={`Remover ${pokemon.name} dos favoritos`}
          >
            Remover
          </button>
        </div>
      )}
    </article>
  );
}


