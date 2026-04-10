import { ChevronDownIcon } from "@/components/icons";
import type { ReactNode } from "react";

export function SettingsSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="mb-4">
      <p className="mb-1 px-4 text-[12px] font-bold uppercase tracking-[0.08em] text-[#8a8c91]">
        {title}
      </p>
      <div className="overflow-hidden rounded-[16px] bg-white divide-y divide-[#f0f1f3]">
        {children}
      </div>
    </div>
  );
}

export function SettingsRow({
  label,
  value,
  chevron = false,
  danger = false,
}: {
  label: string;
  value?: string;
  chevron?: boolean;
  danger?: boolean;
}) {
  return (
    <div className="flex items-center justify-between px-4 py-3.5">
      <span
        className="text-[16px] font-medium"
        style={{ color: danger ? "#e03535" : "#1f2024" }}
      >
        {label}
      </span>
      <div className="flex items-center gap-2">
        {value && (
          <span className="text-[14px] text-[#8a8c91]">{value}</span>
        )}
        {chevron && (
          <ChevronDownIcon className="h-4 w-4 -rotate-90 text-[#b0b2b8]" />
        )}
      </div>
    </div>
  );
}

export function SettingsToggleRow({
  label,
  enabled,
}: {
  label: string;
  enabled: boolean;
}) {
  return (
    <div className="flex items-center justify-between px-4 py-3.5">
      <span className="text-[16px] font-medium text-[#1f2024]">{label}</span>
      <div
        className="h-[28px] w-[48px] rounded-full p-[2px] transition-colors"
        style={{ backgroundColor: enabled ? "#173EA5" : "#d0d2d8" }}
      >
        <div
          className="h-[24px] w-[24px] rounded-full bg-white shadow transition-transform"
          style={{ transform: enabled ? "translateX(20px)" : "translateX(0)" }}
        />
      </div>
    </div>
  );
}
