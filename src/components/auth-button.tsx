export function AuthButton({
  icon,
  label,
  variant = "outline",
}: {
  icon: React.ReactNode;
  label: string;
  variant?: "outline" | "solid";
}) {
  const isSolid = variant === "solid";

  return (
    <button
      type="button"
      className={`flex h-[56px] w-full items-center justify-center gap-4 rounded-full px-6 text-[16px] font-medium tracking-[-0.01em] transition-colors ${
        isSolid
          ? "border border-[#173EA5] bg-[#173EA5] text-white hover:bg-[#143693] active:bg-[#102c78]"
          : "border border-[#c8cad1] bg-transparent text-[#515357] hover:bg-[#f1f2f4] active:bg-[#e8eaee]"
      }`}
    >
      <span className="flex h-8 w-8 items-center justify-center">{icon}</span>
      {label}
    </button>
  );
}

export function AppleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-8 w-8 text-current">
      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.7 9.05 7.42c1.42.07 2.4.83 3.23.84.84 0 2.42-.91 4.07-.77 1.45.12 2.68.63 3.47 1.68-3.04 1.8-2.54 5.78.5 6.85-.58 1.52-1.36 3.01-3.27 4.26zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
    </svg>
  );
}

export function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-8 w-8">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

export function EmailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8">
      <rect x="3" y="5" width="18" height="14" rx="3" stroke="currentColor" strokeWidth="1.8" />
      <path d="M3 8l9 5 9-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
