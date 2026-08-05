import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DirectionalTransition } from "@/components/directional-transition";
import { DetailHero } from "@/components/detail-hero";
import { EvoCard, EvolutionArrow } from "@/components/evolution-card";
import { MetricCard, WeightIcon, HeightIcon, CategoryIcon, AbilityIcon, MaleIcon, FemaleIcon } from "@/components/metric-card";
import { TypeBadge } from "@/components/type-badge";
import { getAppConfig, getPokemonById, getStaticPokemonParams } from "@/lib/pokeapi-service";

const COLOR_MALE = "#2551C4";
const COLOR_FEMALE = "#FF7596";
const COLOR_EVOLUTION_LEVEL = "#173EA5";
const COLOR_EVOLUTION_BORDER = "#E6E6E6";

type Params = {
  params: Promise<{ id: string }>;
};

export async function generateStaticParams() {
  return getStaticPokemonParams();
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const resolved = await params;
  const pokemon = await getPokemonById(Number(resolved.id));

  if (!pokemon) {
    return {
      title: "Pokémon não encontrado",
    };
  }

  return {
    title: `${pokemon.name} | Pokédex`,
  };
}

export default async function PokemonDetailPage({ params }: Params) {
  const resolved = await params;
  const pokemon = await getPokemonById(Number(resolved.id));
  const config = getAppConfig();

  if (!pokemon) {
    notFound();
  }

  const evolutionWithColors = await Promise.all(
    pokemon.evolution.map(async (item) => {
      // Reutiliza o Pokémon já buscado quando é o próprio item da cadeia
      const evoData = item.id === pokemon.id ? pokemon : await getPokemonById(item.id);
      return {
        ...item,
        heroColor: evoData?.heroColor ?? pokemon.heroColor,
        types: evoData?.types ?? pokemon.types,
      };
    }),
  );

  return (
    <DirectionalTransition>
    <main className="mobile-shell flex flex-col bg-white">
      <div className="relative flex-1 bg-white">
        <DetailHero pokemon={pokemon} />

        <section className="rounded-t-[32px] bg-white px-4 pb-28 pt-[32px]">
        <h1
          className="text-[32px] font-bold leading-[48px] text-black"
          style={{ marginBottom: "-5px" }}
        >
          {pokemon.name}
        </h1>
        <p className="text-[16px] font-medium leading-[24px] text-black/70">
          {pokemon.number}
        </p>

        <div className="mt-3 flex flex-wrap gap-[8px]">
          {pokemon.types.map((type) => (
            <TypeBadge key={type.key} type={type} />
          ))}
        </div>

        <p className="mt-4 text-[14px] leading-[145%] text-black/70">
          {pokemon.description}
        </p>

        <div className="mt-5 border-t border-black/[0.05]" />

        <div className="mt-5 flex flex-col gap-5">
          <div className="flex gap-5">
            <MetricCard label={config.texts.weightLabel} icon={<WeightIcon />} value={pokemon.weight} />
            <MetricCard label={config.texts.heightLabel} icon={<HeightIcon />} value={pokemon.height} />
          </div>
          <div className="flex gap-5">
            <MetricCard label={config.texts.categoryLabel} icon={<CategoryIcon />} value={pokemon.category} />
            <MetricCard label={config.texts.abilityLabel} icon={<AbilityIcon />} value={pokemon.ability} />
          </div>
        </div>

        <div className="mt-5">
          <p className="text-center text-[12px] font-medium uppercase tracking-[0.05em] text-black/70">
            {config.texts.genderLabel}
          </p>
          <div
            className="mt-3 h-2 overflow-hidden rounded-full"
            style={{ backgroundColor: COLOR_MALE }}
          >
            <div
              className="ml-auto h-full rounded-r-full"
              style={{
                width: `${pokemon.gender.female}%`,
                backgroundColor: COLOR_FEMALE,
              }}
            />
          </div>
          <div className="mt-1.5 flex items-center justify-between">
            <span className="flex items-center gap-[4px] text-[12px] font-medium uppercase text-black/70">
              <MaleIcon />
              {pokemon.gender.male}%
            </span>
            <span className="flex items-center gap-[4px] text-[12px] font-medium uppercase text-black/70">
              <FemaleIcon />
              {pokemon.gender.female}%
            </span>
          </div>
        </div>

        <section className="mt-6">
          <h2 className="text-[18px] font-bold leading-[27px] text-black">
            {config.texts.weaknessesLabel}
          </h2>
          <div className="mt-3 grid grid-cols-2 gap-3">
            {pokemon.weaknesses.map((type) => (
              <TypeBadge key={type.key} type={type} wide />
            ))}
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-[18px] font-bold leading-[27px] text-black">
            {config.texts.evolutionsLabel}
          </h2>
          <div className="mt-2 rounded-[16px] border px-4 py-6" style={{ borderColor: COLOR_EVOLUTION_BORDER }}>
            <div className="flex flex-col items-center gap-2">
              {evolutionWithColors.map((item, index) => (
                <div key={item.id} className="w-full">
                  {index > 0 && (
                    <div className="my-2 flex items-center justify-center gap-2">
                      <EvolutionArrow />
                      {item.level && (
                        <span className="text-[14px] font-medium" style={{ color: COLOR_EVOLUTION_LEVEL }}>
                          {item.level}
                        </span>
                      )}
                    </div>
                  )}
                  <EvoCard item={item} />
                </div>
              ))}
            </div>
          </div>
        </section>
        </section>
      </div>

      {/* <TabBar /> Removido na tela de detalhe para esconder a bottom bar */}
    </main>
    </DirectionalTransition>
  );
}

