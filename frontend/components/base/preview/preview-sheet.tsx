import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from '@/components/base/shadcn/sheet';

type PreviewSheetProps = {
  trigger?: React.ReactNode;
  children: React.ReactNode;
  open?: boolean;
  setOpen?: (open: boolean) => void;
  accessibilityTitle?: string;
  accessibilityDescription?: string;
};

function PreviewSheet({
  trigger,
  children,
  open,
  setOpen,
  accessibilityTitle,
  accessibilityDescription,
}: PreviewSheetProps) {
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      {trigger && <SheetTrigger asChild>{trigger}</SheetTrigger>}
      <SheetContent side="right" className="flex flex-col sm:max-w-2xl w-full gap-4 overflow-y-auto bg-muted">
        <SheetTitle className="sr-only">{accessibilityTitle || 'Preview Sheet Title'}</SheetTitle>
        <SheetDescription className="sr-only">
          {accessibilityDescription || 'Preview Sheet Description'}
        </SheetDescription>
        {children}
      </SheetContent>
    </Sheet>
  );
}

export default PreviewSheet;
