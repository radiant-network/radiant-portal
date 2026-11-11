import type { PatientInterpretationOriginEnum } from '@/api/api';
import BadgeCell from '@/components/base/data-table/cells/badge-cell';
import { useI18n } from '@/components/hooks/i18n';

type OriginCellProps = {
  value: PatientInterpretationOriginEnum;
};

function OriginCell({ value }: OriginCellProps) {
  const { t } = useI18n();
  return (
    <BadgeCell variant={value === 'germline' ? 'violet' : 'secondary'}>
      {t(`patient_entity.genomics.origin.${value}`)}
    </BadgeCell>
  );
}

export default OriginCell;
