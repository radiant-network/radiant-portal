import { Badge, BadgeProps } from '@/components/base/ui/badge';
import { useI18n } from '@/components/hooks/i18n';
import { Check, CircleDashed, CircleX, FileQuestion, Hourglass, Pen, RefreshCcwIcon } from 'lucide-react';

export type AssayStatus = 'unknown' | 'draft' | 'in_progress' | 'revoke' | 'submitted' | 'completed' | 'incomplete';

type AssayStatusBadgeProps = {
  status: AssayStatus;
};

const colors: Record<string, BadgeProps['variant']> = {
  unknown: 'outline',
  draft: 'neutral',
  submitted: 'yellow',
  in_progress: 'blue',
  revoke: 'red',
  completed: 'green',
  incomplete: 'orange',
};

const icons = {
  unknown: FileQuestion,
  draft: Pen,
  submitted: Hourglass,
  in_progress: RefreshCcwIcon,
  revoke: CircleX,
  completed: Check,
  incomplete: CircleDashed,
};

function AssayStatusBadge({ status }: AssayStatusBadgeProps) {
  const { t } = useI18n();

  const color = colors[status];
  const Icon = icons[status];

  return (
    <Badge variant={color ?? 'neutral'}>
      <Icon />
      {t(`case_exploration.status.${status}`)}
    </Badge>
  );
}

export default AssayStatusBadge;
