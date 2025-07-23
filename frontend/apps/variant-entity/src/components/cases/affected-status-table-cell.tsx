import EmptyCell from '@/components/base/data-table/cells/empty-cell';
import { useI18n } from '@/components/hooks/i18n';

interface AffectedStatusTableCell {
  affectedStatus?: string;
}

function AffectedStatusTableCell({ affectedStatus }: AffectedStatusTableCell) {
  const { t } = useI18n();
  if (!affectedStatus) {
    return <EmptyCell />;
  }

  return <span>{t(`variantEntity.cases.affected_status.${affectedStatus}`)}</span>;
}

export default AffectedStatusTableCell;
