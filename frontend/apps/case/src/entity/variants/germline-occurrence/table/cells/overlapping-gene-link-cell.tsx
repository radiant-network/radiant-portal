import EmptyCell from '@/components/base/data-table/cells/empty-cell';
import AnchorLink from '@/components/base/navigation/anchor-link';

import type { CNVOccurrence } from '../../../constants';
import OverlappingGeneDialog from '../../overlapping-gene-dialog';

type OverlappingGeneLinkCellProps = {
  occurrence: CNVOccurrence;
  somatic?: boolean;
  children?: React.ReactElement;
};

function OverlappingGeneLinkCell({ occurrence, somatic, children }: OverlappingGeneLinkCellProps) {
  if (!children) return <EmptyCell />;
  if (!occurrence.symbol || occurrence.symbol.length === 0) return <div>{children}</div>;
  return (
    <OverlappingGeneDialog occurrence={occurrence} somatic={somatic}>
      <AnchorLink component="button" type="button" size="sm">
        {children}
      </AnchorLink>
    </OverlappingGeneDialog>
  );
}
export default OverlappingGeneLinkCell;
