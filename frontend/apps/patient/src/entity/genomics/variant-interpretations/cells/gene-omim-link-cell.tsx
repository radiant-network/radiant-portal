import AnchorLinkCell from '@/components/base/data-table/cells/anchor-link-cell';
import EmptyCell from '@/components/base/data-table/cells/empty-cell';
import { getOmimOrgUrl } from '@/components/base/variant/utils';

type GeneOmimLinkCellProps = {
  symbol?: string;
};

function GeneOmimLinkCell({ symbol }: GeneOmimLinkCellProps) {
  if (!symbol) return <EmptyCell />;

  return (
    <AnchorLinkCell href={getOmimOrgUrl({ symbol })} target="_blank" rel="noreferrer">
      {symbol}
    </AnchorLinkCell>
  );
}

export default GeneOmimLinkCell;
