import BadgeCell from '@/components/base/data-table/cells/badge-cell';

import type { PatientVitalStatus } from '../../../api/patient';

type VitalStatusCellProps = {
  value: PatientVitalStatus;
};

function VitalStatusCell({ value }: VitalStatusCellProps) {
  return (
    <BadgeCell variant={value === 'alive' ? 'green' : 'neutral'} className="capitalize">
      {value}
    </BadgeCell>
  );
}

export default VitalStatusCell;
