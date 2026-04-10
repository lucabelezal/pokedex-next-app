import { FavoritesClient } from "@/components/favorites-client";
import { getAppConfig, getPokemonCatalog } from "@/lib/pokedex-service";

export const dynamic = "force-static";

export default function FavoritosPage() {
  const config = getAppConfig();
  const catalog = getPokemonCatalog();

  return <FavoritesClient config={config} catalog={catalog} />;
}
