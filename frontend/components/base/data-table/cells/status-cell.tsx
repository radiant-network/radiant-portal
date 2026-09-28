import type { CaseStatus } from '@/api/api';

import StatusBadge from '../../badges/status-badge';

import EmptyCell from './empty-cell';

type StatusCellProps = {
  status: CaseStatus | undefined;
};

function StatusCell({ status }: StatusCellProps) {
  if (!status) return <EmptyCell />;
  return <StatusBadge status={status} />;
}

export default StatusCell;
