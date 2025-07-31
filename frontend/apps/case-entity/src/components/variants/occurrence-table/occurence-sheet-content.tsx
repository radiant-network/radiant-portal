import { ExpandedOccurrence, Occurrence } from '@/api/api';
import useSWR from 'swr';
import { occurrencesApi } from '@/utils/api';
import { Skeleton } from '@/components/base/ui/skeleton';
import OccurrenceExpandDetails from './occurrence-expand-details';
import OccurrenceExpandTranscript from './occurrence-expand-transcript';
import { Button } from '@/components/base/ui/button';
import InterpretationDialog from '../interpretation/interpretation-dialog';
import { Edit2Icon } from 'lucide-react';
import { useI18n } from '@/components/hooks/i18n';
import { Separator } from '@/components/base/ui/separator';

type OccurenceSheetContentProps = {
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

function OccurenceSheetContent({ occurrence }: OccurenceSheetContentProps) {
  const { t } = useI18n();

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
    <div className="space-y-3">
      <div className="flex items-center gap-5">
        <div className="flex gap-2">
          <InterpretationDialog
            occurrence={occurrence}
            renderTrigger={handleOpen => (
              <Button size="xs" onClick={handleOpen}>
                <Edit2Icon /> {t('occurrenceExpand.actions.interpret')}
              </Button>
            )}
          />
          {/* SJRA-389 <Button color="primary" size="xs">
            <Download />
            {t('occurrenceExpand.actions.downloadReport')}
          </Button>
          <Button color="primary" size="xs">
            <VariantIcon />
            {t('occurrenceExpand.actions.openIGV')}
          </Button> */}
        </div>
        <Separator orientation="vertical" className="h-5" />
        <div className="flex gap-4 items-center">
          <Button variant="link" className="px-0">
            <a
              href={`https://genome.ucsc.edu/cgi-bin/hgTracks?db=hg38&lastVirtModeType=default&lastVirtModeExtraState=&virtModeType=default&virtMode=0&nonVirtPosition=&position=chr${occurrence.chromosome}%3A${occurrence.start}-${occurrence.start}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              UCSC
            </a>
          </Button>
          {occurrence.rsnumber && (
            <Button variant="link" className="px-0">
              <a
                href={`https://www.ncbi.nlm.nih.gov/research/litvar2/docsum?text=${occurrence.rsnumber}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                LitVAR
              </a>
            </Button>
          )}
        </div>
      </div>
      <div className="border rounded-sm p-4">
        {isLoading || data === undefined ? (
          <Skeleton className="w-full h-6" />
        ) : (
          <OccurrenceExpandTranscript occurrence={occurrence} expandedOccurrence={data} />
        )}
      </div>
      <div className="border rounded-sm p-4 gap-10 grid grid-cols-1 md:grid-cols-2">
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
    </div>
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

export default OccurenceSheetContent;
