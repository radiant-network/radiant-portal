import { Skeleton } from '@/components/base/shadcn/skeleton';

function FiltersGroupSkeleton() {
  return (
    <div className="flex flex-col justify-start gap-2 min-w-[400px] h-[48px]">
      <div className="flex h-[24px]">
        <Skeleton className="w-[120px] h-full" />
      </div>
      <div className="flex gap-2 h-[32px]">
        <Skeleton className="w-[150px] h-full" />
        <Skeleton className="w-[125px] h-full" />
        <Skeleton className="w-[125px] h-full" />
        <Skeleton className="w-[125px] h-full" />
        <Skeleton className="w-[125px] h-full" />
      </div>
    </div>
  );
}

export default FiltersGroupSkeleton;
