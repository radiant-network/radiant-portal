import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
import { MessageSquare, SquarePen } from 'lucide-react';

import { CaseSequencingExperiment, GermlineSNVOccurrence } from '@/api/api';
import InterpretationDialog from '@/components/base/interpretation/interpretation-dialog';
import { Button } from '@/components/base/shadcn/button';
import { Separator } from '@/components/base/shadcn/separator';
import { useOccurrenceAndCase } from '@/components/base/slider/hooks/use-slider-occurrence-and-case';
import SliderHeader from '@/components/base/slider/slider-header';
import SliderInterpretationDetailsCard from '@/components/base/slider/slider-interpretation-details-card';
import SliderOccurrenceDetailsCard from '@/components/base/slider/slider-occurrence-details-card';
import SliderOccurrenceSubHeader from '@/components/base/slider/slider-occurrence-sub-header';
import SliderPatientRow from '@/components/base/slider/slider-patient-row';
import SliderSheet from '@/components/base/slider/slider-sheet';
import SliderSheetSkeleton from '@/components/base/slider/slider-sheet-skeleton';
import SliderVariantDetailsCard from '@/components/base/slider/slider-variant-details-card';
import { useVariantComments } from '@/components/base/variant-comments/use-variant-comments';
import VariantCommentsSheet from '@/components/base/variant-comments/variant-comments-sheet';
import { useI18n } from '@/components/hooks/i18n';
import { OPEN_COMMENTS_PARAM } from '@/entity/variants/constants';
import { useCaseIdFromParam } from '@/utils/helper';

import { useSeqIdContext } from '../hooks/use-seq-id';

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
  onInterpretationSaved: () => void;
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
  onInterpretationSaved,
}: OccurrenceSliderSheetProps) {
  return (
    <SliderSheet trigger={children} open={open} setOpen={setOpen}>
      {occurrence && (
        <OccurrenceSheetContent
          onInterpretationSaved={onInterpretationSaved}
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
  onInterpretationSaved: () => void;
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
  onInterpretationSaved,
}: OccurrenceSheetContentProps) {
  const { t } = useI18n();
  const caseId = useCaseIdFromParam();
  const seqId = useSeqIdContext();
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.get(OPEN_COMMENTS_PARAM)) {
      setCommentsOpen(true);
      setSearchParams(prev => {
        prev.delete(OPEN_COMMENTS_PARAM);
        return prev;
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [occurrence.locus_id]);
  const { comments, addComment, updateComment, deleteComment, currentUser } = useVariantComments();
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
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setCommentsOpen(true)}>
              <MessageSquare className="h-4 w-4" />
              {comments.length > 0 && comments.length}
            </Button>
            {!occurrence.has_interpretation && (
              <InterpretationDialog
                locusId={occurrence.locus_id}
                transcriptId={occurrence.transcript_id}
                seqId={seqId}
                handleSaveCallback={onInterpretationSaved}
                renderTrigger={handleOpen => (
                  <Button size="sm" onClick={handleOpen}>
                    <SquarePen />
                    {t('preview_sheet.actions.interpretation')}
                  </Button>
                )}
              />
            )}
          </div>
        }
      />
      <VariantCommentsSheet
        open={commentsOpen}
        onOpenChange={setCommentsOpen}
        comments={comments}
        currentUserId={currentUser.id}
        onAdd={addComment}
        onUpdate={updateComment}
        onDelete={deleteComment}
      />
      {occurrence.has_interpretation && (
        <SliderInterpretationDetailsCard
          canEditInterpretation
          onInterpretationSaved={onInterpretationSaved}
          seqId={seqId}
          caseId={caseId}
          symbol={occurrence?.symbol}
          locusId={occurrence?.locus_id}
          isManeSelect={occurrence?.is_mane_select}
          isManePlus={occurrence?.is_mane_plus}
          isCanonical={occurrence?.is_canonical}
          transcriptId={occurrence?.transcript_id}
        />
      )}
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
          relationshipToProband={patient?.relationship_to_proband}
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
