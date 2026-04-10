import Image from "next/image";
import { ElementoOutline } from "@/components/elemento-outline";
import type { PokemonTypeTag } from "@/lib/pokedex-types";

export type EvoItem = {
  id: number;
  name: string;
  number: string;
  image: string;
  level: string | null;
  heroColor: string;
  types: PokemonTypeTag[];
};

export function EvolutionArrow() {
  return (
    <svg width="16" height="28" viewBox="0 0 16 28" fill="none" aria-hidden="true">
      <path
        d="M8.63419 26.8291C8.23441 27.3085 7.49801 27.3085 7.09823 26.8291L0.234326 18.5988C-0.308808 17.9476 0.15429 16.9583 1.00231 16.9583L2.8568 16.9583C3.40885 16.9583 3.85647 16.511 3.8568 15.9589L3.86562 0.999413C3.86595 0.44736 4.31357 2.78749e-06 4.86562 2.83267e-06L10.8662 3.32371e-06C11.4185 3.3689e-06 11.8662 0.447717 11.8662 1L11.8662 15.9583C11.8662 16.5106 12.3139 16.9583 12.8662 16.9583L14.7301 16.9583C15.5781 16.9583 16.0412 17.9476 15.4981 18.5988L8.63419 26.8291Z"
        fill="#173EA5"
      />
    </svg>
  );
}

function TypePillEvo({ type }: { type: PokemonTypeTag }) {
  return (
    <div
      className="flex h-[13px] w-[68px] items-center justify-center rounded-[24px]"
      style={{ backgroundColor: type.color }}
    >
      <ElementoOutline typeKey={type.key} className="h-[10px] w-[10px]" />
    </div>
  );
}

export function EvoCard({ item }: { item: EvoItem }) {
  return (
    <div className="relative h-[76px] overflow-hidden rounded-[64px] border border-[#E6E6E6]">
      <div
        className="absolute"
        style={{ width: "96px", height: "74px", left: 0, top: "1px" }}
      >
        <div
          className="absolute rounded-[64px]"
          style={{
            width: "95px",
            height: "74px",
            left: "1px",
            top: 0,
            backgroundColor: item.heroColor,
          }}
        />
        <div
          className="absolute"
          style={{ width: "65px", height: "65px", left: "15px", top: "4px" }}
        >
          <ElementoOutline typeKey={item.types[0]?.key} className="h-full w-full" />
        </div>
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-contain"
        />
      </div>

      <div
        className="absolute flex flex-col gap-[4px]"
        style={{ left: "108px", top: "10px" }}
      >
        <div>
          <p
            className="text-[16px] font-medium leading-[24px] text-[#1A1A1A]"
            style={{ marginTop: "-2px" }}
          >
            {item.name}
          </p>
          <p className="text-[12px] font-medium leading-[18px] text-[#4D4D4D]">
            {item.number}
          </p>
        </div>
        <div className="flex gap-1">
          {item.types.map((type) => (
            <TypePillEvo key={type.key} type={type} />
          ))}
        </div>
      </div>
    </div>
  );
}
