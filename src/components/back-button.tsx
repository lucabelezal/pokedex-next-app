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
          if (typeof window !== "undefined" && window.history.length > 1) {
            router.back();
          } else {
            router.push("/pokedex");
          }
        });
      }}
      aria-label={ariaLabel}
      className={className}
    >
      <BackIcon className={iconClassName} />
    </button>
  );
}
