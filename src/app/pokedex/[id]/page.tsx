import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BackIcon } from "@/components/icons";
import { DetailFavoriteToggle } from "@/components/detail-favorite-toggle";
import { ElementoOutline } from "@/components/elemento-outline";
import { TabBar } from "@/components/tab-bar";
import { TypeIcon } from "@/components/type-icon";
import { getAppConfig, getPokemonById, getStaticPokemonParams } from "@/lib/pokedex-service";
import type { PokemonTypeTag } from "@/lib/pokedex-types";

type Params = {
  params: Promise<{ id: string }>;
};

export async function generateStaticParams() {
  return getStaticPokemonParams();
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const resolved = await params;
  const pokemon = getPokemonById(Number(resolved.id));

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
  const pokemon = getPokemonById(Number(resolved.id));
  const config = getAppConfig();

  if (!pokemon) {
    notFound();
  }

  const evolutionWithColors = pokemon.evolution.map((item) => {
    const evoData = getPokemonById(item.id);
    return {
      ...item,
      heroColor: evoData?.heroColor ?? pokemon.heroColor,
      types: evoData?.types ?? pokemon.types,
    };
  });

  return (
    <main className="mobile-shell flex flex-col bg-white">
      {/* HERO wrapper — permite que o pokémon vaze sobre o card */}
      <div className="relative flex-1 bg-white">
        {/* HERO */}
        <section
          className="relative overflow-hidden bg-white"
          style={{ height: "304px" }}
        >
          {/* Círculo colorido — heroColor sobre fundo branco cria o domo */}
          <div
            className="absolute rounded-full"
            style={{
              width: "498px",
              height: "498px",
              left: "50%",
              top: "-194px",
              transform: "translateX(-50%)",
              backgroundColor: pokemon.heroColor,
            }}
          />

          {/* ElementoOutline 204×204 — sempre atrás do pokémon */}
          <div
            className="absolute"
            style={{ width: "204px", height: "204px", left: "50%", top: "35px", transform: "translateX(-50%)", zIndex: 0 }}
          >
            <ElementoOutline typeKey={pokemon.types[0]?.key} className="h-full w-full" />
          </div>

          {/* Icons bar */}
          <div
            className="absolute left-4 right-4 flex items-center justify-between"
            style={{ top: "19px" }}
          >
            <Link
              href="/pokedex"
              aria-label="Voltar para a lista"
              className="flex h-[38px] w-[38px] items-center justify-center rounded-full text-white"
            >
              <BackIcon className="h-[38px] w-[38px]" />
            </Link>
            <DetailFavoriteToggle id={pokemon.id} name={pokemon.name} />
          </div>
        </section>

        {/* Pokémon image — bottom alinhado com o bottom do círculo (304px) */}
        <Image
          src={pokemon.image}
          alt={pokemon.name}
          width={224}
          height={224}
          className="absolute z-10 object-contain"
          style={{
            width: "224px",
            height: "224px",
            left: "50%",
            top: "192px",
            transform: "translate(-50%, -50%)",
          }}
          priority
        />

      {/* CONTENT CARD */}
      <section className="rounded-t-[34px] bg-white px-4 pb-28 pt-[32px]">
        {/* Nome + Número */}
        <h1
          className="text-[32px] font-bold leading-[48px] text-black"
          style={{ marginBottom: "-5px" }}
        >
          {pokemon.name}
        </h1>
        <p className="text-[16px] font-medium leading-[24px] text-black/70">
          {pokemon.number}
        </p>

        {/* Type badges */}
        <div className="mt-3 flex flex-wrap gap-[7px]">
          {pokemon.types.map((type) => (
            <TypeBadgeDetail key={type.key} type={type} />
          ))}
        </div>

        {/* Descrição */}
        <p className="mt-4 text-[14px] leading-[145%] text-black/70">
          {pokemon.description}
        </p>

        {/* Divider */}
        <div className="mt-5 border-t border-black/[0.05]" />

        {/* Características: Peso / Altura / Categoria / Habilidade */}
        <div className="mt-5 flex flex-col gap-5">
          <div className="flex gap-5">
            <MetricCard label={config.texts.weightLabel} icon="weight" value={pokemon.weight} />
            <MetricCard label={config.texts.heightLabel} icon="height" value={pokemon.height} />
          </div>
          <div className="flex gap-5">
            <MetricCard label={config.texts.categoryLabel} icon="category" value={pokemon.category} />
            <MetricCard label={config.texts.abilityLabel} icon="ability" value={pokemon.ability} />
          </div>
        </div>

        {/* Gênero */}
        <div className="mt-5">
          <p className="text-center text-[12px] font-medium uppercase tracking-[0.05em] text-black/70">
            {config.texts.genderLabel}
          </p>
          <div
            className="mt-3 h-2 overflow-hidden rounded-full"
            style={{ backgroundColor: "#2551C4" }}
          >
            <div
              className="ml-auto h-full rounded-r-full"
              style={{
                width: `${pokemon.gender.female}%`,
                backgroundColor: "#FF7596",
              }}
            />
          </div>
          <div className="mt-1.5 flex items-center justify-between">
            <span className="flex items-center gap-[3px] text-[12px] font-medium uppercase text-black/70">
              <MaleIcon />
              {pokemon.gender.male}%
            </span>
            <span className="flex items-center gap-[3px] text-[12px] font-medium uppercase text-black/70">
              <FemaleIcon />
              {pokemon.gender.female}%
            </span>
          </div>
        </div>

        {/* Fraquezas */}
        <section className="mt-6">
          <h2 className="text-[18px] font-bold leading-[27px] text-black">
            {config.texts.weaknessesLabel}
          </h2>
          <div className="mt-3 grid grid-cols-2 gap-3">
            {pokemon.weaknesses.map((type) => (
              <TypeBadgeWide key={type.key} type={type} />
            ))}
          </div>
        </section>

        {/* Evoluções */}
        <section className="mt-10">
          <h2 className="text-[18px] font-bold leading-[27px] text-black">
            {config.texts.evolutionsLabel}
          </h2>
          <div className="mt-2 rounded-[15px] border border-[#E6E6E6] px-4 py-6">
            <div className="flex flex-col items-center gap-2">
              {evolutionWithColors.map((item, index) => (
                <div key={`evo-${item.id}-${index}`} className="w-full">
                  {index > 0 && (
                    <div className="my-2 flex items-center justify-center gap-2">
                      <EvolutionArrow />
                      {item.level && (
                        <span className="text-[14px] font-medium text-[#173EA5]">
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

      <TabBar />
    </main>
  );
}

// ─── Componentes locais ───────────────────────────────────────────────────────

function TypeBadgeDetail({ type }: { type: PokemonTypeTag }) {
  return (
    <div
      className="inline-flex h-[36px] items-center gap-2 rounded-[67px] px-[14px]"
      style={{ backgroundColor: type.color }}
    >
      <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-white">
        <TypeIcon typeKey={type.key} className="h-[17px] w-[17px] object-contain" />
      </span>
      <span className="text-[14px] font-medium text-black">{type.label}</span>
    </div>
  );
}

function TypeBadgeWide({ type }: { type: PokemonTypeTag }) {
  return (
    <div
      className="flex h-[36px] items-center justify-center gap-2 rounded-[67px] px-[14px]"
      style={{ backgroundColor: type.color }}
    >
      <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-white">
        <TypeIcon typeKey={type.key} className="h-[17px] w-[17px] object-contain" />
      </span>
      <span className="text-[14px] font-medium text-black">{type.label}</span>
    </div>
  );
}

function MetricCard({
  label,
  icon,
  value,
}: {
  label: string;
  icon: string;
  value: string;
}) {
  return (
    <div className="flex flex-1 flex-col gap-1">
      <div className="flex items-center gap-[6px]">
        <span className="flex h-4 w-4 items-center justify-center text-black/60">
          <MetricIcon type={icon} />
        </span>
        <span className="text-[12px] font-medium uppercase tracking-[0.05em] text-black/60">
          {label}
        </span>
      </div>
      <div className="flex h-[43px] w-full items-center justify-center rounded-[15px] border border-black/10">
        <span className="text-[18px] font-medium text-black/90">{value}</span>
      </div>
    </div>
  );
}

function MetricIcon({ type }: { type: string }) {
  if (type === "weight") {
    return (
      <svg viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4" aria-hidden>
        <path d="M8 2.5C7.2 2.5 6.5 3 6.2 3.7H4L2.5 13.5H13.5L12 3.7H9.8C9.5 3 8.8 2.5 8 2.5ZM8 4C8.6 4 9 4.4 9 5C9 5.6 8.6 6 8 6C7.4 6 7 5.6 7 5C7 4.4 7.4 4 8 4Z" />
      </svg>
    );
  }
  if (type === "height") {
    return (
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4" aria-hidden>
        <path d="M8 2V14" strokeLinecap="round" />
        <path d="M5 5L8 2L11 5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M5 11L8 14L11 11" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (type === "category") {
    return (
      <svg viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4" aria-hidden>
        <rect x="2" y="2" width="5.2" height="5.2" rx="1" />
        <rect x="8.8" y="2" width="5.2" height="5.2" rx="1" />
        <rect x="2" y="8.8" width="5.2" height="5.2" rx="1" />
        <rect x="8.8" y="8.8" width="5.2" height="5.2" rx="1" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4" aria-hidden>
      <circle cx="8" cy="8" r="5.5" />
      <circle cx="8" cy="8" r="1.5" fill="currentColor" stroke="none" />
      <line x1="2.5" y1="8" x2="6.5" y2="8" />
      <line x1="9.5" y1="8" x2="13.5" y2="8" />
    </svg>
  );
}

function MaleIcon() {
  return (
    <svg viewBox="0 0 18 18" fill="currentColor" className="h-[18px] w-[18px]" aria-hidden>
      <path d="M14 2H10.5v1.5h1.79l-2.54 2.54A5 5 0 1 0 11.3 7.29l2.54-2.54V6.5H15.5V3A1 1 0 0 0 14 2ZM8 14a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7Z" />
    </svg>
  );
}

function FemaleIcon() {
  return (
    <svg viewBox="0 0 18 18" fill="currentColor" className="h-[18px] w-[18px]" aria-hidden>
      <path d="M9 2a5 5 0 1 0 0 10A5 5 0 0 0 9 2Zm0 1.5a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7Zm-1 9v1.5H6.5V16H8v.5h2V16h1.5v-2H10V12.5H8Z" />
    </svg>
  );
}

function EvolutionArrow() {
  return (
    <svg width="16" height="28" viewBox="0 0 16 28" fill="none" aria-hidden="true">
      <path
        d="M8.63419 26.8291C8.23441 27.3085 7.49801 27.3085 7.09823 26.8291L0.234326 18.5988C-0.308808 17.9476 0.15429 16.9583 1.00231 16.9583L2.8568 16.9583C3.40885 16.9583 3.85647 16.511 3.8568 15.9589L3.86562 0.999413C3.86595 0.44736 4.31357 2.78749e-06 4.86562 2.83267e-06L10.8662 3.32371e-06C11.4185 3.3689e-06 11.8662 0.447717 11.8662 1L11.8662 15.9583C11.8662 16.5106 12.3139 16.9583 12.8662 16.9583L14.7301 16.9583C15.5781 16.9583 16.0412 17.9476 15.4981 18.5988L8.63419 26.8291Z"
        fill="#173EA5"
      />
    </svg>
  );
}

type EvoItem = {
  id: number;
  name: string;
  number: string;
  image: string;
  level: string | null;
  heroColor: string;
  types: PokemonTypeTag[];
};

function EvoCard({ item }: { item: EvoItem }) {
  return (
    <div className="relative h-[76px] overflow-hidden rounded-[90px] border border-[#E6E6E6]">
      {/* Imagem com fundo colorido */}
      <div
        className="absolute"
        style={{ width: "96px", height: "74px", left: 0, top: "1px" }}
      >
        {/* Círculo colorido */}
        <div
          className="absolute rounded-[71px]"
          style={{
            width: "95px",
            height: "74px",
            left: "1px",
            top: 0,
            backgroundColor: item.heroColor,
          }}
        />
        {/* ElementoOutline 65×65 */}
        <div
          className="absolute"
          style={{ width: "65px", height: "65px", left: "15px", top: "4px" }}
        >
          <ElementoOutline typeKey={item.types[0]?.key} className="h-full w-full" />
        </div>
        {/* Pokémon image */}
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-contain"
        />
      </div>

      {/* Texto + type pills */}
      <div
        className="absolute flex flex-col gap-[4px]"
        style={{ left: "108px", top: "10px" }}
      >
        <div>
          <p
            className="text-[16px] font-medium leading-[24px] text-[#1A1A1A]"
            style={{ marginTop: "-2px" }}
          >
            {item.name}
          </p>
          <p className="text-[12px] font-medium leading-[18px] text-[#4D4D4D]">
            {item.number}
          </p>
        </div>
        <div className="flex gap-1">
          {item.types.map((type) => (
            <TypePillEvo key={type.key} type={type} />
          ))}
        </div>
      </div>
    </div>
  );
}

function TypePillEvo({ type }: { type: PokemonTypeTag }) {
  return (
    <div
      className="flex h-[13px] w-[68px] items-center justify-center rounded-[20px]"
      style={{ backgroundColor: type.color }}
    >
      <ElementoOutline typeKey={type.key} className="h-[10px] w-[10px]" />
    </div>
  );
}

