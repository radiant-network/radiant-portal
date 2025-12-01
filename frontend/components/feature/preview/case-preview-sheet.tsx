import { useParams } from 'react-router';
import { ArrowUpRight } from 'lucide-react';

import { VariantUninterpretedCase } from '@/api/api';
import { ActionButton } from '@/components/base/buttons';
import Empty from '@/components/base/empty';
import { Separator } from '@/components/base/ui/separator';
import { useI18n } from '@/components/hooks/i18n';

import PreviewCaseDetailsCard from './preview-case-details-card';
import OccurrenceSheetDetailsCard from './preview-occurrence-details-card';
import PreviewSheet from './preview-sheet';
import PreviewSheetHeader from './preview-sheet-header';
import PreviewSheetSkeleton from './preview-sheet-skeleton';
import PreviewSheetSubHeader from './preview-sheet-sub-header';
import { useOccurrenceAndCase } from './preview-sheet-utils';

type CasePreviewSheetProps = {
  case?: VariantUninterpretedCase;
  children?: React.ReactElement;
  open: boolean;
  setOpen: (open: boolean) => void;
  onPrevious?: () => void;
  onNext?: () => void;
  hasPrevious?: boolean;
  hasNext?: boolean;
};

function CasePreviewSheet({
  case: caseData,
  children,
  open,
  setOpen,
  onPrevious,
  onNext,
  hasPrevious,
  hasNext,
}: CasePreviewSheetProps) {
  const { t } = useI18n();

  return (
    <PreviewSheet trigger={children} open={open} setOpen={setOpen}>
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
    </PreviewSheet>
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

  const { expandResult, caseResult, patient, assay, isLoading } = useOccurrenceAndCase(
    caseData.seq_id.toString(),
    locusId,
  );

  if (isLoading || !expandResult.data || !caseResult.data) {
    return <PreviewSheetSkeleton />;
  }

  return (
    <div className="flex flex-col gap-4">
      <PreviewSheetHeader
        hgvsg={expandResult.data!.hgvsg}
        onPrevious={onPrevious}
        onNext={onNext}
        hasPrevious={hasPrevious}
        hasNext={hasNext}
        locusId={locusId}
      />
      <Separator />
      <PreviewSheetSubHeader
        patientId={patient?.patient_id}
        seqId={assay?.seq_id}
        actions={
          <ActionButton
            actions={[
              {
                icon: <ArrowUpRight />,
                label: t('preview_sheet.actions.view_all_variants'),
                onClick: () => window.open(`/case/entity/${caseResult.data?.case_id}?tab=variants`, '_blank'),
              },
            ]}
            onDefaultAction={() => window.open(`/case/entity/${caseResult.data?.case_id}`, '_blank')}
            size="sm"
          >
            {t('preview_sheet.actions.view_in_case')}
            <ArrowUpRight />
          </ActionButton>
        }
      />
      <OccurrenceSheetDetailsCard
        caseId={caseData.case_id}
        seqId={caseData.seq_id}
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
      <PreviewCaseDetailsCard caseEntity={caseResult.data} />
    </div>
  );
}

export default CasePreviewSheet;
