import { Occurrence } from '@/api/api';
import AnchorLink from '@/components/base/navigation/anchor-link';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/base/ui/sheet';
import { useState } from 'react';
import OccurrenceSheetContent from '../occurence-sheet-content';

type HgvsgCellProps = {
  occurrence: Occurrence;
};

function HgvsgCell({ occurrence }: HgvsgCellProps) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <AnchorLink size="sm" variant="secondary" className="overflow-hidden text-ellipsis block">
          {occurrence.hgvsg}
        </AnchorLink>
      </SheetTrigger>
      <SheetContent side="right" className="max-w-[800px] sm:max-w-[1100px] w-full space-y-4 overflow-y-auto">
        <SheetHeader>
          <SheetTitle>
            <AnchorLink href={`/variants/entity/${occurrence.locus_id}`} size="lg" target="_blank" external>
              <span className="max-w-72 overflow-hidden text-ellipsis">{occurrence.hgvsg}</span>
            </AnchorLink>
          </SheetTitle>
        </SheetHeader>
        <OccurrenceSheetContent occurrence={occurrence} />
      </SheetContent>
    </Sheet>
  );
}

export default HgvsgCell;
