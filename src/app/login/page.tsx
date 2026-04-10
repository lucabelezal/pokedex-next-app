import { AuthButton, AppleIcon, GoogleIcon, EmailIcon } from "@/components/auth-button";
import { PageHeader } from "@/components/page-header";
import Image from "next/image";
import { getAppConfig } from "@/lib/pokedex-service";

export const dynamic = "force-static";

export default function LoginPage() {
  const t = getAppConfig().texts;

  return (
    <main className="mobile-shell no-pull-refresh flex flex-col bg-white">
      <PageHeader title={t.loginPageTitle} backHref="/onboarding?step=3" />

      <div className="flex flex-1 flex-col overflow-y-auto px-8 pb-[calc(32px+env(safe-area-inset-bottom))] pt-4">
        <div className="mx-auto mb-6 flex h-[clamp(220px,34vh,280px)] w-full max-w-[320px] items-center justify-center">
          <Image
            src="/assets/login/login-trainer.svg"
            alt="Treinador Pokémon"
            width={284}
            height={288}
            className="h-full w-auto object-contain"
            priority
          />
        </div>

        <h2 className="mx-auto max-w-[320px] text-center text-[24px] font-medium leading-[1.2] tracking-[-0.02em] text-[#1f2024] text-pretty">
          {t.loginWelcomeTitle}
        </h2>
        <p className="mx-auto mt-4 max-w-[320px] text-center text-[16px] font-medium leading-[24px] tracking-[-0.01em] text-[#6d6e73] text-pretty">
          {t.signupWelcomeSubtitle}
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


