"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ContaActiveIcon,
  HeartActiveIcon,
  HeartIcon,
  PokedexActiveIcon,
  PokedexIcon,
  RegionActiveIcon,
  RegionIcon,
  UserIcon,
} from "@/components/icons";

type Tab = {
  href: string;
  label: string;
  ActiveIcon: (props: React.SVGProps<SVGSVGElement>) => React.JSX.Element;
  InactiveIcon: (props: React.SVGProps<SVGSVGElement>) => React.JSX.Element;
};

const tabs: Tab[] = [
  { href: "/pokedex", label: "Pokédex", ActiveIcon: PokedexActiveIcon, InactiveIcon: PokedexIcon },
  { href: "/regioes", label: "Regiões", ActiveIcon: RegionActiveIcon, InactiveIcon: RegionIcon },
  { href: "/favoritos", label: "Favoritos", ActiveIcon: HeartActiveIcon, InactiveIcon: (p) => <HeartIcon {...p} filled={false} /> },
  { href: "/perfil", label: "Conta", ActiveIcon: ContaActiveIcon, InactiveIcon: UserIcon },
];

export function TabBar() {
  const pathname = usePathname();

  return (
    <>
      <div aria-hidden className="h-[calc(68px+env(safe-area-inset-bottom))]" />
      <nav className="tab-shell fixed bottom-0 left-1/2 z-40 w-full max-w-[430px] -translate-x-1/2 border-x border-t border-[#d7d7d7] bg-[#f6f6f6] pb-[calc(8px+env(safe-area-inset-bottom))] pt-2">
        <ul className="mx-auto flex items-center justify-around px-4">
          {tabs.map(({ href, label, ActiveIcon, InactiveIcon }) => {
            const active = pathname === href || pathname.startsWith(`${href}/`);

            return (
              <li key={href}>
                <Link
                  href={href}
                  className="flex w-[76px] flex-col items-center gap-1 py-1"
                  aria-current={active ? "page" : undefined}
                >
                  {active ? (
                    <ActiveIcon className="h-6 w-6" />
                  ) : (
                    <InactiveIcon
                      className="h-6 w-6"
                      style={{ color: "#8f9094" }}
                    />
                  )}
                  <span
                    className="text-[13px] font-semibold"
                    style={{ color: active ? "#1d4fd7" : "#8f9094" }}
                  >
                    {label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
