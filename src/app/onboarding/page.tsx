"use client";

import Link from "next/link";
import { useState } from "react";
import appConfigData from "@/data/mocks/app-config.json";

export default function OnboardingPage() {
  const t = appConfigData.texts;

  const steps = [
    {
      title: t.onboardingStep1Title,
      subtitle: t.onboardingStep1Subtitle,
      cta: t.onboardingStep1CTA,
      ctaHref: null as string | null,
      bg: "#EDF6FF",
      accent: "#173EA5",
      illustration: <KantoTrainer />,
    },
    {
      title: t.onboardingStep2Title,
      subtitle: t.onboardingStep2Subtitle,
      cta: t.onboardingStep2CTA,
      ctaHref: "/pokedex",
      bg: "#FFF5ED",
      accent: "#e8502a",
      illustration: <HoennTrainer />,
    },
  ];

  const [step, setStep] = useState(0);
  const current = steps[step];
  return (
    <main
      className="mobile-shell flex flex-col"
      style={{ backgroundColor: current.bg }}
    >
      <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
        <div className="mb-8 flex h-[220px] w-[220px] items-center justify-center">
          {current.illustration}
        </div>

        <h1
          className="text-[30px] font-black leading-[1.15] tracking-[-0.02em] text-[#1f2024] whitespace-pre-line"
        >
          {current.title}
        </h1>
        <p className="mt-3 max-w-[300px] text-[15px] leading-[1.55] text-[#5f6066]">
          {current.subtitle}
        </p>
      </div>

      <div className="flex flex-col items-center gap-5 px-6 pb-[calc(48px+env(safe-area-inset-bottom))]">
        <div className="flex gap-2">
          {steps.map((_, i) => (
            <div
              key={i}
              className="h-2 rounded-full transition-all"
              style={{
                width: i === step ? "24px" : "8px",
                backgroundColor: i === step ? current.accent : "#d0d2d8",
              }}
            />
          ))}
        </div>

        {current.ctaHref ? (
          <Link
            href={current.ctaHref}
            className="w-full rounded-full py-4 text-center text-[16px] font-bold text-white"
            style={{ backgroundColor: current.accent }}
          >
            {current.cta}
          </Link>
        ) : (
          <button
            type="button"
            className="w-full rounded-full py-4 text-[16px] font-bold text-white"
            style={{ backgroundColor: current.accent }}
            onClick={() => setStep((s) => s + 1)}
          >
            {current.cta}
          </button>
        )}
      </div>
    </main>
  );
}

function KantoTrainer() {
  return (
    <svg viewBox="0 0 180 200" fill="none" aria-hidden="true" className="h-full w-full">
      <ellipse cx="90" cy="190" rx="60" ry="10" fill="#173EA5" fillOpacity="0.12" />
      <rect x="65" y="80" width="50" height="70" rx="10" fill="#EF5350" />
      <rect x="65" y="80" width="50" height="20" rx="10" fill="#B71C1C" />
      <circle cx="90" cy="65" r="25" fill="#FFCCBC" />
      <rect x="55" y="90" width="15" height="40" rx="7" fill="#EF5350" />
      <rect x="110" y="90" width="15" height="40" rx="7" fill="#EF5350" />
      <rect x="70" y="148" width="18" height="45" rx="8" fill="#1565C0" />
      <rect x="92" y="148" width="18" height="45" rx="8" fill="#1565C0" />
      <rect x="68" y="190" width="22" height="10" rx="5" fill="#37474F" />
      <rect x="90" y="190" width="22" height="10" rx="5" fill="#37474F" />
      <rect x="78" y="48" width="24" height="14" rx="7" fill="#B71C1C" />
    </svg>
  );
}

function HoennTrainer() {
  return (
    <svg viewBox="0 0 180 200" fill="none" aria-hidden="true" className="h-full w-full">
      <ellipse cx="90" cy="190" rx="60" ry="10" fill="#e8502a" fillOpacity="0.12" />
      <rect x="65" y="80" width="50" height="70" rx="10" fill="#4CAF50" />
      <rect x="65" y="80" width="50" height="20" rx="10" fill="#2E7D32" />
      <circle cx="90" cy="65" r="25" fill="#FFCCBC" />
      <rect x="55" y="90" width="15" height="40" rx="7" fill="#4CAF50" />
      <rect x="110" y="90" width="15" height="40" rx="7" fill="#4CAF50" />
      <rect x="70" y="148" width="18" height="45" rx="8" fill="#37474F" />
      <rect x="92" y="148" width="18" height="45" rx="8" fill="#37474F" />
      <rect x="68" y="190" width="22" height="10" rx="5" fill="#212121" />
      <rect x="90" y="190" width="22" height="10" rx="5" fill="#212121" />
      <rect x="72" y="48" width="36" height="16" rx="8" fill="#FF7043" />
      <rect x="80" y="44" width="20" height="10" rx="5" fill="#FF7043" />
    </svg>
  );
}
