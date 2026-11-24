import type { SomaticCNVOccurrence } from '@/api/api';

import OccurrenceFlagCell from '../../../table/cells/occurrence-flag-cell';
import OccurrenceNoteCell from '../../../table/cells/occurrence-note-cell';

type SomaticCNVRowInfoCellProps = {
  occurrence: SomaticCNVOccurrence;
  caseId?: number;
};

function SomaticCNVRowInfoCell({ occurrence, caseId }: SomaticCNVRowInfoCellProps) {
  return (
    <div className="flex items-center gap-1">
      <OccurrenceNoteCell
        taskId={occurrence.task_id}
        occurrenceId={occurrence.cnv_id}
        seqId={occurrence.seq_id}
        hasNote={occurrence.has_note}
      />
      <OccurrenceFlagCell
        caseId={caseId}
        taskId={occurrence.task_id}
        seqId={occurrence.seq_id}
        occurrenceId={occurrence.cnv_id}
        flag={occurrence.flag_type}
      />
    </div>
  );
}

export default SomaticCNVRowInfoCell;
