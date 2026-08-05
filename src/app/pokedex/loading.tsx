import { SkeletonCard, Skeleton } from "@/components/skeleton";

export default function PokedexLoading() {
  return (
    <div className="mx-auto max-w-[430px]">
      <div className="sticky top-0 z-30 bg-white px-4 pt-[calc(14px+env(safe-area-inset-top))] pb-2">
        <div className="flex items-center gap-2">
          <Skeleton className="h-[42px] flex-1 rounded-[21px]" />
          <Skeleton className="h-[42px] w-[100px] rounded-[21px]" />
          <Skeleton className="h-[42px] w-[90px] rounded-[21px]" />
        </div>
      </div>
      <div className="px-4 pb-2">
        <Skeleton className="h-[18px] w-[140px]" />
      </div>
      <div className="space-y-3 px-4 pb-24">
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  );
}
