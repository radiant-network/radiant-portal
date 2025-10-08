import { GermlineSNVOccurrence } from '@/api/api';
import AnchorLink from '@/components/base/navigation/anchor-link';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/base/ui/sheet';

import OccurrenceSheetContent from './occurence-sheet-content';

type OccurenceSheetProps = {
  setOpen: (value: boolean) => void;
  open: boolean;
  occurrence: GermlineSNVOccurrence;
  children?: React.ReactElement;
};

function OccurenceSheet({ children, open, occurrence, setOpen }: OccurenceSheetProps) {
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent side="right" className="max-w-[800px] sm:max-w-[1100px] w-full space-y-4 overflow-y-auto">
        <SheetHeader>
          <SheetTitle>
            <AnchorLink href={`/variants/entity/${occurrence.locus_id}`} size="lg" target="_blank" external>
              <span className="max-w-72 overflow-hidden text-ellipsis">{occurrence.hgvsg}</span>
            </AnchorLink>
          </SheetTitle>
        </SheetHeader>
        {<OccurrenceSheetContent occurrence={occurrence} />}
      </SheetContent>
    </Sheet>
  );
}

export default OccurenceSheet;
