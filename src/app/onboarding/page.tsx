"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { BackIcon } from "@/components/icons";
import appConfigData from "@/data/mocks/app-config.json";

type SlideDirection = "forward" | "back";

type OnboardingStep = {
  title: string;
  subtitle: string;
  cta: string;
  ctaHref: string | null;
  secondaryHref: string | null;
  secondaryLabel: string | null;
  showSkip: boolean;
  bg: string;
  accent: string;
  imageSrc: string;
  imageAlt: string;
  imageWidth: number;
  imageHeight: number;
};

function OnboardingPageContent() {
  const t = appConfigData.texts;
  const searchParams = useSearchParams();

  const getStepFromQuery = useCallback(() => {
    const stepParam = searchParams.get("step");
    if (!stepParam) return 0;

    const parsedStep = Number.parseInt(stepParam, 10);
    if (Number.isNaN(parsedStep)) return 0;

    return Math.max(1, Math.min(parsedStep, 3)) - 1;
  }, [searchParams]);

  const steps: OnboardingStep[] = [
    {
      title: t.onboardingStep1Title,
      subtitle: t.onboardingStep1Subtitle,
      cta: t.onboardingStep1CTA,
      ctaHref: null,
      secondaryHref: null,
      secondaryLabel: null,
      showSkip: false,
      bg: "#ffffff",
      accent: "#173EA5",
      imageSrc: "/assets/onboarding/onboarding-professor-kid.png",
      imageAlt: "Professor e criança explorando juntos",
      imageWidth: 342,
      imageHeight: 270,
    },
    {
      title: t.onboardingStep2Title,
      subtitle: t.onboardingStep2Subtitle,
      cta: t.onboardingStep2CTA,
      ctaHref: null,
      secondaryHref: null,
      secondaryLabel: null,
      showSkip: false,
      bg: "#ffffff",
      accent: "#173EA5",
      imageSrc: "/assets/onboarding/onboarding-trainer-girl.png",
      imageAlt: "Treinadora em destaque",
      imageWidth: 300,
      imageHeight: 246,
    },
    {
      title: t.onboardingStep3Title,
      subtitle: t.onboardingStep3Subtitle,
      cta: t.onboardingStep3CTA,
      ctaHref: "/register",
      secondaryHref: "/login",
      secondaryLabel: t.onboardingStep3SecondaryCTA,
      showSkip: true,
      bg: "#ffffff",
      accent: "#173EA5",
      imageSrc: "/assets/onboarding/onboarding-duo.png",
      imageAlt: "Dois treinadores prontos para a jornada",
      imageWidth: 340,
      imageHeight: 356,
    },
  ];

  const [step, setStep] = useState(() => getStepFromQuery());
  const [direction, setDirection] = useState<SlideDirection>("forward");
  const current = steps[step];
  const swipeStartX = useRef<number | null>(null);

  const concluirOnboarding = () => {
    localStorage.setItem("onboarding_done", "1");
  };

  const irPara = useCallback((nextStep: number, nextDirection: SlideDirection) => {
    const clampedStep = Math.max(0, Math.min(nextStep, steps.length - 1));
    if (clampedStep === step) return;

    setDirection(nextDirection);
    setStep(clampedStep);
  }, [step, steps.length]);

  const avancar = useCallback(() => {
    irPara(step + 1, "forward");
  }, [irPara, step]);

  const voltar = useCallback(() => {
    irPara(step - 1, "back");
  }, [irPara, step]);

  const irParaPonto = (targetStep: number) => {
    if (targetStep === step) return;
    irPara(targetStep, targetStep > step ? "forward" : "back");
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLElement>) => {
    swipeStartX.current = event.clientX;
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLElement>) => {
    if (swipeStartX.current === null) return;

    const delta = event.clientX - swipeStartX.current;
    swipeStartX.current = null;

    if (Math.abs(delta) < 48) return;

    if (delta < 0) {
      avancar();
      return;
    }

    voltar();
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") {
        event.preventDefault();
        avancar();
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        voltar();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [avancar, voltar]);

  return (
    <main
      className="mobile-shell no-pull-refresh touch-manipulation flex flex-col"
      style={{
        backgroundColor: current.bg,
        paddingLeft: "env(safe-area-inset-left)",
        paddingRight: "env(safe-area-inset-right)",
      }}
      aria-label="Onboarding"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={() => {
        swipeStartX.current = null;
      }}
    >
      <a href="#onboarding-conteudo" className="sr-only focus:not-sr-only">
        Ir para conteúdo principal
      </a>

      <div className="flex items-center justify-between px-6 pt-[calc(12px+env(safe-area-inset-top))]">
        {step > 0 ? (
          <button
            type="button"
            aria-label="Voltar para o slide anterior"
            className="back-glass-btn flex h-10 w-10 items-center justify-center rounded-full text-[#173EA5] transition-colors hover:bg-white/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#173EA5]"
            onClick={voltar}
          >
            <BackIcon className="h-[19px] w-[19px]" />
          </button>
        ) : (
          <span aria-hidden="true" className="h-10 w-10" />
        )}

        {current.showSkip ? (
          <Link
            href="/pokedex"
            className="rounded-full bg-[#edf2ff] px-4 py-2 text-[16px] font-semibold text-[#173EA5] transition-colors hover:bg-[#dfe8ff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#173EA5]"
            onClick={concluirOnboarding}
          >
            Pular
          </Link>
        ) : (
          <span aria-hidden="true" className="h-10" />
        )}
      </div>

      <div
        id="onboarding-conteudo"
        className="flex min-h-0 flex-1 flex-col items-center justify-center overflow-y-auto px-8 pb-5 text-center"
      >
        <div
          key={step}
          className={`onboarding-slide w-full ${direction === "forward" ? "onboarding-slide-forward" : "onboarding-slide-back"}`}
        >
          <p className="sr-only" aria-live="polite">
            Slide {step + 1} de {steps.length}
          </p>
          <p className="sr-only">Arraste para os lados ou use as setas do teclado.</p>

          <div className="mb-5 flex h-[clamp(220px,34vh,280px)] w-full items-center justify-center">
            <Image
              src={current.imageSrc}
              alt={current.imageAlt}
              width={current.imageWidth}
              height={current.imageHeight}
              className="h-auto w-full max-w-[342px] object-contain"
              style={{ maxHeight: "clamp(190px, 30vh, 250px)" }}
              priority={step === 0}
            />
          </div>

          <h1
            className="mx-auto max-w-[320px] text-pretty text-[24px] font-medium leading-[1.22] tracking-[-0.01em] text-[#1f2024] whitespace-pre-line"
          >
            {current.title}
          </h1>
          <p className="mx-auto mt-4 max-w-[320px] text-pretty text-[16px] font-medium leading-[24px] text-[#5f6066]">
            {current.subtitle}
          </p>
        </div>
      </div>

      <div className="flex flex-col items-center gap-5 px-6 pb-[calc(48px+env(safe-area-inset-bottom))]">
        <div className="flex gap-2" role="tablist" aria-label="Progresso do onboarding">
          {steps.map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === step}
              aria-label={`Ir para slide ${i + 1}`}
              className="h-2 rounded-full transition-[width,background-color] motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#173EA5]"
              style={{
                width: i === step ? "24px" : "8px",
                backgroundColor: i === step ? current.accent : "#c8d2ef",
              }}
              onClick={() => irParaPonto(i)}
            />
          ))}
        </div>

        {current.ctaHref ? (
          <Link
            href={current.ctaHref}
            className="w-full rounded-full py-4 text-center text-[16px] font-bold text-white transition-opacity hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#173EA5]"
            style={{ backgroundColor: current.accent }}
            onClick={concluirOnboarding}
          >
            {current.cta}
          </Link>
        ) : (
          <button
            type="button"
            className="w-full rounded-full py-4 text-[16px] font-bold text-white transition-opacity hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#173EA5]"
            style={{ backgroundColor: current.accent }}
            onClick={avancar}
          >
            {current.cta}
          </button>
        )}

        {current.secondaryHref && current.secondaryLabel ? (
          <Link
            href={current.secondaryHref}
            className="rounded-md px-1 py-1 text-[20px] font-semibold text-[#173EA5] transition-colors hover:text-[#0f2d82] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#173EA5]"
            onClick={concluirOnboarding}
          >
            {current.secondaryLabel}
          </Link>
        ) : null}
      </div>
    </main>
  );
}

function OnboardingFallback() {
  return (
    <main className="mobile-shell flex flex-col items-center justify-center bg-white px-8 text-center">
      <p className="text-[16px] font-semibold text-[#5f6066]">Carregando onboarding...</p>
    </main>
  );
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={<OnboardingFallback />}>
      <OnboardingPageContent />
    </Suspense>
  );
}
