import { ExpendedOccurrence, Occurrence } from '@/api/api';
import { Card, CardContent, CardHeader } from '@/components/base/ui/card';
import { Separator } from '@/components/base/ui/separator';
import useSWR from 'swr';
import { occurrencesApi } from '@/utils/api';
import { Skeleton } from '@/components/base/ui/skeleton';
import OccurrenceExpendDetails from './occurrence-expend-details';
import OccurrenceExpendHeader from './occurrence-expend-header';
import OccurrenceExpendTranscript from './occurrence-expend-transcript';

type GermlineVariantPreviewProps = {
  occurrence: Occurrence;
};

type OccurrenceExpendInput = {
  seqId: string;
  locusId: string;
};

async function fetchOccurrenceExpend(input: OccurrenceExpendInput) {
  const response = await occurrencesApi.getExpendedGermlineOccurrence(input.seqId, input.locusId);
  return response.data;
}

export default function OccurrenceExpend({ occurrence }: GermlineVariantPreviewProps) {
  const { data, isLoading } = useSWR<ExpendedOccurrence, any, OccurrenceExpendInput>(
    {
      locusId: occurrence.locus_id.toString(),
      seqId: occurrence.seq_id.toString(),
    },
    fetchOccurrenceExpend,
    {
      shouldRetryOnError: false,
      revalidateOnFocus: false,
    },
  );

  return (
    <Card className="shadow-none py-4 gap-4">
      <CardHeader className="flex px-4">
        <OccurrenceExpendHeader occurrence={occurrence} />
      </CardHeader>
      <Separator />
      <CardContent className="px-4 space-y-3">
        <div className="border rounded p-4">
          {isLoading || data === undefined ? (
            <Skeleton className="w-full h-6" />
          ) : (
            <OccurrenceExpendTranscript occurrence={occurrence} />
          )}
        </div>
        <div className="border rounded p-4 gap-10 grid grid-cols-2 2xl:grid-cols-4">
          {isLoading || data === undefined ? (
            <>
              <OccurrenceExpendSkeleton />
              <OccurrenceExpendSkeleton />
              <OccurrenceExpendSkeleton />
              <OccurrenceExpendSkeleton />
            </>
          ) : (
            <OccurrenceExpendDetails data={data} />
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function OccurrenceExpendSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      <Skeleton className="w-full h-4" />
      <Skeleton className="w-full h-6" />
      <Skeleton className="w-full h-4" />
      <Skeleton className="w-full h-6" />
      <Skeleton className="w-full h-6" />
      <Skeleton className="w-full h-4" />
      <Skeleton className="w-full h-6" />
      <Skeleton className="w-full h-6" />
      <Skeleton className="w-full h-6" />
    </div>
  );
}
