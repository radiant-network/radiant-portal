import { useState } from 'react';

import { GermlineSNVOccurrence } from '@/api/api';
import AnchorLink from '@/components/base/navigation/anchor-link';

import OccurrenceSheet from '../../sheet/occurrence-sheet';

type HgvsgCellProps = {
  occurrence: GermlineSNVOccurrence;
};

function HgvsgCell({ occurrence }: HgvsgCellProps) {
  const [open, setOpen] = useState(false);

  return (
    <OccurrenceSheet open={open} setOpen={setOpen} occurrence={occurrence}>
      <AnchorLink size="sm" variant="secondary" className="overflow-hidden text-ellipsis block">
        {occurrence.hgvsg}
      </AnchorLink>
    </OccurrenceSheet>
  );
}

export default HgvsgCell;
