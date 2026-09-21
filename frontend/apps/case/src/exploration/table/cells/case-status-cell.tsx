import type { CaseResult } from '@/api/api';
import type { Status } from '@/components/base/badges/status-badge';
import EmptyCell from '@/components/base/data-table/cells/empty-cell';
import type { AppFeatures, CellContext } from '@/components/base/data-table/data-table';
import CaseStatusDropdown from '@/components/base/dropdowns/case-status-dropdown';

function CaseStatusCell({ row }: CellContext<AppFeatures, CaseResult, any>) {
  const { case_id, status_code } = row.original;
  if (!status_code) return <EmptyCell />;

  return <CaseStatusDropdown caseId={case_id} status={status_code as Status} />;
}

export default CaseStatusCell;
