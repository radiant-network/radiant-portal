import { Separator } from '@/components/base/shadcn/separator';
import { Skeleton } from '@/components/base/shadcn/skeleton';

const SliderSheetSkeleton = () => (
  <div className="flex flex-col gap-4">
    <Skeleton className="h-7 w-5/6 bg-background mr-4" />
    <Separator />
    <Skeleton className="h-12 w-full bg-background" />
    <Skeleton className="h-[300px] w-full bg-background" />
    <Skeleton className="h-[300px] w-full bg-background" />
    <Skeleton className="h-[300px] w-full bg-background" />
  </div>
);

export default SliderSheetSkeleton;
