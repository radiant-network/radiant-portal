import type { PatientListItemGenderEnum } from '@/api/api';
import { replaceUnderscore, titleCase } from '@/components/lib/string-format';

type GenderCellProps = {
  value: PatientListItemGenderEnum;
};

function GenderCell({ value }: GenderCellProps) {
  return <>{titleCase(replaceUnderscore(value))}</>;
}

export default GenderCell;
