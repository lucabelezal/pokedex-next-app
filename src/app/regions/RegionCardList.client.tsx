"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { startTransition } from "react";
import { addTransitionType } from "react";

type Region = {
  key: string;
  name: string;
  generation: string;
  color: string;
  starterIds: number[];
  starters: { id: number; name: string; image: string }[];
};

type Props = {
  regions: Region[];
};

export function RegionCardList({ regions }: Props) {
  const router = useRouter();
  return (
    <div className="space-y-3">
      {regions.map((region) => (
        <button
          key={region.key}
          type="button"
          className="relative block h-[110px] w-full overflow-hidden rounded-[24px] text-left"
          onClick={() => {
            startTransition(() => {
              addTransitionType("nav-forward");
              router.push(`/regions/${region.key}`);
            });
          }}
        >
          <div
            className="absolute inset-0"
            style={{ backgroundColor: region.color }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/25 to-transparent" />

          <div className="relative flex h-full items-end justify-between px-5 pb-1">
            <div className="flex flex-col justify-center pb-2">
              <p className="text-[12px] font-bold uppercase tracking-[0.12em] text-white/70">
                {region.generation}
              </p>
              <h2 className="text-[28px] font-black leading-[1.1] tracking-[-0.02em] text-white">
                {region.name}
              </h2>
            </div>

            {region.starters.length > 0 && (
              <div className="flex items-end gap-0">
                {region.starters.map((pokemon) => (
                  <Image
                    key={pokemon.id}
                    src={pokemon.image}
                    alt={pokemon.name}
                    width={56}
                    height={56}
                    className="h-[56px] w-[56px] object-contain drop-shadow-md"
                  />
                ))}
              </div>
            )}
          </div>
        </button>
      ))}
    </div>
  );
}
