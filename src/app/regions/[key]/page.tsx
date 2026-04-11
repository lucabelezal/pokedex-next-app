import { notFound } from "next/navigation";
import { PokedexListClient } from "@/components/pokedex-list-client";
import { DirectionalTransition } from "@/components/directional-transition";
import {
  getAppConfig,
  getAvailableTypeFilters,
  getPokemonByRegion,
  getRegionByKey,
  getRegionsCatalog,
} from "@/lib/pokeapi-service";

export const dynamic = "force-static";

export async function generateStaticParams() {
  const regions = getRegionsCatalog();
  return regions.map((region) => ({ key: region.key }));
}

type Params = {
  params: Promise<{ key: string }>;
};

export default async function RegionPokedexPage({ params }: Params) {
  const { key } = await params;
  const region = getRegionByKey(key);

  if (!region) {
    notFound();
  }

  const config = getAppConfig();
  const catalog = await getPokemonByRegion(key);
  const typeFilters = getAvailableTypeFilters();

  return (
    <DirectionalTransition>
      <PokedexListClient
        initialCatalog={catalog}
        typeFilters={typeFilters}
        config={config}
        title={region.name}
        backHref="/regions"
        defaultSort="number-asc"
      />
    </DirectionalTransition>
  );
}
