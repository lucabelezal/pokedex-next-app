import type { ReactNode } from "react";

export function MetricCard({
  label,
  icon,
  value,
}: {
  label: string;
  icon: ReactNode;
  value: string;
}) {
  return (
    <div className="flex flex-1 flex-col gap-1">
      <div className="flex items-center gap-[8px]">
        <span className="flex h-4 w-4 items-center justify-center text-black/60">
          {icon}
        </span>
        <span className="text-[12px] font-medium uppercase tracking-[0.05em] text-black/60">
          {label}
        </span>
      </div>
      <div className="flex h-[43px] w-full items-center justify-center rounded-[16px] border border-black/10">
        <span className="text-[18px] font-medium text-black/90">{value}</span>
      </div>
    </div>
  );
}

export function WeightIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4" aria-hidden>
      <path d="M8 2.5C7.2 2.5 6.5 3 6.2 3.7H4L2.5 13.5H13.5L12 3.7H9.8C9.5 3 8.8 2.5 8 2.5ZM8 4C8.6 4 9 4.4 9 5C9 5.6 8.6 6 8 6C7.4 6 7 5.6 7 5C7 4.4 7.4 4 8 4Z" />
    </svg>
  );
}

export function HeightIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4" aria-hidden>
      <path d="M8 2V14" strokeLinecap="round" />
      <path d="M5 5L8 2L11 5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 11L8 14L11 11" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function CategoryIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4" aria-hidden>
      <rect x="2" y="2" width="5.2" height="5.2" rx="1" />
      <rect x="8.8" y="2" width="5.2" height="5.2" rx="1" />
      <rect x="2" y="8.8" width="5.2" height="5.2" rx="1" />
      <rect x="8.8" y="8.8" width="5.2" height="5.2" rx="1" />
    </svg>
  );
}

export function AbilityIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4" aria-hidden>
      <circle cx="8" cy="8" r="5.5" />
      <circle cx="8" cy="8" r="1.5" fill="currentColor" stroke="none" />
      <line x1="2.5" y1="8" x2="6.5" y2="8" />
      <line x1="9.5" y1="8" x2="13.5" y2="8" />
    </svg>
  );
}

export function MaleIcon() {
  return (
    <svg viewBox="0 0 18 18" fill="currentColor" className="h-[18px] w-[18px]" aria-hidden>
      <path d="M14 2H10.5v1.5h1.79l-2.54 2.54A5 5 0 1 0 11.3 7.29l2.54-2.54V6.5H15.5V3A1 1 0 0 0 14 2ZM8 14a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7Z" />
    </svg>
  );
}

export function FemaleIcon() {
  return (
    <svg viewBox="0 0 18 18" fill="currentColor" className="h-[18px] w-[18px]" aria-hidden>
      <path d="M9 2a5 5 0 1 0 0 10A5 5 0 0 0 9 2Zm0 1.5a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7Zm-1 9v1.5H6.5V16H8v.5h2V16h1.5v-2H10V12.5H8Z" />
    </svg>
  );
}
