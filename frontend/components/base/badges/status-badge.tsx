import {
  Check,
  CircleCheck,
  CircleDashed,
  CircleX,
  Eye,
  FileQuestion,
  Hourglass,
  LoaderCircle,
  type LucideIcon,
  Pen,
  RefreshCcwIcon,
  RotateCcw,
} from 'lucide-react';

import type { CaseStatus } from '@/api/api';
import { Badge, type BadgeProps } from '@/components/base/shadcn/badge';
import { useI18n } from '@/components/hooks/i18n';

type StatusBadgeProps = {
  status: CaseStatus;
  size?: BadgeProps['size'];
  withIcon?: boolean;
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

export const statusFallbackIcon = FileQuestion;

export const statusIcons: Record<CaseStatus, LucideIcon> = {
  draft: Pen,
  submitted: Hourglass,
  processing: LoaderCircle,
  in_progress: RefreshCcwIcon,
  in_review: Eye,
  completed: Check,
  resolved: CircleCheck,
  unresolved: CircleDashed,
  inconclusive: FileQuestion,
  reopened: RotateCcw,
  revoked: CircleX,
};

function StatusBadge({ status, size, withIcon = true, className }: StatusBadgeProps) {
  const { t } = useI18n();

  const color = statusColors[status] ?? 'neutral';
  const Icon = statusIcons[status] ?? statusFallbackIcon;

  return (
    <Badge variant={color} size={size} className={className}>
      {withIcon && <Icon />}
      {t(`case_exploration.status.${status}`, status)}
    </Badge>
  );
}

export default StatusBadge;
