import { DirectionalTransition } from "@/components/directional-transition";
import { PokedexListClient } from "@/components/pokedex-list-client";
import { getAppConfig, getAvailableTypeFilters, getPokemonCatalog } from "@/lib/pokedex-service";

export const dynamic = "force-static";

export default function PokedexPage() {
  const config = getAppConfig();
  const catalog = getPokemonCatalog();
  const typeFilters = getAvailableTypeFilters();

  return (
    <DirectionalTransition>
      <PokedexListClient initialCatalog={catalog} typeFilters={typeFilters} config={config} />
    </DirectionalTransition>
  );
}
