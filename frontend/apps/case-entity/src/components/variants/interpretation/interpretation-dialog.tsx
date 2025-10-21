import { ReactNode, useCallback, useRef, useState } from 'react';
import { toast } from 'sonner';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';

import { ExpandedGermlineSNVOccurrence, GermlineSNVOccurrence } from '@/api/api';
import { Spinner } from '@/components/base/spinner';
import { Button } from '@/components/base/ui/button';
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/base/ui/dialog';
import { useI18n } from '@/components/hooks/i18n';

import InterpretationVariantHeader from './header';
import { useInterpretationHelper, useOccurrenceExpandHelper } from './hook';
import InterpretationFormGermline from './interpretation-form-germline';
import InterpretationFormSomatic from './interpretation-form-somatic';
import InterpretationLastUpdatedBanner from './last-updated-banner';
import OccurrenceDetails from './occurrence-details';
import InterpretationTranscript from './transcript';
import { Interpretation, InterpretationFormRef } from './types';

type InterpretationDialogButtonProps = {
  occurrence: GermlineSNVOccurrence;
  handleSaveCallback?: () => void;
  renderTrigger: (handleOpen: () => void) => ReactNode;
};

// Temporary flag to switch between somatic and germline interpretation forms
// In the future, this should be determined based on the occurrence type or other criteria
const isSomatic = false;

function InterpretationDialog({ occurrence, handleSaveCallback, renderTrigger }: InterpretationDialogButtonProps) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const gerlimeFormRef = useRef<InterpretationFormRef>(null);
  const somaticFormRef = useRef<InterpretationFormRef>(null);
  const { fetch: fetchInterpretationHelper, save: saveInterpretationHelper } = useInterpretationHelper(
    occurrence,
    isSomatic,
  );
  const { fetch: fetchOccurrenceExpandHelper } = useOccurrenceExpandHelper(occurrence);

  const interpretationUniqueKey = `interpretation-${occurrence.seq_id}-${occurrence.locus_id}-${occurrence.transcript_id}`;
  const occurrenceUniqueKey = `occurrence-${occurrence.seq_id}-${occurrence.locus_id}`;

  const fetchOccurrenceExpand = useSWR<ExpandedGermlineSNVOccurrence>(
    occurrenceUniqueKey,
    fetchOccurrenceExpandHelper,
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
    fetchOccurrenceExpand.mutate();
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {renderTrigger(handleOpen)}
      <DialogContent
        className="max-w-[calc(100vw-60px)] min-h-[calc(100vh-60px)] w-[1200px]"
        onEscapeKeyDown={e => e.preventDefault()}
        variant="stickyBoth"
      >
        {fetchInterpretation.isLoading || fetchOccurrenceExpand.isLoading ? (
          <DialogBody className="flex items-center justify-center">
            <Spinner size={32} />
          </DialogBody>
        ) : (
          <div>
            <DialogHeader>
              <DialogTitle>{t('variant.interpretation_form.title')}</DialogTitle>
            </DialogHeader>
            <DialogBody className="overflow-scroll space-y-6 h-[calc(95vh-150px)]">
              <InterpretationLastUpdatedBanner interpretation={fetchInterpretation.data} />
              <InterpretationVariantHeader occurrence={occurrence} />
              <InterpretationTranscript occurrence={fetchOccurrenceExpand.data} />
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
                  <OccurrenceDetails occurrence={fetchOccurrenceExpand.data} />
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
                onClick={handleSave}
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
