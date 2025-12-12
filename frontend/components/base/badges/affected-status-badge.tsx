import { Badge } from '@/components/base/shadcn/badge';
import { useI18n } from '@/components/hooks/i18n';

export type AffectedStatusProps = 'affected' | 'non_affected' | 'unknown' | undefined;

export type AffectedStatusBadgeProps = {
  status: AffectedStatusProps;
};

export function getBadgeAffectedCodeColor(code: AffectedStatusProps) {
  switch (code) {
    case 'affected':
      return 'red';
    default:
      return 'secondary';
  }
}

function AffectedStatusBadge({ status }: AffectedStatusBadgeProps) {
  const { t } = useI18n();
  return (
    <Badge variant={getBadgeAffectedCodeColor(status)}>
      {t(`case_entity.variants.filters.affected_status_code.${status}`)}
    </Badge>
  );
}
export default AffectedStatusBadge;
