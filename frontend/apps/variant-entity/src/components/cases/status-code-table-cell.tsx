import { Badge } from '@/components/base/ui/badge';
import { useI18n } from '@/components/hooks/i18n';

interface StatusCodeTableCellProps {
  statusCode: string;
}

function StatusCodeTableCell({ statusCode }: StatusCodeTableCellProps) {
  const { t } = useI18n();
  return (
    <Badge variant={statusCode === 'active' ? 'secondary' : 'default'}>
      {t(`variantEntity.cases.status.${statusCode}`)}
    </Badge>
  );
}

export default StatusCodeTableCell;
