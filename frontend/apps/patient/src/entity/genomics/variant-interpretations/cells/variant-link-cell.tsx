import { Link } from 'react-router';

import AnchorLinkCell from '@/components/base/data-table/cells/anchor-link-cell';
import EmptyCell from '@/components/base/data-table/cells/empty-cell';
import { useLocalPath } from '@/components/hooks/use-local-path';

type VariantLinkCellProps = {
  hgvsg?: string;
  locusId: string;
};

function VariantLinkCell({ hgvsg, locusId }: VariantLinkCellProps) {
  const localPath = useLocalPath();

  if (!hgvsg) return <EmptyCell />;

  return (
    <AnchorLinkCell component={Link} to={localPath(`/variants/entity/${locusId}`)} mono>
      {hgvsg}
    </AnchorLinkCell>
  );
}

export default VariantLinkCell;
