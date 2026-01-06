import { SquarePen } from 'lucide-react';

import { CaseSequencingExperiment, GermlineSNVOccurrence } from '@/api/api';
import { Button } from '@/components/base/shadcn/button';
import { Separator } from '@/components/base/shadcn/separator';
import { useOccurrenceAndCase } from '@/components/base/slider/hooks/use-slider-occurrence-and-case';
import { useI18n } from '@/components/hooks/i18n';
import SliderVariantDetailsCard from '@/entity/variants/occurrence/slider/slider-variant-details-card';
import { useCaseIdFromParam } from '@/utils/helper';
import SliderHeader from 'components/base/slider/slider-header';
import SliderOccurrenceDetailsCard from 'components/base/slider/slider-occurrence-details-card';
import SliderOccurrenceSubHeader from 'components/base/slider/slider-occurrence-sub-header';
import SliderPatientRow from 'components/base/slider/slider-patient-row';
import SliderSheet from 'components/base/slider/slider-sheet';
import SliderSheetSkeleton from 'components/base/slider/slider-sheet-skeleton';

import InterpretationDialog from '../../interpretation/interpretation-dialog';
import { useOccurrenceListContext } from '../hooks/use-occurrences-list';

type OccurrenceSliderSheetProps = {
  occurrence?: GermlineSNVOccurrence;
  children?: React.ReactElement;
  open: boolean;
  setOpen: (open: boolean) => void;
  onPrevious?: () => void;
  onNext?: () => void;
  hasPrevious?: boolean;
  hasNext?: boolean;
  patientSelected?: CaseSequencingExperiment;
  handleInterpretationChange?: () => void;
};

function SliderOccurrenceSheet({
  occurrence,
  children,
  open,
  setOpen,
  onPrevious,
  onNext,
  hasPrevious,
  hasNext,
  patientSelected,
}: OccurrenceSliderSheetProps) {
  return (
    <SliderSheet trigger={children} open={open} setOpen={setOpen}>
      {occurrence && (
        <OccurrenceSheetContent
          occurrence={occurrence}
          onPrevious={onPrevious}
          onNext={onNext}
          hasPrevious={hasPrevious}
          hasNext={hasNext}
          patientSelected={patientSelected}
        />
      )}
    </SliderSheet>
  );
}

type OccurrenceSheetContentProps = {
  occurrence: GermlineSNVOccurrence;
  onPrevious?: () => void;
  onNext?: () => void;
  hasPrevious?: boolean;
  hasNext?: boolean;
  patientSelected?: CaseSequencingExperiment;
};

function OccurrenceSheetContent({
  occurrence,
  onPrevious,
  onNext,
  hasPrevious,
  hasNext,
  patientSelected,
}: OccurrenceSheetContentProps) {
  const { t } = useI18n();
  const caseId = useCaseIdFromParam();
  const { mutate, loading } = useOccurrenceListContext();
  const { patient, caseSequencing, expandResult, isLoading } = useOccurrenceAndCase(
    caseId,
    occurrence.seq_id,
    occurrence.locus_id.toString(),
    patientSelected,
  );

  if (isLoading || !expandResult.data) {
    return <SliderSheetSkeleton />;
  }

  return (
    <div className="flex flex-col gap-4">
      <SliderHeader onPrevious={onPrevious} onNext={onNext} hasPrevious={hasPrevious} hasNext={hasNext}>
        <SliderPatientRow
          patientId={patient?.patient_id}
          relationshipToProband={patient?.relationship_to_proband}
          seqId={caseSequencing?.seq_id}
        />
      </SliderHeader>
      <Separator />
      <SliderOccurrenceSubHeader
        locusId={occurrence.locus_id}
        hgvsg={occurrence.hgvsg}
        actions={
          <InterpretationDialog
            occurrence={occurrence}
            handleSaveCallback={mutate}
            renderTrigger={handleOpen => (
              <Button loading={loading} size="sm" onClick={handleOpen}>
                <SquarePen />
                {occurrence.has_interpretation ? t('common.edit') : t('preview_sheet.actions.interpretation')}
              </Button>
            )}
          />
        }
      />
      {caseId && (
        <SliderOccurrenceDetailsCard
          caseId={caseId}
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
          enableIGV
        />
      )}
      <SliderVariantDetailsCard data={expandResult.data} />
    </div>
  );
}

export default SliderOccurrenceSheet;
