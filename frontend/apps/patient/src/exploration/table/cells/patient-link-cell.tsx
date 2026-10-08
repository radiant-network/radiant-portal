import { Link } from 'react-router';

import AnchorLinkCell from '@/components/base/data-table/cells/anchor-link-cell';
import { useLocalPath } from '@/components/hooks/use-local-path';

import type { Patient } from '../../../api/patient';

type PatientLinkCellProps = {
  patient: Patient;
};

function PatientLinkCell({ patient }: PatientLinkCellProps) {
  const localPath = useLocalPath();
  const overviewPath = localPath(`/patient/entity/${patient.patient_id}`);
  return (
    <div>
      <AnchorLinkCell component={Link} to={overviewPath} className="font-medium">
        {patient.name}
      </AnchorLinkCell>
      <div className="text-muted-foreground text-xs">{patient.patient_id}</div>
    </div>
  );
}

export default PatientLinkCell;
