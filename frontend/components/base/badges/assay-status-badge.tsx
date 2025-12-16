import { Check, CircleDashed, CircleX, FileQuestion, Hourglass, Pen, RefreshCcwIcon } from 'lucide-react';

import { Badge, BadgeProps } from '@/components/base/shadcn/badge';
import { useI18n } from '@/components/hooks/i18n';

export type AssayStatus = 'unknown' | 'draft' | 'in_progress' | 'revoke' | 'submitted' | 'completed' | 'incomplete';

type AssayStatusBadgeProps = {
  status: AssayStatus;
  className?: string;
};

const colors: Record<string, BadgeProps['variant']> = {
  unknown: 'outline',
  draft: 'neutral',
  submitted: 'yellow',
  'on-hold': 'yellow',
  active: 'blue',
  in_progress: 'blue',
  revoke: 'red',
  completed: 'green',
  incomplete: 'orange',
};

const icons = {
  unknown: FileQuestion,
  draft: Pen,
  submitted: Hourglass,
  'on-hold': Hourglass,
  active: RefreshCcwIcon,
  in_progress: RefreshCcwIcon,
  revoke: CircleX,
  completed: Check,
  incomplete: CircleDashed,
};

function AssayStatusBadge({ status, className }: AssayStatusBadgeProps) {
  const { t } = useI18n();

  const color = colors[status];
  const Icon = icons[status];

  return (
    <Badge variant={color ?? 'neutral'} className={className}>
      <Icon />
      {t(`case_exploration.status.${status}`)}
    </Badge>
  );
}

export default AssayStatusBadge;
