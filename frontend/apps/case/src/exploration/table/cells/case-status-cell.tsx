import type { CaseResult } from '@/api/api';
import EmptyCell from '@/components/base/data-table/cells/empty-cell';
import type { AppFeatures, CellContext } from '@/components/base/data-table/data-table';
import CaseStatusDropdown from '@/components/base/dropdowns/case-status-dropdown';

import { useCanEditCase } from '../../../permissions/use-case-permissions';

function CaseStatusCell({ row }: CellContext<AppFeatures, CaseResult, any>) {
  const { case_id, status_code, diagnosis_lab_code } = row.original;
  const canEdit = useCanEditCase(diagnosis_lab_code);
  if (!status_code) return <EmptyCell />;

  return <CaseStatusDropdown caseId={case_id} status={status_code} canEdit={canEdit} />;
}

export default CaseStatusCell;
