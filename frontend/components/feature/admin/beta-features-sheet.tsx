import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetTrigger,
} from '@/components/base/ui/sheet';
import BetaFeatures from './beta-features';
interface BetaFeaturesSheetProps {
  className?: string;
  trigger?: React.ReactNode;
}

export function BetaFeaturesSheet({ className, trigger }: BetaFeaturesSheetProps) {
  return (
    <Sheet>
      <SheetTrigger className={`flex items-center space-x-1 text-destructive ${className}`} asChild>
        {trigger}
      </SheetTrigger>
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
