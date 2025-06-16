import { Skeleton } from '@/components/base/ui/skeleton';

function FiltersGroupSkeleton() {
	return (
		<div className='flex flex-col gap-2 min-w-[400px] h-[68px] mb-2'>
			<div className="flex h-full">
				<Skeleton className='w-[120px] h-full' />
			</div>
			<div className="flex gap-2 h-full">
				<Skeleton className='w-[150px] h-full' />
				<Skeleton className='w-[125px] h-full' />
				<Skeleton className='w-[125px] h-full' />
				<Skeleton className='w-[125px] h-full' />
				<Skeleton className='w-[125px] h-full' />
			</div>
		</div>
	)

}

export default FiltersGroupSkeleton;
