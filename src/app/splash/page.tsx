import Link from "next/link";
import { Lilita_One } from "next/font/google";

const lilitaOne = Lilita_One({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export const dynamic = "force-static";

export default function SplashPage() {
  return (
    <Link
      href="/onboarding"
      className="mobile-shell flex items-center justify-center bg-[#060A1E]"
    >
      <h1 className={`${lilitaOne.className} text-[56px] leading-none`}>
        <span className="text-white">Poké</span>
        <span className="text-[#CD3131]">dex</span>
      </h1>
    </Link>
  );
}
