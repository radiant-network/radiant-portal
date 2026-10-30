import type { PatientListItemVitalStatusEnum } from '@/api/api';
import BadgeCell from '@/components/base/data-table/cells/badge-cell';

type VitalStatusCellProps = {
  value: PatientListItemVitalStatusEnum;
};

function VitalStatusCell({ value }: VitalStatusCellProps) {
  return (
    <BadgeCell variant={value === 'alive' ? 'green' : 'neutral'} className="capitalize">
      {value}
    </BadgeCell>
  );
}

export default VitalStatusCell;
