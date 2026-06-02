import { User } from 'lucide-react';

import { Avatar, AvatarFallback } from '@/components/base/shadcn/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/base/shadcn/tooltip';
import { useI18n } from '@/components/hooks/i18n';
import { cn } from '@/components/lib/utils';

import { avatarStyles, getIconSize } from './avatar.styles';
import { BaseAvatarProps } from './avatar.types';

export function UnassignedAvatar({ size = 'sm', className, canAssign, onAssignClick }: BaseAvatarProps) {
  const { t } = useI18n();
  const styles = avatarStyles({ variant: 'unassigned' });
  const iconSize = getIconSize(size);

  // Determine tooltip content and cursor style based on assignment capability
  const tooltipContent = canAssign
    ? t('common.unassigned_avatar.can_assign')
    : t('common.unassigned_avatar.cannot_assign');

  // Determine cursor class based on canAssign state
  const cursorClass = canAssign === true ? 'cursor-pointer' : 'cursor-default';

  // Determine if this should be clickable
  const isClickable = canAssign && onAssignClick;
  const handleClick = isClickable ? onAssignClick : undefined;

  const avatarElement = (
    <Avatar size={size} className={cn(styles.container(), cursorClass, className)} onClick={handleClick}>
      <AvatarFallback className={cn(styles.fallback(), styles.text())}>
        <User className={iconSize} />
      </AvatarFallback>
    </Avatar>
  );

  // Wrap with tooltip only if canAssign prop is defined (not undefined)
  return canAssign !== undefined ? (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{avatarElement}</TooltipTrigger>
        <TooltipContent>
          <p>{tooltipContent}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ) : (
    avatarElement
  );
}
