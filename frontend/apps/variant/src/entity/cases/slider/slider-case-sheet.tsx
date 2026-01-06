import { useParams } from 'react-router';
import { ArrowUpRight } from 'lucide-react';

import { VariantUninterpretedCase } from '@/api/api';
import Empty from '@/components/base/empty';
import { Button } from '@/components/base/shadcn/button';
import { Separator } from '@/components/base/shadcn/separator';
import { useCase } from '@/components/base/slider/hooks/use-slider-occurrence-and-case';
import SliderCaseDetailsCard from '@/components/base/slider/slider-case-details-card';
import SliderHeader from '@/components/base/slider/slider-header';
import OccurrenceSheetDetailsCard from '@/components/base/slider/slider-occurrence-details-card';
import SliderOccurrenceSubHeader from '@/components/base/slider/slider-occurrence-sub-header';
import SliderPatientRow from '@/components/base/slider/slider-patient-row';
import SliderSheet from '@/components/base/slider/slider-sheet';
import SliderSheetSkeleton from '@/components/base/slider/slider-sheet-skeleton';
import { useI18n } from '@/components/hooks/i18n';

type CaseSliderSheetProps = {
  case?: VariantUninterpretedCase;
  children?: React.ReactElement;
  open: boolean;
  setOpen: (open: boolean) => void;
  onPrevious?: () => void;
  onNext?: () => void;
  hasPrevious?: boolean;
  hasNext?: boolean;
};

function CaseSliderSheet({
  case: caseData,
  children,
  open,
  setOpen,
  onPrevious,
  onNext,
  hasPrevious,
  hasNext,
}: CaseSliderSheetProps) {
  const { t } = useI18n();

  return (
    <SliderSheet trigger={children} open={open} setOpen={setOpen}>
      {caseData ? (
        <CaseSheetContent
          caseData={caseData}
          onPrevious={onPrevious}
          onNext={onNext}
          hasPrevious={hasPrevious}
          hasNext={hasNext}
        />
      ) : (
        <Empty title={t('case.empty.title')} description={t('case.empty.description')} showIcon={false} />
      )}
    </SliderSheet>
  );
}

type CaseSheetContentProps = {
  caseData: VariantUninterpretedCase;
  onPrevious?: () => void;
  onNext?: () => void;
  hasPrevious?: boolean;
  hasNext?: boolean;
};

function CaseSheetContent({ caseData, onPrevious, onNext, hasPrevious, hasNext }: CaseSheetContentProps) {
  const { t } = useI18n();

  const params = useParams<{ locusId: string }>();
  const locusId = params.locusId!;

  const { expandResult, caseResult, isLoading } = useCase(caseData.case_id, caseData.seq_id, locusId);

  if (isLoading || !expandResult.data || !caseResult.data) {
    return <SliderSheetSkeleton />;
  }

  return (
    <div className="flex flex-col gap-4">
      <SliderHeader onPrevious={onPrevious} onNext={onNext} hasPrevious={hasPrevious} hasNext={hasNext}>
        <SliderPatientRow
          patientId={caseData.patient_id}
          relationshipToProband={caseData?.relationship_to_proband}
          seqId={caseData?.seq_id}
        />
      </SliderHeader>
      <Separator />
      <SliderOccurrenceSubHeader
        hgvsg={expandResult.data.hgvsg}
        locusId={expandResult.data.locus_id}
        actions={
          <Button
            variant="outline"
            onClick={() => {
              window.open(`/case/entity/${caseResult.data?.case_id}?tab=variants&seq_id=${caseData.seq_id}`, '_blank');
            }}
            size="sm"
          >
            {t('preview_sheet.actions.view_all_variants')}
            <ArrowUpRight />
          </Button>
        }
      />
      <OccurrenceSheetDetailsCard
        caseId={caseData.case_id}
        seqId={caseData.seq_id}
        relationshipToProband={caseData.relationship_to_proband}
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
      <SliderCaseDetailsCard caseEntity={caseResult.data} />
    </div>
  );
}

export default CaseSliderSheet;
