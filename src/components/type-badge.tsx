import type { PokemonTypeTag } from "@/lib/pokedex-types";
import { TypeIcon } from "@/components/type-icon";

type TypeBadgeProps = {
  type: PokemonTypeTag;
};

export function TypeBadge({ type }: TypeBadgeProps) {
  return (
    <span
      className="inline-flex h-[26px] items-center gap-[4px] rounded-[48px] px-[8px] py-[4px] text-[12px] font-medium leading-4"
      style={{ backgroundColor: type.color, color: type.textColor }}
    >
      <span className="relative flex h-[20.31px] w-[20.31px] items-center justify-center rounded-full bg-white">
        <TypeIcon typeKey={type.key} className="h-[14px] w-[14px] object-contain" />
      </span>
      {type.label}
    </span>
  );
}
