import { User } from 'lucide-react';

import { Avatar, AvatarFallback } from '@/components/base/shadcn/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/base/shadcn/tooltip';
import { useI18n } from '@/components/hooks/i18n';
import { cn } from '@/components/lib/utils';

import { avatarStyles, getIconSize } from './avatar.styles';
import { BaseAvatarProps } from './avatar.types';

export function UnassignedAvatar({ size = 'md', className, canAssign, onAssignClick }: BaseAvatarProps) {
  const { t } = useI18n();
  // Get styles without size to avoid conflicting size classes, only get variant and base styles
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
    <Avatar
      className={cn(
        // Base container styles without size variants
        'relative flex shrink-0 overflow-hidden rounded-full',
        // Unassigned variant styles
        'border-2 border-dashed border-muted-foreground/40 bg-muted/20',
        // Fixed size - always 24px x 24px
        'h-6 w-6',
        // Cursor styling
        cursorClass,
        className,
      )}
      onClick={handleClick}
    >
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
