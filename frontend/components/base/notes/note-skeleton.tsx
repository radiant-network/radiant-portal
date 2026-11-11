import { Skeleton } from '@/components/base/shadcn/skeleton';

function NoteSkeleton() {
  return (
    <div className="flex gap-3 px-4 py-3">
      <div className="shrink-0">
        <Skeleton className="size-6 rounded-full" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-25" />
          <Skeleton className="h-5 w-25" />
          <div className="flex justify-end w-full">
            <Skeleton className="h-5 w-2" />
          </div>
        </div>
        <div className="flex flex-col mt-2">
          <Skeleton className="h-30 w-full" />
        </div>
      </div>
    </div>
  );
}

export default NoteSkeleton;
