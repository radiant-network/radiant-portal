import { Button } from '@/components/base/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/base/ui/dialog';
import { Separator } from '@/components/base/ui/separator';
import { Alert, AlertDescription } from '@/components/base/ui/alert';
import { Edit2Icon, InfoIcon } from 'lucide-react';
import InterpretationFormGermline from './interpretation-form-germline';

const InterpretationDialogBtn = () => {
  /**
   * TODO: Add logic to know if the interpretation is germline or somatic
   * and display the correct form
   */

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button color="primary" size="xs">
          <Edit2Icon /> Interpret
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[calc(100vw-48px)] w-[1200px]" onEscapeKeyDown={e => e.preventDefault()}>
        <div className="flex flex-col">
          <DialogHeader>
            <DialogTitle>Clinical Interpretation</DialogTitle>
          </DialogHeader>
          <Separator className="mt-6" />
          <div className="py-6 overflow-scroll space-y-6 h-[calc(95vh-160px)]">
            <Alert variant="info" className="flex gap-2 items-center">
              <div>
                <InfoIcon size={16} />
              </div>
              <AlertDescription className="text-foreground">
                Last update: <strong>René Allard</strong> (March 4, 2025, 8h53)
              </AlertDescription>
            </Alert>
            <div className="grid gap-6 grid-cols-12">
              <div className="col-span-7 border p-6 bg-gray-100">
                <InterpretationFormGermline />
              </div>
              <div className="col-span-5 border py-4 px-6"></div>
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
      </DialogContent>
    </Dialog>
  );
};

export default InterpretationDialogBtn;
