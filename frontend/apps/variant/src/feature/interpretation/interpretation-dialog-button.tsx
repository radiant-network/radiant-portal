import { Button, ButtonProps } from '@/components/base/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/base/ui/dialog';
import { Separator } from '@/components/base/ui/separator';
import { Edit2Icon } from 'lucide-react';
import InterpretationFormGermline from './interpretation-form-germline';
import { useCallback, useRef, useState } from 'react';
import { Occurrence } from '@/api/api';
import InterpretationFormSomatic from './interpretation-form-somatic';
import InterpretationLastUpdatedBanner from './last-updated-banner';
import InterpretationVariantHeader from './variant-header';
import { useInterpretationHelper } from './hook';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import { Interpretation, InterpretationFormRef } from './types';
import { Spinner } from '@/components/base/spinner';

type InterpretationDialogButtonProps = ButtonProps & {
  occurence: Occurrence;
};

// Temporary flag to switch between somatic and germline interpretation forms
// In the future, this should be determined based on the occurrence type or other criteria
const isSomatic = false;

function InterpretationDialogButton({ occurence, ...buttonProps }: InterpretationDialogButtonProps) {
  const [open, setOpen] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const gerlimeFormRef = useRef<InterpretationFormRef>(null);
  const somaticFormRef = useRef<InterpretationFormRef>(null);
  const { fetch, save } = useInterpretationHelper(occurence, isSomatic);

  const uniqueKey = `interpretation-${occurence.seq_id}-${occurence.locus_id}-${occurence.transcript_id}`;

  const fetchInterpretation = useSWR<Interpretation>(uniqueKey, fetch, {
    revalidateOnFocus: false,
    revalidateOnMount: false,
    shouldRetryOnError: false,
  });

  const saveInterpretation = useSWRMutation<
    Interpretation, // Data
    any, // Error
    string, // Key
    { interpretation: Interpretation }, // ExtraArg
    Interpretation // SWRData
  >(uniqueKey, save, {
    onSuccess: () => {
      // close modal or show success message
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
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button color="primary" onClick={handleOpen} {...buttonProps}>
        <Edit2Icon /> Interpret
      </Button>
      <DialogContent
        className="max-w-[calc(100vw-48px)] min-h-[calc(100vh-48px)] w-[1200px]"
        onEscapeKeyDown={e => e.preventDefault()}
      >
        {fetchInterpretation.isLoading ? (
          <div className="flex items-center justify-center">
            <Spinner size={32} />
          </div>
        ) : (
          <div>
            <DialogHeader>
              <DialogTitle>Clinical Interpretation</DialogTitle>
            </DialogHeader>
            <Separator className="mt-6" />
            <div className="py-6 overflow-scroll space-y-6 h-[calc(95vh-150px)]">
              <InterpretationLastUpdatedBanner interpretation={fetchInterpretation.data} />
              <InterpretationVariantHeader occurence={occurence} />
              <div className="grid gap-6 grid-cols-12">
                <div className="col-span-7 border p-6 bg-slate-100">
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
                <div className="col-span-5 border py-4 px-6"></div>
              </div>
            </div>
            <Separator className="mb-6" />
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button
                type="submit"
                color="primary"
                loading={saveInterpretation.isMutating}
                onClick={handleSave}
                disabled={!isDirty}
              >
                Save
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default InterpretationDialogButton;
