import { Suspense } from "react";
import { DirectionalTransition } from "@/components/directional-transition";
import { PokedexListClient } from "@/components/pokedex-list-client";
import { getAppConfig, getAvailableTypeFilters, getPokemonCatalog } from "@/lib/pokeapi-service";

export const dynamic = "force-static";

export default async function PokedexPage() {
  const config = getAppConfig();
  const catalog = await getPokemonCatalog();
  const typeFilters = getAvailableTypeFilters();

  return (
    <DirectionalTransition>
      <Suspense>
        <PokedexListClient initialCatalog={catalog} typeFilters={typeFilters} config={config} />
      </Suspense>
    </DirectionalTransition>
  );
}
