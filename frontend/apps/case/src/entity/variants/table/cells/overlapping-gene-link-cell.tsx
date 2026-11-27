import type { GermlineCNVOccurrence, SomaticCNVOccurrence } from '@/api/api';
import EmptyCell from '@/components/base/data-table/cells/empty-cell';
import AnchorLink from '@/components/base/navigation/anchor-link';

import OverlappingGeneDialog, { type FetchCNVGenesOverlap } from '../../modals/overlapping-gene-dialog';

type OverlappingGeneLinkCellProps = {
  occurrence: GermlineCNVOccurrence | SomaticCNVOccurrence;
  fetchGenesOverlap: FetchCNVGenesOverlap;
  children?: React.ReactElement;
};

function OverlappingGeneLinkCell({ occurrence, fetchGenesOverlap, children }: OverlappingGeneLinkCellProps) {
  if (!children) return <EmptyCell />;
  if (!occurrence.symbol || occurrence.symbol.length === 0) return <div>{children}</div>;
  return (
    <OverlappingGeneDialog occurrence={occurrence} fetchGenesOverlap={fetchGenesOverlap}>
      <AnchorLink component="button" type="button" size="sm">
        {children}
      </AnchorLink>
    </OverlappingGeneDialog>
  );
}
export default OverlappingGeneLinkCell;
