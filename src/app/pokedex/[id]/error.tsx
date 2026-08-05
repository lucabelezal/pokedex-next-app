"use client";

import Link from "next/link";

export default function Error({
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <main className="mobile-shell flex min-h-full flex-col items-center justify-center bg-white px-6 text-center">
      <p className="text-[64px]">😵</p>
      <h1 className="mt-4 text-[24px] font-bold text-[#1f2024]">
        Algo deu errado
      </h1>
      <p className="mt-2 text-[16px] text-[#6d6e73]">
        Não foi possível carregar este Pokémon. Tente novamente.
      </p>
      <div className="mt-6 flex gap-3">
        <button
          onClick={reset}
          className="rounded-full bg-[#1d4fd7] px-6 py-3 text-[14px] font-semibold text-white"
        >
          Tentar novamente
        </button>
        <Link
          href="/pokedex"
          className="rounded-full border border-[#d0d2d8] px-6 py-3 text-[14px] font-semibold text-[#1f2024]"
        >
          Voltar para Pokédex
        </Link>
      </div>
    </main>
  );
}
