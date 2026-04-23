import { ReactNode, useCallback, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router';
import { toast } from 'sonner';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';

import {
  ApiError,
  CaseEntity,
  CaseSequencingExperiment,
  ExpandedGermlineSNVOccurrence,
  InterpretationGermline,
} from '@/api/api';
import { alertDialog } from '@/components/base/dialog/alert-dialog-store';
import ClassificationSection from '@/components/base/occurrence/classification-section';
import ClinicalAssociationSection from '@/components/base/occurrence/clinical-association-section';
import GeneSection from '@/components/base/occurrence/gene-section';
import GermlineFrequencySection from '@/components/base/occurrence/germline-frequency-section';
import PredictionSection from '@/components/base/occurrence/prediction-section';
import ZygositySection from '@/components/base/occurrence/zygosity-section';
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

import InterpretationFormGermline from './interpretation-form-germline';

type GermlineInterpretationDialogProps = {
  locusId: string;
  transcriptId?: string;
  handleSaveCallback?: () => void;
  renderTrigger: (handleOpen: () => void) => ReactNode;
  isCreation?: boolean;
};

type CaseEntityInput = {
  key: string;
  caseId: number;
};

type InterpretationGermlineInput = {
  caseId: string;
  seqId: string;
  locusId: string;
  transcriptId: string;
};

type ExpandGermlineInput = {
  caseId: number;
  seqId: number;
  locusId: string;
};

type GermlineInterpretationFormInput = {
  caseId: string;
  seqId: string;
  locusId: string;
  transcriptId: string;
  interpretationGermline: InterpretationGermline;
};

async function fetchCaseEntity(input: CaseEntityInput) {
  const response = await caseApi.caseEntity(input.caseId);
  return response.data;
}

async function fetchInterpretationGermline(input: InterpretationGermlineInput) {
  const response = await interpretationApi.getInterpretationGermline(
    input.caseId,
    input.seqId,
    input.locusId,
    input.transcriptId,
  );
  return response.data;
}

async function fetchExpandedGermlineSNVOccurrence(input: ExpandGermlineInput) {
  const response = await occurrencesApi.getExpandedGermlineSNVOccurrence(input.caseId, input.seqId, input.locusId);
  return response.data;
}

async function saveGermlineInterpretation(_url: string, { arg }: { arg: GermlineInterpretationFormInput }) {
  const response = await interpretationApi.postInterpretationGermline(
    arg.caseId,
    arg.seqId,
    arg.locusId,
    arg.transcriptId,
    arg.interpretationGermline,
  );
  return response.data;
}

function GermlineInterpretationDialog({
  locusId,
  transcriptId,
  handleSaveCallback,
  renderTrigger,
  isCreation = false,
}: GermlineInterpretationDialogProps) {
  const { t } = useI18n();
  const [searchParams, setSearchParams] = useSearchParams();
  const [open, setOpen] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const germlineFormRef = useRef<InterpretationFormRef>(null);
  const caseId = useCaseIdFromParam();
  const seqId = useSeqIdFromSearchParam();

  const caseEntity = useSWR<CaseEntity, ApiError, CaseEntityInput>(
    {
      key: 'case-entity',
      caseId,
    },
    fetchCaseEntity,
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    },
  );

  const occurrenceExpand = useSWR<ExpandedGermlineSNVOccurrence>(
    {
      caseId,
      locusId,
      seqId,
    },
    fetchExpandedGermlineSNVOccurrence,
    {
      revalidateOnFocus: false,
      revalidateOnMount: false,
      shouldRetryOnError: false,
    },
  );

  const interpretation = useSWR<Interpretation>(
    {
      key: `fetch-germline-interpretation-${seqId}-${locusId}-${transcriptId}`,
      caseId,
      seqId,
      locusId,
      transcriptId,
    },
    fetchInterpretationGermline,
    {
      revalidateOnFocus: false,
      revalidateOnMount: true,
      shouldRetryOnError: false,
    },
  );

  const saveInterpretation = useSWRMutation(
    `save-germline-interpretation-${seqId}-${locusId}-${transcriptId}`,
    saveGermlineInterpretation,
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
    () => interpretation.isLoading || occurrenceExpand?.isLoading,
    [interpretation.isLoading, occurrenceExpand?.isLoading],
  );

  const handleSave = useCallback(() => {
    germlineFormRef.current?.submit();
  }, [germlineFormRef]);

  const handleOpen = useCallback(async () => {
    setOpen(true);
    interpretation.mutate();
    occurrenceExpand?.mutate();
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
                seq_id={seqId}
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
                  <InterpretationFormGermline
                    ref={germlineFormRef}
                    interpretation={interpretation.data}
                    saveInterpretation={interpretation =>
                      saveInterpretation.trigger({
                        caseId,
                        seqId,
                        locusId,
                        transcriptId,
                        interpretationGermline: interpretation,
                      })
                    }
                    onDirtyChange={setIsDirty}
                  />
                </div>
                <div className="rounded-sm col-span-5 border py-4 px-6">
                  <div className="space-y-4">
                    <ClassificationSection clinvar={occurrenceExpand.data?.clinvar} />
                    <PredictionSection
                      exomiser_acmg_classification={occurrenceExpand.data?.exomiser_acmg_classification}
                      exomiser_acmg_evidence={occurrenceExpand.data?.exomiser_acmg_evidence}
                    />
                    <GermlineFrequencySection
                      germline_pc_wgs_affected={occurrenceExpand.data?.germline_pc_wgs_affected}
                      germline_pn_wgs_affected={occurrenceExpand.data?.germline_pn_wgs_affected}
                      germline_pf_wgs_affected={occurrenceExpand.data?.germline_pf_wgs_affected}
                      germline_pc_wgs_not_affected={occurrenceExpand.data?.germline_pc_wgs_not_affected}
                      germline_pn_wgs_not_affected={occurrenceExpand.data?.germline_pn_wgs_not_affected}
                      germline_pf_wgs_not_affected={occurrenceExpand.data?.germline_pf_wgs_not_affected}
                      gnomad_v3_af={occurrenceExpand.data?.gnomad_v3_af}
                      locus={occurrenceExpand.data?.locus}
                    />
                    <ZygositySection
                      zygosity={occurrenceExpand.data?.zygosity}
                      transmission={occurrenceExpand.data?.transmission}
                      parental_origin={occurrenceExpand.data?.parental_origin}
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
export default GermlineInterpretationDialog;
