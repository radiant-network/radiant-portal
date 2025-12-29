import StatusBadge, { Status } from '../../badges/status-badge';

import EmptyCell from './empty-cell';

type StatusCellProps = {
  status: Status | undefined;
};

function StatusCell({ status }: StatusCellProps) {
  if (!status) return <EmptyCell />;
  return <StatusBadge status={status} />;
}

export default StatusCell;
