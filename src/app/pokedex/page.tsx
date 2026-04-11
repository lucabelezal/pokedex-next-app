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
      <PokedexListClient initialCatalog={catalog} typeFilters={typeFilters} config={config} />
    </DirectionalTransition>
  );
}
