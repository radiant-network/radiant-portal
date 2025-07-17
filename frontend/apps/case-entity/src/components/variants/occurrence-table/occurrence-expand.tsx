import { ExpandedOccurrence, Occurrence } from '@/api/api';
import { Card, CardContent, CardHeader } from '@/components/base/ui/card';
import { Separator } from '@/components/base/ui/separator';
import useSWR from 'swr';
import { occurrencesApi } from '@/utils/api';
import { Skeleton } from '@/components/base/ui/skeleton';
import OccurrenceExpandDetails from './occurrence-expand-details';
import OccurrenceExpandHeader from './occurrence-expand-header';
import OccurrenceExpandTranscript from './occurrence-expand-transcript';

type GermlineVariantPreviewProps = {
  occurrence: Occurrence;
};

type OccurrenceExpandInput = {
  seqId: string;
  locusId: string;
};

async function fetchOccurrenceExpand(input: OccurrenceExpandInput) {
  const response = await occurrencesApi.getExpandedGermlineOccurrence(input.seqId, input.locusId);
  return response.data;
}

export default function OccurrenceExpand({ occurrence }: GermlineVariantPreviewProps) {
  const { data, isLoading } = useSWR<ExpandedOccurrence, any, OccurrenceExpandInput>(
    {
      locusId: occurrence.locus_id.toString(),
      seqId: occurrence.seq_id.toString(),
    },
    fetchOccurrenceExpand,
    {
      shouldRetryOnError: false,
      revalidateOnFocus: false,
    },
  );

  return (
    <Card className="shadow-none py-4 gap-4">
      <CardHeader className="flex px-4">
        <OccurrenceExpandHeader occurrence={occurrence} />
      </CardHeader>
      <Separator />
      <CardContent className="px-4 space-y-3">
        <div className="border rounded-sm p-4">
          {isLoading || data === undefined ? (
            <Skeleton className="w-full h-6" />
          ) : (
            <OccurrenceExpandTranscript occurrence={occurrence} expandedOccurrence={data}/>
          )}
        </div>
        <div className="border rounded-sm p-4 gap-10 grid grid-cols-2 2xl:grid-cols-4">
          {isLoading || data === undefined ? (
            <>
              <OccurrenceExpandSkeleton />
              <OccurrenceExpandSkeleton />
              <OccurrenceExpandSkeleton />
              <OccurrenceExpandSkeleton />
            </>
          ) : (
            <OccurrenceExpandDetails data={data} />
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function OccurrenceExpandSkeleton() {
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
