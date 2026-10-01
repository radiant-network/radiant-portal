import { User } from 'lucide-react';

import { Avatar, AvatarFallback } from '@/components/base/shadcn/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/base/shadcn/tooltip';
import { useI18n } from '@/components/hooks/i18n';
import { cn } from '@/components/lib/utils';

import { avatarStyles, getIconSize } from './avatar.styles';
import type { BaseAvatarProps } from './avatar.types';

export function AvatarAssignmentButton({
  size = 'sm',
  className,
  canAssign,
  onAssignClick,
  buttonVariant = 'ghost',
}: BaseAvatarProps) {
  const { t } = useI18n();
  const styles = avatarStyles({ variant: 'assignment', buttonVariant });
  const isSecondary = buttonVariant === 'secondary';
  const iconSize = getIconSize(size);

  const tooltipContent = canAssign
    ? t('common.unassigned_avatar.can_assign')
    : t('common.unassigned_avatar.cannot_assign');

  const enabledClass = isSecondary ? 'hover:bg-secondary/80' : 'hover:bg-accent';
  const disabledClass = isSecondary ? 'cursor-not-allowed opacity-50' : 'cursor-default';
  const interactionClass = canAssign ? cn('cursor-pointer transition-colors', enabledClass) : disabledClass;
  const handleClick = canAssign && onAssignClick ? onAssignClick : undefined;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Avatar size={size} className={cn(styles.container(), interactionClass, className)} onClick={handleClick}>
            <AvatarFallback className={cn(styles.fallback(), styles.text())}>
              <User className={iconSize} />
            </AvatarFallback>
          </Avatar>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltipContent}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
