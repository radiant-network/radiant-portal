import { Separator } from "@/components/base/ui/separator";
import { Skeleton } from "@/components/base/ui/skeleton";

function AssayVariantFiltersSkeleton() {

  return (
    <div className="inline-flex gap-4 items-center px-6 py-4">
      <Skeleton className='w-[100px] h-[32px]' />
      <Skeleton className='w-[200px] h-[32px]' />
      <Skeleton className='w-[60px] h-[32px]' />
      <Separator className="h-6" orientation="vertical" />
      <Skeleton className='w-[50px] h-[32px]' />
    </div>
  )
}

export default AssayVariantFiltersSkeleton;
