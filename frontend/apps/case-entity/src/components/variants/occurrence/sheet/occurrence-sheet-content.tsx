import { useState } from 'react';
import { Edit2Icon } from 'lucide-react';
import useSWR from 'swr';

import { ExpandedGermlineSNVOccurrence, GermlineSNVOccurrence } from '@/api/api';
import VariantIcon from '@/components/base/icons/variant-icon';
import { Button } from '@/components/base/ui/button';
import { Separator } from '@/components/base/ui/separator';
import { Skeleton } from '@/components/base/ui/skeleton';
import { useI18n } from '@/components/hooks/i18n';
import { occurrencesApi } from '@/utils/api';

import IGVDialog from '../../igv/igv-dialog';
import InterpretationDialog from '../../interpretation/interpretation-dialog';
import OccurrenceExpandDetails from '../occurrence-expand-details';
import OccurrenceExpandTranscript from '../occurrence-expand-transcript';

type OccurrenceSheetContentProps = {
  occurrence: GermlineSNVOccurrence;
};

type OccurrenceExpandInput = {
  seqId: string;
  locusId: string;
};

async function fetchOccurrenceExpand(input: OccurrenceExpandInput) {
  const response = await occurrencesApi.getExpandedGermlineSNVOccurrence(input.seqId, input.locusId);
  return response.data;
}

function OccurrenceSheetContent({ occurrence }: OccurrenceSheetContentProps) {
  const { t } = useI18n();
  const [igvOpen, setIGVOpen] = useState<boolean>(false);

  const { data, isLoading } = useSWR<ExpandedGermlineSNVOccurrence, any, OccurrenceExpandInput>(
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
                <Edit2Icon /> {t('occurrence_expand.actions.interpret')}
              </Button>
            )}
          />
          {/* SJRA-389 <Button color="primary" size="xs">
            <Download />
            {t('occurrence_expand.actions.downloadReport')}
          </Button>*/}
          <IGVDialog
            open={igvOpen}
            setOpen={setIGVOpen}
            occurrence={occurrence}
            renderTrigger={handleOpen => (
              <Button color="primary" size="xs" onClick={handleOpen}>
                <VariantIcon />
                {t('occurrence_expand.actions.open_igv')}
              </Button>
            )}
          />
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

export default OccurrenceSheetContent;
