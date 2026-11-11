import { type PatientListItem, PatientListItemPatientIdTypeEnum } from '@/api/api';
import EmptyCell from '@/components/base/data-table/cells/empty-cell';

const MASKED_MRN = '*****';

type MrnCellProps = {
  patient: PatientListItem;
};

function MrnCell({ patient }: MrnCellProps) {
  if (!patient.can_read_phi) return <span className="font-mono text-xs">{MASKED_MRN}</span>;
  if (patient.patient_id_type !== PatientListItemPatientIdTypeEnum.Mrn) return <EmptyCell />;
  return <span className="font-mono text-xs">{patient.patient_id}</span>;
}

export default MrnCell;
