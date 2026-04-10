"use client";

import Image from "next/image";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SplashPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      const jaViuOnboarding = localStorage.getItem("onboarding_done");
      if (jaViuOnboarding) {
        router.replace("/pokedex");
      } else {
        router.replace("/onboarding");
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <main
      className="flex min-h-[100dvh] w-full items-center justify-center overflow-hidden"
      style={{
        backgroundColor: "#060A1E",
        paddingTop: "env(safe-area-inset-top)",
        paddingRight: "env(safe-area-inset-right)",
        paddingBottom: "env(safe-area-inset-bottom)",
        paddingLeft: "env(safe-area-inset-left)",
      }}
      aria-label="Tela de splash"
    >
      <div className="splash-logo-wrap" style={{ transform: "translateY(8px)" }}>
        <Image
          src="/assets/branding/pokedex-logo.svg"
          alt="Pokédex"
          width={393}
          height={123}
          priority
          className="splash-logo h-auto w-[280px]"
        />
      </div>
    </main>
  );
}

