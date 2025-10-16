import { CaseEntity, ExpandedGermlineSNVOccurrence, GermlineSNVOccurrence } from '@/api/api';
import { Button } from '@/components/base/ui/button';
import { Separator } from '@/components/base/ui/separator';
import { Skeleton } from '@/components/base/ui/skeleton';
import { PROBAND } from '@/components/feature/constants';
import { caseApi, occurrencesApi } from '@/utils/api';
import { ClipboardPen } from 'lucide-react';
import useSWR from 'swr';
import OccurrenceSheetDetailsCard from './preview-occurence-details-card';
import PreviewSheet from './preview-sheet';
import PreviewSheetHeader from './preview-sheet-header';
import PreviewSheetSubHeader from './preview-sheet-sub-header';
import PreviewVariantDetailsCard from './preview-variant-details-card';

type OccurencePreviewSheetProps = {
  occurrence: GermlineSNVOccurrence;
  children?: React.ReactElement;
  open: boolean;
  setOpen: (open: boolean) => void;
};

function OccurencePreviewSheet({ occurrence, children, open, setOpen }: OccurencePreviewSheetProps) {
  return (
    <PreviewSheet trigger={children} open={open} setOpen={setOpen}>
      <OccurenceSheetContent occurrence={occurrence} />
    </PreviewSheet>
  );
}

type OccurrenceExpandInput = {
  seqId: string;
  locusId: string;
};

type CaseInput = {
  key: string;
  caseId: any | undefined;
};

async function fetchOccurrenceExpand(input: OccurrenceExpandInput) {
  const response = await occurrencesApi.getExpandedGermlineSNVOccurrence(input.seqId, input.locusId);
  return response.data;
}

async function fetchCase(input: CaseInput) {
  if (!input.caseId) {
    return null;
  }

  const response = await caseApi.caseEntity(input.caseId);
  return response.data;
}

function OccurenceSheetContent({ occurrence }: { occurrence: GermlineSNVOccurrence }) {
  const expandResult = useSWR<ExpandedGermlineSNVOccurrence, any, OccurrenceExpandInput>(
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

  const caseResult = useSWR<CaseEntity | null, any, CaseInput>(
    {
      key: 'case-entity',
      caseId: expandResult.data?.case_id,
    },
    fetchCase,
    {
      shouldRetryOnError: false,
      revalidateOnFocus: false,
    },
  );

  if (expandResult.isLoading || !expandResult.data || caseResult.isLoading || !caseResult.data) {
    return <Skeleton className="h-full w-full" />;
  }

  const proband = caseResult.data?.members.find(member => member.relationship_to_proband === PROBAND);
  const assay = caseResult.data?.assays.find(assay => assay.patient_id === proband?.patient_id);

  return (
    <div className="flex flex-col gap-4">
      <PreviewSheetHeader hgvsg={occurrence.hgvsg} />
      <Separator />
      <PreviewSheetSubHeader
        probandId={proband?.patient_id}
        seqId={assay?.seq_id}
        actions={
          <Button size="sm">
            <ClipboardPen />
            Interpretation
          </Button>
        }
      />
      <OccurrenceSheetDetailsCard
        seqId={occurrence.seq_id}
        locus={occurrence.locus}
        start={occurrence.start}
        chromosome={occurrence.chromosome}
        zygosity={expandResult.data.zygosity}
        transmission={expandResult.data.transmission}
        parental_origin={expandResult.data.parental_origin}
        genotype_quality={expandResult.data.genotype_quality}
        filter={expandResult.data.filter}
        father_calls={expandResult.data.father_calls}
        mother_calls={expandResult.data.mother_calls}
        ad_alt={expandResult.data.ad_alt}
        ad_total={expandResult.data.ad_total}
      />
      <PreviewVariantDetailsCard />
    </div>
  );
}

export default OccurencePreviewSheet;
