import EmptyCell from './empty-cell';
import AssayStatusBadge, { AssayStatus } from '../../badges/assay-status-badge';

type StatusCellProps = {
  status: AssayStatus | undefined;
};

function AssayStatusCell({ status }: StatusCellProps) {
  if (!status) return <EmptyCell />;
  return <AssayStatusBadge status={status} />;
}

export default AssayStatusCell;
