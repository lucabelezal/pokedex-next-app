import { BackIcon } from "@/components/icons";
import Link from "next/link";
import type { ReactNode } from "react";

export function PageHeader({
  title,
  backHref,
  backLabel = "Voltar",
  rightSlot,
}: {
  title: string;
  backHref: string;
  backLabel?: string;
  rightSlot?: ReactNode;
}) {
  return (
    <header className="grid grid-cols-[40px_1fr_40px] items-center px-6 pt-[calc(12px+env(safe-area-inset-top))] pb-2">
      <Link
        href={backHref}
        className="flex h-10 w-10 items-center justify-center rounded-full text-[#1f2024]"
        aria-label={backLabel}
      >
        <BackIcon className="h-5 w-5 text-[#1f2024]" />
      </Link>
      <h1 className="text-center text-[24px] font-medium tracking-[-0.01em] text-[#1f2024]">
        {title}
      </h1>
      {rightSlot ?? <span aria-hidden="true" />}
    </header>
  );
}
