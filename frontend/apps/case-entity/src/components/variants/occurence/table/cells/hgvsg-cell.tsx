import { useState } from 'react';

import { GermlineSNVOccurrence } from '@/api/api';
import AnchorLink from '@/components/base/navigation/anchor-link';

import OccurenceSheet from '../../sheet/occurence-sheet';

type HgvsgCellProps = {
  occurrence: GermlineSNVOccurrence;
};

function HgvsgCell({ occurrence }: HgvsgCellProps) {
  const [open, setOpen] = useState(false);

  return (
    <OccurenceSheet open={open} setOpen={setOpen} occurrence={occurrence}>
      <AnchorLink size="sm" variant="secondary" className="overflow-hidden text-ellipsis block">
        {occurrence.hgvsg}
      </AnchorLink>
    </OccurenceSheet>
  );
}

export default HgvsgCell;
