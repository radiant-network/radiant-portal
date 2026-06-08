import { ReactNode, useCallback, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router';
import { toast } from 'sonner';
import useSWRMutation from 'swr/mutation';

import { CaseEntity, CaseSequencingExperiment, ExpandedGermlineSNVOccurrence, InterpretationGermline } from '@/api/api';
import { alertDialog } from '@/components/base/dialog/alert-dialog-store';
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
import {
  ClinicalAssociationCard,
  GeneCard,
  PredictionCard,
} from '@/components/base/slider/slider-variant-details-card';
import { Spinner } from '@/components/base/spinner';
import { useI18n } from '@/components/hooks/i18n';
import { caseApi, DEFAULT_TENANT, interpretationApi, occurrencesApi } from '@/utils/api';
import { useCaseIdFromParam, useSeqIdFromSearchParam } from '@/utils/helper';

import { SELECTED_VARIANT_PARAM } from '../../constants';
import InterpretationVariantHeader from '../../interpretation/header';
import InterpretationLastUpdatedBanner from '../../interpretation/last-updated-banner';
import { Interpretation, InterpretationFormRef } from '../../interpretation/types';

import GermlineInterpretationForm from './germline-interpretation-form';

type GermlineInterpretationDialogProps = {
  locusId: string;
  taskId: number;
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

type InterpretationGermlineInput = {
  caseId: string;
  seqId: string;
  locusId: string;
  transcriptId: string;
};

type ExpandGermlineInput = {
  caseId: number;
  seqId: number;
  taskId: number;
  locusId: string;
};

type GermlineInterpretationFormInput = {
  caseId: string;
  seqId: string;
  locusId: string;
  transcriptId: string;
  interpretationGermline: InterpretationGermline;
};

async function fetchCaseEntity(_url: string, { arg }: { arg: CaseEntityInput }) {
  const response = await caseApi.caseEntity(DEFAULT_TENANT, arg.caseId);
  return response.data;
}

async function fetchInterpretationGermline(_url: string, { arg }: { arg: InterpretationGermlineInput }) {
  const response = await interpretationApi.getInterpretationGermline(
    DEFAULT_TENANT,
    arg.caseId,
    arg.seqId,
    arg.locusId,
    arg.transcriptId,
  );
  return response.data;
}

async function fetchExpandedGermlineSNVOccurrence(_url: string, { arg }: { arg: ExpandGermlineInput }) {
  const response = await occurrencesApi.getExpandedGermlineSNVOccurrence(
    DEFAULT_TENANT,
    arg.caseId,
    arg.seqId,
    arg.taskId,
    arg.locusId,
  );
  return response.data;
}

async function saveGermlineInterpretation(_url: string, { arg }: { arg: GermlineInterpretationFormInput }) {
  const response = await interpretationApi.postInterpretationGermline(
    DEFAULT_TENANT,
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
  taskId,
  transcriptId,
  patientId,
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

  const caseEntity = useSWRMutation<CaseEntity, any, string, CaseEntityInput>('case-entity', fetchCaseEntity);

  const occurrenceExpand = useSWRMutation<ExpandedGermlineSNVOccurrence, any, string, ExpandGermlineInput>(
    `form-somatic-expand-${caseId}-${locusId}-${seqId}`,
    fetchExpandedGermlineSNVOccurrence,
  );

  const interpretation = useSWRMutation<Interpretation, any, string, InterpretationGermlineInput>(
    `form-somatic-interpretation-${seqId}-${locusId}-${transcriptId}`,
    fetchInterpretationGermline,
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
    () => interpretation.isMutating || occurrenceExpand?.isMutating,
    [interpretation.isMutating, occurrenceExpand?.isMutating],
  );

  const handleSave = useCallback(() => {
    germlineFormRef.current?.submit();
  }, [germlineFormRef]);

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
      taskId,
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
        className="overflow-hidden flex flex-col"
      >
        <DialogHeader>
          <DialogTitle>
            <InterpretationVariantHeader
              case_type={caseEntity.data?.case_type}
              patientId={patientId}
              locus_id={occurrenceExpand?.data?.locus_id}
              hgvsg={occurrenceExpand?.data?.hgvsg}
              relationship_to_proband={relationshipToProband}
              seqId={seqId}
            />
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <DialogBody className="flex items-center justify-center">
            <Spinner size={32} />
          </DialogBody>
        ) : (
          <>
            <DialogBody className="flex-1 min-h-0 overflow-y-auto space-y-6 max-h-none">
              <InterpretationLastUpdatedBanner
                updated_by_name={interpretation.data?.updated_by_name}
                updated_at={interpretation.data?.updated_at}
              />
              <div className="grid gap-6 grid-cols-12">
                <div className="rounded-sm col-span-7 border p-6 bg-muted">
                  <GermlineInterpretationForm
                    ref={germlineFormRef}
                    interpretation={interpretation.data}
                    saveInterpretation={interpretation =>
                      saveInterpretation.trigger({
                        caseId: caseId.toString(),
                        seqId: seqId.toString(),
                        locusId,
                        transcriptId: transcriptId ?? '',
                        interpretationGermline: interpretation,
                      })
                    }
                    onDirtyChange={setIsDirty}
                  />
                </div>
                <div className="col-span-5 flex flex-col gap-3">
                  <GeneCard
                    symbol={occurrenceExpand?.data?.symbol}
                    aa_change={occurrenceExpand?.data?.aa_change}
                    ensembl_gene_id={occurrenceExpand?.data?.ensembl_gene_id}
                    vep_impact={occurrenceExpand?.data?.vep_impact}
                    picked_consequences={occurrenceExpand?.data?.picked_consequences}
                    dna_change={occurrenceExpand?.data?.dna_change}
                    transcript_id={occurrenceExpand?.data?.transcript_id}
                    is_mane_select={occurrenceExpand?.data?.is_mane_select}
                    is_canonical={occurrenceExpand?.data?.is_canonical}
                    exon_rank={occurrenceExpand?.data?.exon_rank}
                    exon_total={occurrenceExpand?.data?.exon_total}
                    rsnumber={occurrenceExpand?.data?.rsnumber}
                  />
                  <PredictionCard
                    type="germline"
                    germline_pc_wgs_affected={occurrenceExpand?.data?.germline_pc_wgs_affected}
                    germline_pn_wgs_affected={occurrenceExpand?.data?.germline_pn_wgs_affected}
                    germline_pf_wgs_affected={occurrenceExpand?.data?.germline_pf_wgs_affected}
                    germline_pc_wgs_not_affected={occurrenceExpand?.data?.germline_pc_wgs_not_affected}
                    germline_pn_wgs_not_affected={occurrenceExpand?.data?.germline_pn_wgs_not_affected}
                    germline_pf_wgs_not_affected={occurrenceExpand?.data?.germline_pf_wgs_not_affected}
                    cadd_phred={occurrenceExpand?.data?.cadd_phred}
                    cadd_score={occurrenceExpand?.data?.cadd_score}
                    dann_score={occurrenceExpand?.data?.dann_score}
                    lrt_pred={occurrenceExpand?.data?.lrt_pred}
                    lrt_score={occurrenceExpand?.data?.lrt_score}
                    sift_pred={occurrenceExpand?.data?.sift_pred}
                    sift_score={occurrenceExpand?.data?.sift_score}
                    fathmm_pred={occurrenceExpand?.data?.fathmm_pred}
                    fathmm_score={occurrenceExpand?.data?.fathmm_score}
                    revel_score={occurrenceExpand?.data?.revel_score}
                    polyphen2_hvar_pred={occurrenceExpand?.data?.polyphen2_hvar_pred}
                    polyphen2_hvar_score={occurrenceExpand?.data?.polyphen2_hvar_score}
                    clinvar={occurrenceExpand?.data?.clinvar}
                    exomiser_acmg_classification_counts={occurrenceExpand?.data?.exomiser_acmg_classification_counts}
                    interpretation_classification_counts={occurrenceExpand?.data?.interpretation_classification_counts}
                    gnomad_pli={occurrenceExpand?.data?.gnomad_pli}
                    gnomad_loeuf={occurrenceExpand?.data?.gnomad_loeuf}
                    ensembl_gene_id={occurrenceExpand?.data?.ensembl_gene_id}
                    spliceai_type={occurrenceExpand?.data?.spliceai_type}
                    spliceai_ds={occurrenceExpand?.data?.spliceai_ds}
                    hgvsg={occurrenceExpand?.data?.hgvsg}
                    gnomad_v3_af={occurrenceExpand?.data?.gnomad_v3_af}
                    locus={occurrenceExpand?.data?.locus}
                    locusId={locusId}
                  />
                  <ClinicalAssociationCard
                    omim_conditions={occurrenceExpand?.data?.omim_conditions}
                    locus_id={locusId}
                  />
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
