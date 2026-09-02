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
  RefreshCcwIcon,
  RotateCcw,
} from 'lucide-react';

import { Badge, type BadgeProps } from '@/components/base/shadcn/badge';
import { useI18n } from '@/components/hooks/i18n';

export type Status =
  | 'submitted'
  | 'processing'
  | 'in_progress'
  | 'in_review'
  | 'completed'
  | 'resolved'
  | 'unresolved'
  | 'inconclusive'
  | 'reopened'
  | 'revoked'
  | 'unknown';

type StatusBadgeProps = {
  status: Status;
  className?: string;
};

const colors: Record<string, BadgeProps['variant']> = {
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
  unknown: 'outline',
};

const icons: Record<string, LucideIcon> = {
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
  unknown: FileQuestion,
};

function StatusBadge({ status, className }: StatusBadgeProps) {
  const { t } = useI18n();

  const color = colors[status] ?? 'neutral';
  const Icon = icons[status] ?? FileQuestion;

  return (
    <Badge variant={color} className={className}>
      <Icon />
      {t(`case_exploration.status.${status}`, status)}
    </Badge>
  );
}

export default StatusBadge;
