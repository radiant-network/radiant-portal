import { ReactNode, useCallback, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router';
import { toast } from 'sonner';
import useSWRMutation from 'swr/mutation';

import { CaseEntity, CaseSequencingExperiment, ExpandedSomaticSNVOccurrence, InterpretationSomatic } from '@/api/api';
import { alertDialog } from '@/components/base/dialog/alert-dialog-store';
import ClassificationSection from '@/components/base/occurrence/classification-section';
import ClinicalAssociationSection from '@/components/base/occurrence/clinical-association-section';
import GeneSection from '@/components/base/occurrence/gene-section';
import SomaticFrequencySection from '@/components/base/occurrence/somatic-frequency-section';
import { Button } from '@/components/base/shadcn/button';
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/base/shadcn/dialog';
import { Spinner } from '@/components/base/spinner';
import { useI18n } from '@/components/hooks/i18n';
import { caseApi, interpretationApi, occurrencesApi } from '@/utils/api';
import { useCaseIdFromParam, useSeqIdFromSearchParam } from '@/utils/helper';

import { SELECTED_VARIANT_PARAM } from '../../constants';
import InterpretationVariantHeader from '../../interpretation/header';
import InterpretationLastUpdatedBanner from '../../interpretation/last-updated-banner';
import InterpretationTranscript from '../../interpretation/transcript';
import { Interpretation, InterpretationFormRef } from '../../interpretation/types';

import InterpretationFormSomatic from './somatic-interpretation-form';

type SomaticInterpretationDialogProps = {
  locusId: string;
  transcriptId?: string;
  patientId?: number;
  handleSaveCallback?: () => void;
  renderTrigger: (handleOpen: () => void) => ReactNode;
  isCreation?: boolean;
};

type CaseEntityInput = {
  key: string;
  caseId: number;
};

type InterpretationSomaticInput = {
  caseId: string;
  seqId: string;
  locusId: string;
  transcriptId: string;
};

type ExpandSomaticInput = {
  caseId: number;
  seqId: number;
  locusId: string;
};

type SomaticInterpretationFormInput = {
  caseId: string;
  seqId: string;
  locusId: string;
  transcriptId: string;
  interpretationSomatic: InterpretationSomatic;
};

async function fetchCaseEntity(_url: string, { arg }: { arg: CaseEntityInput }) {
  const response = await caseApi.caseEntity(arg.caseId);
  return response.data;
}

async function fetchInterpretationSomatic(_url: string, { arg }: { arg: InterpretationSomaticInput }) {
  const response = await interpretationApi.getInterpretationSomatic(
    arg.caseId,
    arg.seqId,
    arg.locusId,
    arg.transcriptId,
  );
  return response.data;
}

async function fetchExpandedSomaticSNVOccurrence(_url: string, { arg }: { arg: ExpandSomaticInput }) {
  const response = await occurrencesApi.getExpandedSomaticSNVOccurrence(arg.caseId, arg.seqId, arg.locusId);
  return response.data;
}

async function saveSomaticInterpretation(_url: string, { arg }: { arg: SomaticInterpretationFormInput }) {
  const response = await interpretationApi.postInterpretationSomatic(
    arg.caseId,
    arg.seqId,
    arg.locusId,
    arg.transcriptId,
    arg.interpretationSomatic,
  );
  return response.data;
}

function SomaticInterpretationDialog({
  locusId,
  transcriptId,
  patientId,
  handleSaveCallback,
  renderTrigger,
  isCreation = false,
}: SomaticInterpretationDialogProps) {
  const { t } = useI18n();
  const [searchParams, setSearchParams] = useSearchParams();
  const [open, setOpen] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const somaticFormRef = useRef<InterpretationFormRef>(null);
  const caseId = useCaseIdFromParam();
  const seqId = useSeqIdFromSearchParam();

  const caseEntity = useSWRMutation<CaseEntity, any, string, CaseEntityInput>('case-entity', fetchCaseEntity);

  const occurrenceExpand = useSWRMutation<ExpandedSomaticSNVOccurrence, any, string, ExpandSomaticInput>(
    `form-somatic-expand-${caseId}-${locusId}-${seqId}`,
    fetchExpandedSomaticSNVOccurrence,
  );

  const interpretation = useSWRMutation<Interpretation, any, string, InterpretationSomaticInput>(
    `form-somatic-interpretation-${seqId}-${locusId}-${transcriptId}`,
    fetchInterpretationSomatic,
  );

  const saveInterpretation = useSWRMutation(
    `save-somatic-interpretation-${seqId}-${locusId}-${transcriptId}`,
    saveSomaticInterpretation,
    {
      onSuccess: () => {
        setOpen(false);
        handleSaveCallback && handleSaveCallback();

        if (isCreation) {
          toast.success(t('variant.interpretation_form.notification.success.title'), {
            action: {
              label: t('variant.interpretation_form.notification.success.button'),
              onClick: () => {
                searchParams.set(SELECTED_VARIANT_PARAM, locusId);
                setSearchParams(searchParams);
              },
            },
            closeButton: true,
          });
          return;
        }
        toast.success(t('variant.interpretation_form.notification.success.title'));
      },
      onError: () => {
        setOpen(false);
        toast.error(t('variant.interpretation_form.notification.error.title'), {
          description: t('variant.interpretation_form.notification.error.text'),
          closeButton: true,
        });
      },
    },
  );

  const relationshipToProband = useMemo(
    () =>
      caseEntity.data?.sequencing_experiments.find((caseSeqEx: CaseSequencingExperiment) => caseSeqEx.seq_id === seqId)
        ?.relationship_to_proband,
    [caseEntity.data],
  );

  const isLoading = useMemo(
    () => interpretation.isMutating || occurrenceExpand?.isMutating,
    [interpretation.isMutating, occurrenceExpand?.isMutating],
  );

  const handleSave = useCallback(() => {
    somaticFormRef.current?.submit();
  }, [somaticFormRef]);

  const handleOpen = useCallback(async () => {
    setOpen(true);
    caseEntity.trigger({ key: 'case-entity', caseId });
    interpretation.trigger({
      caseId: caseId.toString(),
      seqId: seqId.toString(),
      locusId,
      transcriptId: transcriptId ?? '',
    });
    occurrenceExpand.trigger({
      caseId,
      seqId,
      locusId,
    });
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {renderTrigger(handleOpen)}
      <DialogContent
        size="lg"
        onEscapeKeyDown={e => e.preventDefault()}
        variant="stickyBoth"
        className="overflow-hidden"
      >
        <DialogHeader>
          <DialogTitle>{t('variant.interpretation_form.title')}</DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <DialogBody className="flex items-center justify-center">
            <Spinner size={32} />
          </DialogBody>
        ) : (
          <>
            <DialogBody className="overflow-scroll space-y-6">
              <InterpretationLastUpdatedBanner
                updated_by_name={interpretation.data?.updated_by_name}
                updated_at={interpretation.data?.updated_at}
              />
              <InterpretationVariantHeader
                case_type={caseEntity.data?.case_type}
                patientId={patientId}
                locus_id={occurrenceExpand?.data?.locus_id}
                hgvsg={occurrenceExpand?.data?.hgvsg}
                relationship_to_proband={relationshipToProband}
                analysis_catalog_code={caseEntity.data?.analysis_catalog_code}
                analysis_catalog_name={caseEntity.data?.analysis_catalog_name}
              />
              <InterpretationTranscript
                symbol={occurrenceExpand?.data?.symbol}
                picked_consequences={occurrenceExpand?.data?.picked_consequences}
                vep_impact={occurrenceExpand?.data?.vep_impact}
                aa_change={occurrenceExpand?.data?.aa_change}
                transcript_id={occurrenceExpand?.data?.transcript_id}
                is_canonical={occurrenceExpand?.data?.is_canonical}
                is_mane_select={occurrenceExpand?.data?.is_mane_select}
                is_mane_plus={occurrenceExpand?.data?.is_mane_plus}
                exon_rank={occurrenceExpand?.data?.exon_rank}
                exon_total={occurrenceExpand?.data?.exon_total}
                dna_change={occurrenceExpand?.data?.dna_change}
                rsnumber={occurrenceExpand?.data?.rsnumber}
              />
              <div className="grid gap-6 grid-cols-12">
                <div className="rounded-sm col-span-7 border p-6 bg-muted">
                  <InterpretationFormSomatic
                    ref={somaticFormRef}
                    interpretation={interpretation.data}
                    saveInterpretation={interpretation =>
                      saveInterpretation.trigger({
                        caseId: caseId.toString(),
                        seqId: seqId.toString(),
                        locusId,
                        transcriptId: transcriptId ?? '',
                        interpretationSomatic: interpretation,
                      })
                    }
                    onDirtyChange={setIsDirty}
                  />
                </div>
                <div className="rounded-sm col-span-5 border py-4 px-6">
                  <div className="space-y-4">
                    <ClassificationSection clinvar={occurrenceExpand.data?.clinvar} />
                    <SomaticFrequencySection
                      somatic_pc_tn_wgs={occurrenceExpand.data?.somatic_pc_tn_wgs}
                      somatic_pn_tn_wgs={occurrenceExpand.data?.somatic_pn_tn_wgs}
                      somatic_pf_tn_wgs={occurrenceExpand.data?.somatic_pf_tn_wgs}
                      locusId={occurrenceExpand.data?.locus_id}
                    />
                    <GeneSection
                      gnomad_pli={occurrenceExpand.data?.gnomad_pli}
                      gnomad_loeuf={occurrenceExpand.data?.gnomad_loeuf}
                      revel_score={occurrenceExpand.data?.revel_score}
                      spliceai_type={occurrenceExpand.data?.spliceai_type}
                      spliceai_ds={occurrenceExpand.data?.spliceai_ds}
                      hgvsg={occurrenceExpand.data?.hgvsg}
                      transcript_id={occurrenceExpand.data?.transcript_id}
                    />
                    <ClinicalAssociationSection
                      omim_conditions={occurrenceExpand.data?.omim_conditions}
                      locus_id={locusId}
                    />
                  </div>
                </div>
              </div>
            </DialogBody>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">{t('variant.interpretation_form.cancel_text')}</Button>
              </DialogClose>
              <Button
                type="submit"
                color="primary"
                loading={saveInterpretation.isMutating}
                onClick={() => {
                  // Do not warn use if the interpretation is created. Only show if edited
                  if (isCreation) {
                    handleSave();
                    return;
                  }
                  alertDialog.open({
                    type: 'warning',
                    title: t('variant.interpretation_form.alert.title'),
                    description: t('variant.interpretation_form.alert.description'),
                    actionProps: {
                      children: t('variant.interpretation_form.alert.save'),
                      onClick: e => {
                        e.preventDefault();
                        handleSave();
                      },
                    },
                    cancelProps: {
                      children: t('variant.interpretation_form.alert.cancel'),
                    },
                  });
                }}
                disabled={!isDirty}
              >
                {t('variant.interpretation_form.ok_text')}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
export default SomaticInterpretationDialog;
