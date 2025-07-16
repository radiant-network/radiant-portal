import { Badge, BadgeProps } from '@/components/base/ui/badge';
import { useI18n } from '@/components/hooks/i18n';
import { Check, CircleDashed, CircleX, Hourglass, Pen, RefreshCcwIcon } from 'lucide-react';
import { Skeleton } from '../../ui/skeleton';

export type AssayStatus = 'draft' | 'on-hold' | 'revoke' | 'active' | 'completed' | 'incomplete' | undefined;

type StatusCellProps = {
  status: AssayStatus;
};

const colors: Record<string, BadgeProps['variant']> = {
  draft: 'neutral',
  'on-hold': 'yellow',
  active: 'blue',
  revoke: 'red',
  completed: 'green',
  incomplete: 'orange',
};

const icons = {
  draft: Pen,
  'on-hold': Hourglass,
  active: RefreshCcwIcon,
  revoke: CircleX,
  completed: Check,
  incomplete: CircleDashed,
  cancelled: CircleX,
};

function StatusCell({ status }: StatusCellProps) {
  const { t } = useI18n();

  if (!status) return <Skeleton className='h-[22px] w-full' />;

  const color = colors[status];
  const Icon = icons[status];

  return (
    <Badge variant={color ?? 'neutral'}>
      <Icon />
      {t(`caseExploration.status.${status}`)}
    </Badge>
  );
}

export default StatusCell;
