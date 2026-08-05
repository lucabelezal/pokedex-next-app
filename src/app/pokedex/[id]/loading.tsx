import {
  SkeletonDetailHero,
  SkeletonDetailInfo,
  SkeletonMetricCard,
  SkeletonGenderBar,
  SkeletonEvolutionItem,
  SkeletonRow,
  Skeleton,
} from "@/components/skeleton";

export default function PokemonDetailLoading() {
  return (
    <>
      <SkeletonDetailHero />
      <SkeletonDetailInfo />
      <SkeletonRow>
        <SkeletonMetricCard />
        <SkeletonMetricCard />
        <SkeletonMetricCard />
        <SkeletonMetricCard />
      </SkeletonRow>
      <SkeletonGenderBar />
      <SkeletonRow>
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-[36px] w-[36px] rounded-full" />
        ))}
      </SkeletonRow>
      <div className="mx-auto max-w-[430px] px-5 pt-6">
        <div className="flex flex-col gap-2">
          <SkeletonEvolutionItem />
          <SkeletonEvolutionItem />
        </div>
      </div>
    </>
  );
}
