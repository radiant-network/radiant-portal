import { ClipboardPen } from 'lucide-react';

import { CaseSequencingExperiment, GermlineSNVOccurrence } from '@/api/api';
import ClassificationBadge from '@/components/base/badges/classification-badge';
import PreviewOccurrenceSubHeader from '@/components/base/preview/preview-occurrence-sub-header';
import PreviewSheet from '@/components/base/preview/preview-sheet';
import PreviewSheetHeader from '@/components/base/preview/preview-sheet-header';
import PreviewSheetSkeleton from '@/components/base/preview/preview-sheet-skeleton';
import { useOccurrenceAndCase } from '@/components/base/preview/preview-sheet-utils';
import { Button } from '@/components/base/shadcn/button';
import { Separator } from '@/components/base/shadcn/separator';
import { useI18n } from '@/components/hooks/i18n';
import PreviewVariantDetailsCard from '@/entity/variants/occurrence/preview/preview-variant-details-card';
import { useCaseIdFromParam } from '@/utils/helper';
import PreviewOccurrenceDetailsCard from 'components/base/preview/preview-occurrence-details-card';

import InterpretationDialog from '../../interpretation/interpretation-dialog';

type OccurrencePreviewSheetProps = {
  occurrence?: GermlineSNVOccurrence;
  children?: React.ReactElement;
  open: boolean;
  setOpen: (open: boolean) => void;
  onPrevious?: () => void;
  onNext?: () => void;
  hasPrevious?: boolean;
  hasNext?: boolean;
  patientSelected?: CaseSequencingExperiment;
};

function OccurrencePreviewSheet({
  occurrence,
  children,
  open,
  setOpen,
  onPrevious,
  onNext,
  hasPrevious,
  hasNext,
  patientSelected,
}: OccurrencePreviewSheetProps) {
  return (
    <PreviewSheet trigger={children} open={open} setOpen={setOpen}>
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
    </PreviewSheet>
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
  const { patient, caseSequencing, expandResult, isLoading } = useOccurrenceAndCase(
    caseId,
    occurrence.seq_id,
    occurrence.locus_id.toString(),
    patientSelected,
  );

  if (isLoading || !expandResult.data) {
    return <PreviewSheetSkeleton />;
  }

  return (
    <div className="flex flex-col gap-4">
      <PreviewSheetHeader
        locusId={occurrence.locus_id}
        hgvsg={occurrence.hgvsg}
        onPrevious={onPrevious}
        onNext={onNext}
        hasPrevious={hasPrevious}
        hasNext={hasNext}
      />
      <Separator />
      <PreviewOccurrenceSubHeader
        patientId={patient?.patient_id}
        relationshipToProband={patient?.relationship_to_proband}
        seqId={caseSequencing?.seq_id}
        actions={
          <InterpretationDialog
            occurrence={occurrence}
            renderTrigger={handleOpen => (
              <Button size="sm" onClick={handleOpen}>
                <ClipboardPen />
                {t('preview_sheet.actions.interpretation')}
                {expandResult.data?.interpretation_classification && (
                  <div className="bg-background rounded-md">
                    <ClassificationBadge value={expandResult.data.interpretation_classification} abbreviated />
                  </div>
                )}
              </Button>
            )}
          />
        }
      />
      {caseId && (
        <PreviewOccurrenceDetailsCard
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
      <PreviewVariantDetailsCard data={expandResult.data} />
    </div>
  );
}

export default OccurrencePreviewSheet;
