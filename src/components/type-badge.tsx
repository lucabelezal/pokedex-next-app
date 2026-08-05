import type { PokemonTypeTag } from "@/lib/pokedex-types";
import { TypeIcon } from "@/components/type-icon";

type TypeBadgeProps = {
  type: PokemonTypeTag;
  wide?: boolean;
};

export function TypeBadge({ type, wide = false }: TypeBadgeProps) {
  return (
    <span
      className={`${wide ? "flex justify-center" : "inline-flex"} h-[${wide ? "36px" : "26px"}] items-center gap-[4px] rounded-[48px] px-[${wide ? "16px" : "8px"}] py-[4px] text-[12px] font-medium leading-4`}
      style={{ backgroundColor: type.color, color: type.textColor }}
    >
      <span className={`relative flex ${wide ? "h-7 w-7" : "h-[20.31px] w-[20.31px]"} flex-shrink-0 items-center justify-center rounded-full bg-white`}>
        <TypeIcon typeKey={type.key} className={wide ? "h-[17px] w-[17px]" : "h-[14px] w-[14px]"} />
      </span>
      {type.label}
    </span>
  );
}
