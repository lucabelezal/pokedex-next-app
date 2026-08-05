import Image from "next/image";
import { ViewTransition } from "react";
import { BackButton } from "@/components/back-button";
import { DetailFavoriteToggle } from "@/components/detail-favorite-toggle";
import { ElementoOutline } from "@/components/elemento-outline";
import type { PokemonCatalogItem } from "@/lib/pokedex-types";

function getBlurDataURL(color: string): string {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='4' height='4'><rect width='4' height='4' fill='${color}'/></svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}

type DetailHeroProps = {
  pokemon: PokemonCatalogItem;
};

export function DetailHero({ pokemon }: DetailHeroProps) {
  return (
    <section
      className="relative overflow-hidden bg-white"
      style={{ height: "calc(304px + env(safe-area-inset-top))" }}
    >
      <div
        className="absolute rounded-full w-[498px] h-[498px] left-1/2 -top-[194px] -translate-x-1/2"
        style={{ backgroundColor: pokemon.heroColor }}
      />

      <div className="absolute w-[204px] h-[204px] left-1/2 top-[35px] -translate-x-1/2 z-0">
        <ElementoOutline typeKey={pokemon.types[0]?.key} className="h-full w-full" />
      </div>

      <div
        className="absolute left-4 right-4 flex items-center justify-between"
        style={{ top: "calc(19px + env(safe-area-inset-top))" }}
      >
        <BackButton
          aria-label="Voltar para a lista"
          className="ios-liquid-btn flex h-10 w-10 items-center justify-center rounded-full text-white transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
          iconClassName="h-5 w-5"
          transitionTypes={["nav-back"]}
        />
        <DetailFavoriteToggle id={pokemon.id} name={pokemon.name} />
      </div>

      <ViewTransition name={`pokemon-img-${pokemon.id}`} share="morph">
        <Image
          src={pokemon.image}
          alt={pokemon.name}
          width={224}
          height={224}
          className="absolute z-10 object-contain w-[224px] h-[224px] left-1/2 top-[calc(192px+env(safe-area-inset-top))] -translate-x-1/2 -translate-y-1/2"
          placeholder="blur"
          blurDataURL={getBlurDataURL(pokemon.heroColor)}
          priority
        />
      </ViewTransition>
    </section>
  );
}
