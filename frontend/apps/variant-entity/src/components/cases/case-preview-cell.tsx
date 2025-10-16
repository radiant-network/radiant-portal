import { useState } from 'react';

import RelationshipToProbandCell from '@/components/base/data-table/cells/relationship-to-proband-cell';
import AnchorLink from '@/components/base/navigation/anchor-link';

import CasePreviewSheet from '@/components/feature/preview/case-preview-sheet';

type CasePreviewCellProps = {
  seqId: number;
  locusId: string;
  caseId: string;
  relationshipToProband: string | undefined;
};

function CasePreviewCell({ seqId, locusId, caseId, relationshipToProband }: CasePreviewCellProps) {
  const [open, setOpen] = useState(false);

  return (
    <CasePreviewSheet seqId={seqId} locusId={locusId} open={open} setOpen={setOpen}>
      <span>
        <RelationshipToProbandCell relationship={relationshipToProband}>
          <AnchorLink mono size="xs" variant="secondary">
            {caseId}
          </AnchorLink>
        </RelationshipToProbandCell>
      </span>
    </CasePreviewSheet>
  );
}

export default CasePreviewCell;
