"use client";


import { useRouter } from "next/navigation";
import { startTransition } from "react";
import { addTransitionType } from "react";
import { BackIcon } from "@/components/icons";

type BackButtonProps = {
  className?: string;
  iconClassName?: string;
  "aria-label"?: string;
  transitionTypes?: string[];
};

export function BackButton({
  className,
  iconClassName,
  "aria-label": ariaLabel = "Voltar",
  transitionTypes,
}: BackButtonProps) {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => {
        startTransition(() => {
          addTransitionType("nav-back");
          router.push("/pokedex");
        });
      }}
      aria-label={ariaLabel}
      className={className}
      // @ts-expect-error — transitionTypes é prop de View Transition API (experimental)
      transitionTypes={transitionTypes}
    >
      <BackIcon className={iconClassName} />
    </button>
  );
}
