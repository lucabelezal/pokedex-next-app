"use client";


import { useRouter } from "next/navigation";
import { startTransition, useCallback } from "react";
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

  const handleClick = useCallback(() => {
    startTransition(() => {
      if (transitionTypes) {
        for (const t of transitionTypes) {
          addTransitionType(t);
        }
      }
      if (typeof window !== "undefined" && window.history.length > 1) {
        const prev = sessionStorage.getItem("prev-route");
        if (prev) {
          sessionStorage.removeItem("prev-route");
          router.push(prev);
          return;
        }
        router.push("/pokedex");
        return;
      }
      router.push("/pokedex");
    });
  }, [router, transitionTypes]);

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={ariaLabel}
      className={className}
    >
      <BackIcon className={iconClassName} />
    </button>
  );
}
