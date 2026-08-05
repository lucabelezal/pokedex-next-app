"use client";

import type { ReactNode } from "react";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={`shimmer rounded-lg ${className ?? ""}`}
      aria-hidden="true"
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="relative min-h-[136px] overflow-hidden rounded-[16px] bg-[#e5e7eb]">
      <div className="flex min-h-[136px]">
        <div className="flex min-w-0 flex-1 flex-col justify-start gap-2 px-4 pb-3 pt-3 pr-4">
          <Skeleton className="h-[14px] w-[48px]" />
          <Skeleton className="h-[24px] w-[140px]" />
          <div className="mt-1 flex gap-1">
            <Skeleton className="h-[18px] w-[52px] rounded-full" />
            <Skeleton className="h-[18px] w-[52px] rounded-full" />
          </div>
        </div>
        <div className="relative w-[126px] flex-shrink-0 bg-[#d1d5db]">
          <Skeleton className="absolute left-1/2 top-1/2 h-[64px] w-[64px] -translate-x-1/2 -translate-y-1/2 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonDetailHero() {
  return (
    <div className="relative mx-auto w-full max-w-[430px]">
      <div className="relative h-[calc(304px+env(safe-area-inset-top))] overflow-hidden bg-[#e5e7eb]" />
      <Skeleton className="absolute left-1/2 top-[calc(192px+env(safe-area-inset-top))] h-[224px] w-[224px] -translate-x-1/2 -translate-y-1/2 rounded-full" />
      <Skeleton className="absolute left-[20px] top-[calc(19px+env(safe-area-inset-top))] h-[42px] w-[42px] rounded-full" />
      <div className="absolute right-[20px] top-[calc(19px+env(safe-area-inset-top))]">
        <Skeleton className="h-[42px] w-[42px] rounded-full" />
      </div>
    </div>
  );
}

export function SkeletonDetailInfo() {
  return (
    <div className="mx-auto max-w-[430px] px-5 pt-2">
      <div className="-mb-[5px] flex items-center justify-between">
        <Skeleton className="h-[28px] w-[180px]" />
        <Skeleton className="h-[14px] w-[52px]" />
      </div>
      <div className="mt-2 flex gap-1">
        <Skeleton className="h-[22px] w-[64px] rounded-full" />
        <Skeleton className="h-[22px] w-[64px] rounded-full" />
      </div>
      <Skeleton className="mt-3 h-[40px] w-full" />
    </div>
  );
}

export function SkeletonRow({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto max-w-[430px] px-5 pt-2">
      <Skeleton className="h-[16px] w-[80px]" />
      <div className="mt-2 flex gap-3">{children}</div>
    </div>
  );
}

export function SkeletonMetricCard() {
  return (
    <div className="flex h-[80px] w-[96px] flex-col items-start gap-1 rounded-[16px] bg-[#e5e7eb] p-3">
      <Skeleton className="h-[20px] w-[20px] rounded" />
      <Skeleton className="h-[18px] w-[48px]" />
      <Skeleton className="h-[12px] w-[56px]" />
    </div>
  );
}

export function SkeletonGenderBar() {
  return (
    <div className="mx-auto max-w-[430px] px-5 pt-6">
      <div className="flex justify-between">
        <Skeleton className="h-[14px] w-[40px]" />
        <Skeleton className="h-[14px] w-[40px]" />
      </div>
      <Skeleton className="mt-2 h-[6px] w-full rounded-full" />
    </div>
  );
}

export function SkeletonEvolutionItem() {
  return (
    <div className="relative h-[76px] overflow-hidden rounded-[64px] bg-[#e5e7eb]">
      <Skeleton className="absolute left-[15px] top-[13px] h-[50px] w-[50px] rounded-full" />
      <Skeleton className="absolute left-[108px] top-[18px] h-[20px] w-[100px]" />
      <Skeleton className="absolute left-[108px] top-[42px] h-[14px] w-[52px]" />
    </div>
  );
}

export function SkeletonRegionCard() {
  return (
    <div className="relative block h-[110px] w-full overflow-hidden rounded-[24px] bg-[#e5e7eb]">
      <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-transparent" />
      <div className="relative flex h-full items-end px-5 pb-3">
        <div className="flex flex-col gap-1">
          <Skeleton className="h-[12px] w-[64px]" />
          <Skeleton className="h-[32px] w-[140px]" />
        </div>
      </div>
    </div>
  );
}
