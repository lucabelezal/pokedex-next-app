import { SkeletonRegionCard } from "@/components/skeleton";

export default function RegionsLoading() {
  return (
    <div className="mx-auto max-w-[430px] px-4 pt-3 pb-24">
      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonRegionCard key={i} />
        ))}
      </div>
    </div>
  );
}
