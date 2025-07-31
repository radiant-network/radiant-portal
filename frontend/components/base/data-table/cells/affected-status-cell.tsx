
import AffectedStatusBadge, { AffectedStatusBadgeProps } from '../../badges/affected-status-badge';
import EmptyCell from './empty-cell';

function AffectedStatusCell({ status, ...props }: AffectedStatusBadgeProps) {
  if (!status) return <EmptyCell />;
  return <AffectedStatusBadge status={status} {...props} />;
}

export default AffectedStatusCell;
