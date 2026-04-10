import { BackIcon } from "@/components/icons";
import Link from "next/link";
import { getAppConfig } from "@/lib/pokedex-service";

export const dynamic = "force-static";

function AuthButton({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      className="flex w-full items-center gap-3 rounded-[14px] border border-[#e0e2e8] bg-white px-4 py-3.5 text-[15px] font-semibold text-[#1f2024] hover:bg-[#f5f6f8] active:bg-[#edeef2]"
    >
      <span className="flex h-6 w-6 items-center justify-center">{icon}</span>
      {label}
    </button>
  );
}

export default function CadastroPage() {
  const t = getAppConfig().texts;

  return (
    <main className="mobile-shell flex flex-col bg-white">
      <header className="flex items-center gap-3 px-4 pt-[calc(16px+env(safe-area-inset-top))] pb-2">
        <Link
          href="/onboarding"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f2f3f5]"
          aria-label="Voltar"
        >
          <BackIcon className="h-5 w-5 text-[#1f2024]" />
        </Link>
        <h1 className="text-[18px] font-bold text-[#1f2024]">{t.signupPageTitle}</h1>
      </header>

      <div className="flex flex-1 flex-col items-center justify-center px-6">
        <div className="mb-6 flex h-[180px] w-[180px] items-center justify-center">
          <CadastroTrainer />
        </div>
        <h2 className="text-[22px] font-black tracking-[-0.02em] text-[#1f2024] text-center leading-[1.2]">
          {t.signupWelcomeTitle}
        </h2>
        <p className="mt-2 text-center text-[14px] text-[#8a8c91]">
          {t.signupWelcomeSubtitle}
        </p>
      </div>

      <div className="px-6 pb-[calc(40px+env(safe-area-inset-bottom))] space-y-3">
        <AuthButton
          icon={<AppleIcon />}
          label={t.loginAppleButton}
        />
        <AuthButton
          icon={<GoogleIcon />}
          label={t.loginGoogleButton}
        />
        <AuthButton
          icon={<EmailIcon />}
          label={t.loginEmailButton}
        />
        <p className="text-center text-[13px] text-[#8a8c91] pt-2">
          {t.signupHasAccountLabel}{" "}
          <Link href="/login" className="font-semibold text-[#173EA5]">
            {t.signupLoginLink}
          </Link>
        </p>
      </div>
    </main>
  );
}

function CadastroTrainer() {
  return (
    <svg viewBox="0 0 160 180" fill="none" aria-hidden="true" className="h-full w-full">
      <ellipse cx="80" cy="172" rx="50" ry="8" fill="#e8502a" fillOpacity="0.1" />
      <rect x="55" y="72" width="50" height="65" rx="10" fill="#4CAF50" />
      <rect x="55" y="72" width="50" height="18" rx="9" fill="#2E7D32" />
      <circle cx="80" cy="58" r="22" fill="#FFCCBC" />
      <rect x="44" y="82" width="14" height="36" rx="7" fill="#4CAF50" />
      <rect x="102" y="82" width="14" height="36" rx="7" fill="#4CAF50" />
      <rect x="60" y="135" width="16" height="40" rx="7" fill="#37474F" />
      <rect x="84" y="135" width="16" height="40" rx="7" fill="#37474F" />
      <rect x="58" y="172" width="20" height="8" rx="4" fill="#212121" />
      <rect x="82" y="172" width="20" height="8" rx="4" fill="#212121" />
      <rect x="64" y="42" width="32" height="14" rx="7" fill="#FF7043" />
      <rect x="72" y="38" width="16" height="10" rx="5" fill="#FF7043" />
      <circle cx="96" cy="90" r="10" fill="#FDD835" />
      <text x="92" y="95" fontSize="12" fill="#1f2024" fontWeight="bold">+</text>
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 text-[#1f2024]">
      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.7 9.05 7.42c1.42.07 2.4.83 3.23.84.84 0 2.42-.91 4.07-.77 1.45.12 2.68.63 3.47 1.68-3.04 1.8-2.54 5.78.5 6.85-.58 1.52-1.36 3.01-3.27 4.26zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <rect x="3" y="5" width="18" height="14" rx="3" stroke="#1f2024" strokeWidth="1.8"/>
      <path d="M3 8l9 5 9-5" stroke="#1f2024" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  );
}
