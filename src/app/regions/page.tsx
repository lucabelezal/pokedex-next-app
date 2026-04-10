import Image from "next/image";
import Link from "next/link";
import { TabBar } from "@/components/tab-bar";
import { getAppConfig, getPokemonCatalog, getRegionsCatalog } from "@/lib/pokedex-service";

export const dynamic = "force-static";

export default function RegioesPage() {
  const config = getAppConfig();
  const regions = getRegionsCatalog();
  const catalog = getPokemonCatalog();

  return (
    <main className="mobile-shell flex flex-col bg-white">
      <header className="border-b border-[#d7d7d7] px-4 pb-5 pt-[calc(16px+env(safe-area-inset-top))]">
        <h1 className="text-[36px] font-black tracking-[-0.03em] text-[#222327]">{config.texts.regionsTitle}</h1>
      </header>

      <section className="flex-1 overflow-y-auto px-4 pb-6 pt-4">
        <div className="space-y-3">
          {regions.map((region) => {
            const starters = region.starterIds
              .map((id) => catalog.find((pokemon) => pokemon.id === id))
              .filter((pokemon): pokemon is (typeof catalog)[number] => pokemon !== undefined);

            return (
              <Link
                key={region.key}
                href={`/regions/${region.key}`}
                className="relative block h-[110px] overflow-hidden rounded-[24px]"
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

                  {starters.length > 0 && (
                    <div className="flex items-end gap-0">
                      {starters.map((pokemon) => (
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
              </Link>
            );
          })}
        </div>
      </section>

      <TabBar />
    </main>
  );
}
