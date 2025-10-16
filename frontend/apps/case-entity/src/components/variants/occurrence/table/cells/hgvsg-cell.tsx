import { useState } from 'react';

import { GermlineSNVOccurrence } from '@/api/api';
import AnchorLink from '@/components/base/navigation/anchor-link';

import OccurencePreviewSheet from '@/components/feature/preview/occurence-preview-sheet';

type HgvsgCellProps = {
  occurrence: GermlineSNVOccurrence;
};

function HgvsgCell({ occurrence }: HgvsgCellProps) {
  const [open, setOpen] = useState(false);

  return (
    <OccurencePreviewSheet occurrence={occurrence} open={open} setOpen={setOpen}>
      <AnchorLink size="sm" variant="secondary" className="overflow-hidden text-ellipsis block">
        {occurrence.hgvsg}
      </AnchorLink>
    </OccurencePreviewSheet>
  );
}

export default HgvsgCell;
