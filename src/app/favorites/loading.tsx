import { SkeletonCard } from "@/components/skeleton";

export default function FavoritesLoading() {
  return (
    <div className="mobile-shell bg-white">
      <div className="border-b border-[#d7d7d7] px-4 pb-5 pt-[calc(16px+env(safe-area-inset-top))]">
        <div className="h-[42px] w-[180px] shimmer rounded-lg" />
      </div>
      <div className="space-y-3 px-4 pt-6 pb-24">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  );
}
