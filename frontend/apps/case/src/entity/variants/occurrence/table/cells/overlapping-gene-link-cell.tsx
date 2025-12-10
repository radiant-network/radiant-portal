import { GermlineCNVOccurrence } from '@/api/api';
import EmptyCell from '@/components/base/data-table/cells/empty-cell';
import AnchorLink from '@/components/base/navigation/anchor-link';

import OverlappingGeneDialog from '../../overlapping-gene-dialog';

type OverlappingGeneLinkCellProps = {
  occurrence: GermlineCNVOccurrence;
  children: React.ReactElement;
};

function OverlappingGeneLinkCell({ occurrence, children }: OverlappingGeneLinkCellProps) {
  if (!children) return <EmptyCell />;
  return (
    <OverlappingGeneDialog occurrence={occurrence}>
      <AnchorLink size="xs">{children}</AnchorLink>
    </OverlappingGeneDialog>
  );
}
export default OverlappingGeneLinkCell;
