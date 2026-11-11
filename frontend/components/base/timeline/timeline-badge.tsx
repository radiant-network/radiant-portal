import { ClipboardPlus, type LucideIcon, Pill, Radiation as RadiationIcon, Slice } from 'lucide-react';

import { Badge } from '@/components/base/shadcn/badge';
import { cn } from '@/components/lib/utils';

export type TimelineBadgeType = 'event' | 'surgery' | 'chemotherapy' | 'radiation';

const BADGE_CONFIG: Record<TimelineBadgeType, { icon: LucideIcon; className: string }> = {
  event: { icon: ClipboardPlus, className: 'bg-transparent text-muted-foreground' },
  surgery: { icon: Slice, className: 'bg-avatar-cyan text-avatar-cyan-foreground' },
  chemotherapy: { icon: Pill, className: 'bg-avatar-lime text-avatar-lime-foreground' },
  radiation: { icon: RadiationIcon, className: 'bg-avatar-orange text-avatar-orange-foreground' },
};

type TimelineBadgeSize = 'sm' | 'default';

const SIZE_CLASSES: Record<TimelineBadgeSize, { wrapper: string; icon: string }> = {
  sm: { wrapper: 'size-5', icon: 'size-3.5!' },
  default: { wrapper: 'size-6', icon: 'size-4!' },
};

type TimelineBadgeProps = {
  type: TimelineBadgeType;
  size?: TimelineBadgeSize;
  className?: string;
};

function TimelineBadge({ type, size = 'default', className }: TimelineBadgeProps) {
  const { icon: Icon, className: typeClassName } = BADGE_CONFIG[type];
  const { wrapper, icon } = SIZE_CLASSES[size];
  return (
    <Badge aria-hidden className={cn('justify-center rounded-full p-0', wrapper, typeClassName, className)}>
      <Icon className={icon} />
    </Badge>
  );
}

export default TimelineBadge;
