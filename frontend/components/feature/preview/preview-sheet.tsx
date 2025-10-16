import { Sheet, SheetContent, SheetTrigger } from '@/components/base/ui/sheet';

type PreviewSheetProps = {
  trigger?: React.ReactNode;
  children: React.ReactNode;
  open?: boolean;
  setOpen?: (open: boolean) => void;
};

function PreviewSheet({ trigger, children, open, setOpen }: PreviewSheetProps) {
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      {trigger && <SheetTrigger asChild>{trigger}</SheetTrigger>}
      <SheetContent side="right" className="flex flex-col sm:max-w-2xl w-full gap-4 overflow-y-auto bg-muted">
        {children}
      </SheetContent>
    </Sheet>
  );
}

export default PreviewSheet;
