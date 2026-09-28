import type { CaseStatus } from '@/api/api';
import { Badge, type BadgeProps } from '@/components/base/shadcn/badge';
import { useI18n } from '@/components/hooks/i18n';

type StatusBadgeProps = {
  status: CaseStatus;
  size?: BadgeProps['size'];
  className?: string;
};

export const statusColors: Record<CaseStatus, BadgeProps['variant']> = {
  draft: 'neutral',
  submitted: 'outline',
  processing: 'yellow',
  in_progress: 'blue',
  in_review: 'cyan',
  completed: 'green',
  resolved: 'green',
  unresolved: 'lime',
  inconclusive: 'lime',
  reopened: 'violet',
  revoked: 'neutral',
};

function StatusBadge({ status, size, className }: StatusBadgeProps) {
  const { t } = useI18n();
  const color = statusColors[status] ?? 'neutral';

  return (
    <Badge variant={color} size={size} className={className}>
      {t(`case_exploration.status.${status}`, status)}
    </Badge>
  );
}

export default StatusBadge;
