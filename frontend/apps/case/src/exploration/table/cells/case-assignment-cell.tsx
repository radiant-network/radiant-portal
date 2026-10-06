import type { CaseResult } from '@/api/api';
import type { AppFeatures, CellContext } from '@/components/base/data-table/data-table';

import CaseAssignment from '../../../components/case-assignment';

type CaseAssignmentCellProps = CellContext<AppFeatures, CaseResult, any> & { onSaved?: () => void };

function CaseAssignmentCell({ row, onSaved }: CaseAssignmentCellProps) {
  const { case_id, diagnosis_lab_code, assignees } = row.original;

  // Keyed by case: table cells are recycled across rows.
  return (
    <CaseAssignment
      key={case_id}
      caseId={case_id}
      diagnosisLabCode={diagnosis_lab_code}
      assignees={assignees}
      size="xs"
      onSaved={onSaved}
    />
  );
}

export default CaseAssignmentCell;
