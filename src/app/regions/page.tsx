import { RegionCardList } from "./RegionCardList.client";
import { TabBar } from "@/components/tab-bar";
import { getAppConfig, getPokemonCatalog, getRegionsCatalog } from "@/lib/pokeapi-service";

export const dynamic = "force-static";

export default async function RegioesPage() {
  const config = getAppConfig();
  const regions = getRegionsCatalog();
  const catalog = await getPokemonCatalog();

  return (
    <main className="mobile-shell flex flex-col bg-white">
      <header className="border-b border-[#d7d7d7] px-4 pb-5 pt-[calc(16px+env(safe-area-inset-top))]">
        <h1 className="text-[36px] font-black tracking-[-0.03em] text-[#222327]">{config.texts.regionsTitle}</h1>
      </header>

      <section className="flex-1 overflow-y-auto px-4 pb-6 pt-4">
        <RegionCardList regions={regions.map(region => ({
          ...region,
          starters: region.starterIds
            .map((id) => catalog.find((pokemon) => pokemon.id === id))
            .filter((pokemon) => pokemon !== undefined)
        }))} />
      </section>

      <TabBar />
    </main>
  );
}
