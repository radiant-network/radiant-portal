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
import { useCallback, useState } from 'react';
import { InterpretationGermline, InterpretationSomatic, Occurrence } from '@/api/api';
import { Spinner } from '@/components/base/spinner';
import InterpretationFormSomatic from './interpretation-form-somatic';
import InterpretationLastUpdatedBanner from './last-updated-banner';
import InterpretationVariantHeader from './variant-header';

type InterpretationDialogButtonProps = ButtonProps & {
  occurence: Occurrence;
};

function InterpretationDialogButton({ occurence, ...buttonProps }: InterpretationDialogButtonProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [interpretation, setInterpretation] = useState<InterpretationGermline | InterpretationSomatic | null>(null);

  const handleOpen = useCallback(() => {
    setOpen(true);
    // Fetch interpretation data
  }, []);

  const isSomatic = false;

  /**
   * TODO: Add logic to know if the interpretation is germline or somatic
   * and display the correct form
   */

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button color="primary" onClick={handleOpen} {...buttonProps}>
        <Edit2Icon /> Interpret
      </Button>
      <DialogContent
        className="max-w-[calc(100vw-48px)] min-h-[calc(100vh-48px)] w-[1200px]"
        onEscapeKeyDown={e => e.preventDefault()}
      >
        {fetching ? (
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
              <InterpretationLastUpdatedBanner />
              <InterpretationVariantHeader occurence={occurence} />
              <div className="grid gap-6 grid-cols-12">
                <div className="col-span-7 border border-border p-6 bg-gray-100">
                  {isSomatic ? <InterpretationFormSomatic /> : <InterpretationFormGermline />}
                </div>
                <div className="col-span-5 border border-border py-4 px-6"></div>
              </div>
            </div>
            <Separator className="mb-6" />
            <DialogFooter>
              <DialogClose asChild>
                <Button>Cancel</Button>
              </DialogClose>
              <Button color="primary">Save</Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default InterpretationDialogButton;
