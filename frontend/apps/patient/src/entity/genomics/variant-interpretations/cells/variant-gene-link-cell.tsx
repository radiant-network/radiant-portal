import { Link } from 'react-router';

import AnchorLinkCell from '@/components/base/data-table/cells/anchor-link-cell';
import { useLocalPath } from '@/components/hooks/use-local-path';

type VariantGeneLinkCellProps = {
  gene: string;
  locusId: string;
};

function VariantGeneLinkCell({ gene, locusId }: VariantGeneLinkCellProps) {
  const localPath = useLocalPath();
  return (
    <AnchorLinkCell component={Link} to={localPath(`/variants/entity/${locusId}`)}>
      {gene}
    </AnchorLinkCell>
  );
}

export default VariantGeneLinkCell;
