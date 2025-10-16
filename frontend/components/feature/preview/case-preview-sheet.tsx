import { CaseEntity, ExpandedGermlineSNVOccurrence } from '@/api/api';
import { ActionButton } from '@/components/base/buttons';
import { Separator } from '@/components/base/ui/separator';
import { PROBAND } from '@/components/feature/constants';
import { caseApi, occurrencesApi } from '@/utils/api';
import { ArrowUpRight } from 'lucide-react';
import useSWR from 'swr';
import OccurrenceSheetCaseCard from './preview-case-details-card';
import OccurrenceSheetDetailsCard from './preview-occurence-details-card';
import PreviewSheet from './preview-sheet';
import PreviewSheetHeader from './preview-sheet-header';
import PreviewSheetSkeleton from './preview-sheet-skeleton';
import PreviewSheetSubHeader from './preview-sheet-sub-header';

type OccurencePreviewSheetProps = {
  seqId: number;
  locusId: string;
  children?: React.ReactElement;
  open?: boolean;
  setOpen?: (open: boolean) => void;
};

function OccurencePreviewSheet({ seqId, locusId, children, open, setOpen }: OccurencePreviewSheetProps) {
  return (
    <PreviewSheet trigger={children} open={open} setOpen={setOpen}>
      <OccurenceSheetContent seqId={seqId} locusId={locusId} />
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

function OccurenceSheetContent({ seqId, locusId }: { seqId: number; locusId: string }) {
  const expandResult = useSWR<ExpandedGermlineSNVOccurrence, any, OccurrenceExpandInput>(
    {
      locusId: locusId.toString(),
      seqId: seqId.toString(),
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
    return <PreviewSheetSkeleton />;
  }

  const proband = caseResult.data?.members.find(member => member.relationship_to_proband === PROBAND);
  const assay = caseResult.data?.assays.find(assay => assay.patient_id === proband?.patient_id);

  return (
    <div className="flex flex-col gap-4">
      <PreviewSheetHeader hgvsg={expandResult.data.hgvsg} />
      <Separator />
      <PreviewSheetSubHeader
        probandId={proband?.patient_id}
        seqId={assay?.seq_id}
        actions={
          <ActionButton
            actions={[
              {
                icon: <ArrowUpRight />,
                label: 'View all variants',
                onClick: () => window.open(`/case/entity/${caseResult.data?.case_id}?tab=variants`, '_blank'),
              },
            ]}
            onDefaultAction={() => window.open(`/case/entity/${caseResult.data?.case_id}`, '_blank')}
            size="sm"
          >
            View in case
            <ArrowUpRight />
          </ActionButton>
        }
      />
      <OccurrenceSheetDetailsCard
        seqId={seqId}
        locus={expandResult.data.locus || locusId}
        start={expandResult.data.start || 0}
        chromosome={expandResult.data.chromosome || ''}
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
      <OccurrenceSheetCaseCard caseEntity={caseResult.data} />
    </div>
  );
}

export default OccurencePreviewSheet;
