import { AuthButton, AppleIcon, GoogleIcon, EmailIcon } from "@/components/auth-button";
import { PageHeader } from "@/components/page-header";
import Image from "next/image";
import { getAppConfig } from "@/lib/pokeapi-service";

type AuthPageProps = {
  mode: "login" | "register";
};

const CONTENT = {
  login: {
    pageTitleKey: "loginPageTitle",
    welcomeTitleKey: "loginWelcomeTitle",
    welcomeSubtitleKey: "signupWelcomeSubtitle",
    image: "/assets/login/login-trainer.svg",
    imageAlt: "Treinador Pokémon",
    imageWidth: 284,
  },
  register: {
    pageTitleKey: "signupPageTitle",
    welcomeTitleKey: "signupWelcomeTitle",
    welcomeSubtitleKey: "signupWelcomeSubtitle",
    image: "/assets/cadastro/cadastro-trainer.svg",
    imageAlt: "Treinadora Pokémon",
    imageWidth: 266,
  },
} as const;

export function AuthPage({ mode }: AuthPageProps) {
  const t = getAppConfig().texts;
  const c = CONTENT[mode];

  return (
    <main className="mobile-shell no-pull-refresh flex flex-col bg-white">
      <PageHeader title={t[c.pageTitleKey]} backHref="/onboarding?step=3" />

      <div className="flex flex-1 flex-col overflow-y-auto px-8 pb-[calc(32px+env(safe-area-inset-bottom))] pt-4">
        <div className="mx-auto mb-6 flex h-[clamp(220px,34vh,280px)] w-full max-w-[320px] items-center justify-center">
          <Image
            src={c.image}
            alt={c.imageAlt}
            width={c.imageWidth}
            height={288}
            className="h-full w-auto object-contain"
            priority
          />
        </div>

        <h2 className="mx-auto max-w-[320px] text-center text-[24px] font-medium leading-[1.2] tracking-[-0.02em] text-[#1f2024] text-pretty">
          {t[c.welcomeTitleKey]}
        </h2>
        <p className="mx-auto mt-4 max-w-[320px] text-center text-[16px] font-medium leading-[24px] tracking-[-0.01em] text-[#6d6e73] text-pretty">
          {t[c.welcomeSubtitleKey]}
        </p>

        <div className="mt-6 space-y-4">
          <AuthButton icon={<AppleIcon />} label="Continuar com a Apple" />
          <AuthButton icon={<GoogleIcon />} label="Continuar com o Google" />
          <AuthButton
            icon={<EmailIcon />}
            label="Continuar com um e-mail"
            variant="solid"
          />
        </div>
      </div>
    </main>
  );
}
