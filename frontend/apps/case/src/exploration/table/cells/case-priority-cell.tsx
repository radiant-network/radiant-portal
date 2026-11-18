import type { CaseResult } from '@/api/api';
import PriorityIndicatorCell from '@/components/base/data-table/cells/priority-indicator-cell';
import type { AppFeatures, CellContext } from '@/components/base/data-table/data-table';
import CasePriorityDropdown, { isCasePriority } from '@/components/base/dropdowns/case-priority-dropdown';
import type { PriorityIndicatorCode } from '@/components/base/indicators/priority-indicator';

import { useCanEditCase } from '../../../permissions/use-case-permissions';

function CasePriorityCell({ row }: CellContext<AppFeatures, CaseResult, any>) {
  const { case_id, priority_code, diagnosis_lab_code } = row.original;
  const canEdit = useCanEditCase(diagnosis_lab_code);

  if (canEdit && isCasePriority(priority_code)) {
    return <CasePriorityDropdown caseId={case_id} priority={priority_code} />;
  }

  return <PriorityIndicatorCell code={priority_code as PriorityIndicatorCode | undefined} />;
}

export default CasePriorityCell;
