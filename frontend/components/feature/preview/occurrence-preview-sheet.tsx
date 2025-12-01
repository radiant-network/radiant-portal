import { useParams } from 'react-router';
import { ClipboardPen } from 'lucide-react';

import { CaseAssay, GermlineSNVOccurrence } from '@/api/api';
import InterpretationDialog from '@/apps/case-entity/src/components/variants/interpretation/interpretation-dialog';
import ClassificationBadge from '@/components/base/badges/classification-badge';
import { Button } from '@/components/base/ui/button';
import { Separator } from '@/components/base/ui/separator';
import { useI18n } from '@/components/hooks/i18n';

import PreviewOccurrenceDetailsCard from './preview-occurrence-details-card';
import PreviewSheet from './preview-sheet';
import PreviewSheetHeader from './preview-sheet-header';
import PreviewSheetSkeleton from './preview-sheet-skeleton';
import PreviewSheetSubHeader from './preview-sheet-sub-header';
import { useOccurrenceAndCase } from './preview-sheet-utils';
import PreviewVariantDetailsCard from './preview-variant-details-card';

type OccurrencePreviewSheetProps = {
  occurrence?: GermlineSNVOccurrence;
  children?: React.ReactElement;
  open: boolean;
  setOpen: (open: boolean) => void;
  onPrevious?: () => void;
  onNext?: () => void;
  hasPrevious?: boolean;
  hasNext?: boolean;
  patientSelected?: CaseAssay;
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
  // console.warn('OccurrencePreviewSheet occurrence', occurrence);
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
  patientSelected?: CaseAssay;
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
  const { patient, assay, expandResult, isLoading } = useOccurrenceAndCase(
    occurrence.seq_id.toString(),
    occurrence.locus_id.toString(),
    patientSelected,
  );
  const { caseId: caseIdParam } = useParams<{ caseId: string }>();
  const caseId = caseIdParam ? Number(caseIdParam) : undefined;

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
      <PreviewSheetSubHeader
        patientId={patient?.patient_id}
        relationshipToProband={patient?.relationship_to_proband}
        seqId={assay?.seq_id}
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
        />
      )}
      <PreviewVariantDetailsCard data={expandResult.data} />
    </div>
  );
}

export default OccurrencePreviewSheet;
