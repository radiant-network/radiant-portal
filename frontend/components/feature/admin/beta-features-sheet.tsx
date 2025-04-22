import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetFooter,
  SheetTitle,
} from '@/components/base/ui/sheet';
import BetaFeatures from './beta-features';
interface BetaFeaturesSheetProps {
  className?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BetaFeaturesSheet({ className, open, onOpenChange }: BetaFeaturesSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className={`w-[400px] sm:w-[340px] ${className}`}>
        <SheetHeader>
          <SheetTitle>Admin - Beta Features</SheetTitle>
          <SheetDescription>Enable or disable beta features for your application.</SheetDescription>
        </SheetHeader>
        <BetaFeatures />
        <SheetFooter className={className}></SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
export default BetaFeaturesSheet;
