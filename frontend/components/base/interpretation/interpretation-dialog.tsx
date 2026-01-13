import { ReactNode, useCallback, useRef, useState } from 'react';
import { toast } from 'sonner';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';

import { ApiError, CaseEntity, ExpandedGermlineSNVOccurrence } from '@/api/api';
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
import { Spinner } from '@/components/base/spinner';
import { useI18n } from '@/components/hooks/i18n';
import { caseApi, occurrencesApi } from '@/utils/api';
import { useCaseIdFromParam } from '@/utils/helper';

import InterpretationVariantHeader from './header';
import { useInterpretationHelper } from './hook';
import InterpretationFormGermline from './interpretation-form-germline';
import InterpretationFormSomatic from './interpretation-form-somatic';
import InterpretationLastUpdatedBanner from './last-updated-banner';
import OccurrenceDetails from './occurrence-details';
import InterpretationTranscript from './transcript';
import { Interpretation, InterpretationFormRef } from './types';

type InterpretationDialogButtonProps = {
  seqId: number;
  locusId: string;
  transcriptId?: string;
  handleSaveCallback?: () => void;
  renderTrigger: (handleOpen: () => void) => ReactNode;
};

// Temporary flag to switch between somatic and germline interpretation forms
// In the future, this should be determined based on the occurrence type or other criteria
const isSomatic = false;

type CaseEntityInput = {
  key: string;
  caseId: number;
};

async function fetchCaseEntity(input: CaseEntityInput) {
  const response = await caseApi.caseEntity(input.caseId);
  return response.data;
}

function InterpretationDialog({
  seqId,
  locusId,
  transcriptId,
  handleSaveCallback,
  renderTrigger,
}: InterpretationDialogButtonProps) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const gerlimeFormRef = useRef<InterpretationFormRef>(null);
  const somaticFormRef = useRef<InterpretationFormRef>(null);
  const caseId = useCaseIdFromParam();
  const { fetch: fetchInterpretationHelper, save: saveInterpretationHelper } = useInterpretationHelper({
    caseId,
    seqId: seqId,
    locusId: locusId,
    transcriptId: transcriptId,
    isSomatic,
  });

  const { data: caseEntity } = useSWR<CaseEntity, ApiError, CaseEntityInput>(
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

  const interpretationUniqueKey = `interpretation-${seqId}-${locusId}-${transcriptId}`;

  const fetchOccurrenceExpand = useSWR<ExpandedGermlineSNVOccurrence | undefined>(
    {
      caseId,
      locusId,
      seqId,
    },
    async () => {
      if (caseId && seqId && locusId) {
        return occurrencesApi.getExpandedGermlineSNVOccurrence(caseId, seqId, locusId).then(response => response.data);
      }
      return undefined;
    },
    {
      revalidateOnFocus: false,
      revalidateOnMount: false,
      shouldRetryOnError: false,
    },
  );

  const fetchInterpretation = useSWR<Interpretation>(interpretationUniqueKey, fetchInterpretationHelper, {
    revalidateOnFocus: false,
    revalidateOnMount: false,
    shouldRetryOnError: false,
  });

  const saveInterpretation = useSWRMutation<
    Interpretation,
    any,
    string,
    { interpretation: Interpretation },
    Interpretation
  >(interpretationUniqueKey, saveInterpretationHelper, {
    onSuccess: () => {
      setOpen(false);
      handleSaveCallback && handleSaveCallback();
      toast(t('variant.interpretation_form.notification.success'));
    },
    onError: () => {
      setOpen(false);
      toast(t('variant.interpretation_form.notification.error.title'), {
        description: t('variant.interpretation_form.notification.error.text'),
      });
    },
  });

  const handleSave = useCallback(() => {
    if (isSomatic) {
      somaticFormRef.current?.submit();
    } else {
      gerlimeFormRef.current?.submit();
    }
  }, [somaticFormRef, gerlimeFormRef]);

  const handleOpen = useCallback(async () => {
    setOpen(true);
    fetchInterpretation.mutate();
    fetchOccurrenceExpand?.mutate();
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
        {fetchInterpretation.isLoading || fetchOccurrenceExpand?.isLoading ? (
          <DialogBody className="flex items-center justify-center">
            <Spinner size={32} />
          </DialogBody>
        ) : (
          <div>
            <DialogHeader>
              <DialogTitle>{t('variant.interpretation_form.title')}</DialogTitle>
            </DialogHeader>
            <DialogBody className="overflow-scroll space-y-6">
              <InterpretationLastUpdatedBanner interpretation={fetchInterpretation.data} />
              <InterpretationVariantHeader
                caseEntity={caseEntity}
                seqId={seqId}
                occurrence={fetchOccurrenceExpand?.data}
              />
              <InterpretationTranscript occurrence={fetchOccurrenceExpand?.data} />
              <div className="grid gap-6 grid-cols-12">
                <div className="rounded-sm col-span-7 border p-6 bg-muted">
                  {isSomatic ? (
                    <InterpretationFormSomatic
                      ref={somaticFormRef}
                      interpretation={fetchInterpretation.data}
                      saveInterpretation={interpretation =>
                        saveInterpretation.trigger({
                          interpretation,
                        })
                      }
                      onDirtyChange={setIsDirty}
                    />
                  ) : (
                    <InterpretationFormGermline
                      ref={gerlimeFormRef}
                      interpretation={fetchInterpretation.data}
                      saveInterpretation={interpretation =>
                        saveInterpretation.trigger({
                          interpretation,
                        })
                      }
                      onDirtyChange={setIsDirty}
                    />
                  )}
                </div>
                <div className="rounded-sm col-span-5 border py-4 px-6">
                  <OccurrenceDetails occurrence={fetchOccurrenceExpand?.data} />
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
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default InterpretationDialog;
