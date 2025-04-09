import { ExpendedOccurrence, Occurrence } from '@/api/api';
import VariantIcon from '@/components/base/icons/variant-icon';
import { Button } from '@/components/base/ui/button';
import { Card, CardContent, CardHeader } from '@/components/base/ui/card';
import { Download, SquareArrowOutUpRightIcon } from 'lucide-react';
import InterpretationDialogButton from '../interpretation/interpretation-dialog-button';
import { Separator } from '@/components/base/ui/separator';
import ClassificationSection from './classification-section';
import PredictionSection from './prediction-section';
import GeneSection from './gene-section';
import FrequencySection from './frequency-section';
import FunctionalScoreSection from './functional-score-section';
import ZygositySection from './zygosity-section';
import FamilySection from './family-section';
import ClinicalAssociationSection from './clinical-association-section';
import MetricSection from './metric-section';
import useSWR from 'swr';
import { occurrencesApi } from '@/utils/api';
import { Skeleton } from '@/components/base/ui/skeleton';

type GermlineVariantPreviewProps = {
  occurrence: Occurrence;
};

type OccurrenceExpendInput = {
  seqId: string;
  locusId: string;
};

async function fetchOccurrenceExpend(input: OccurrenceExpendInput) {
  const response = await occurrencesApi.getExpendedOccurrence(input.seqId, input.locusId);
  return response.data;
}

function VariantTablePreview({ occurrence }: GermlineVariantPreviewProps) {
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
    <Card>
      <CardHeader className="p-4">
        <div className="flex items-center gap-8">
          <Button variant="link" className="px-0">
            <a href="#" className="flex text-lg gap-2 font-medium items-center justify-center outline-none">
              <span className="max-w-72 overflow-hidden text-ellipsis">{occurrence.hgvsg}</span>
              <SquareArrowOutUpRightIcon />
            </a>
          </Button>
          <div className="flex gap-2">
            <InterpretationDialogButton color="primary" size="xs" occurrence={occurrence} />
            <Button color="primary" size="xs">
              <Download />
              Download report
            </Button>
            <Button color="primary" size="xs">
              <VariantIcon />
              Open IGV
            </Button>
          </div>
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="p-4 gap-10 grid grid-cols-4">
        {isLoading || data === undefined ? (
          <>
            <VariantTablePreviewSkeleton />
            <VariantTablePreviewSkeleton />
            <VariantTablePreviewSkeleton />
            <VariantTablePreviewSkeleton />
          </>
        ) : (
          <>
            <div className="space-y-2.5">
              <ClassificationSection />
              <PredictionSection />
              <GeneSection data={data} />
            </div>
            <div className="space-y-2.5">
              <FrequencySection />
              <FunctionalScoreSection data={data} />
            </div>
            <div className="space-y-2.5">
              <ZygositySection />
              <ClinicalAssociationSection />
            </div>
            <div className="space-y-2.5">
              <FamilySection />
              <MetricSection />
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

function VariantTablePreviewSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      <Skeleton className="w-full h-[16px]" />
      <Skeleton className="w-full h-[24px]" />
      <Skeleton className="w-full h-[16px]" />
      <Skeleton className="w-full h-[24px]" />
      <Skeleton className="w-full h-[24px]" />
      <Skeleton className="w-full h-[16px]" />
      <Skeleton className="w-full h-[24px]" />
      <Skeleton className="w-full h-[24px]" />
      <Skeleton className="w-full h-[24px]" />
    </div>
  );
}

export default VariantTablePreview;
