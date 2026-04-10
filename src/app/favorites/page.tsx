import { FavoritesClient } from "@/components/favorites-client";
import { getAppConfig, getPokemonCatalog } from "@/lib/pokeapi-service";

export const dynamic = "force-static";

export default async function FavoritosPage() {
  const config = getAppConfig();
  const catalog = await getPokemonCatalog();

  return <FavoritesClient config={config} catalog={catalog} />;
}
