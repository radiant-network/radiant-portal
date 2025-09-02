import { MousePointer, User } from 'lucide-react';

import { Avatar, AvatarFallback } from '@/components/base/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/base/ui/tooltip';
import { cn } from '@/components/lib/utils';

import { avatarStyles, getIconSize } from './avatar.styles';
import { BaseAvatarProps } from './avatar.types';

export function UnassignedAvatar({
  size = 'md',
  className,
  'data-testid': testId,
  canAssign,
  onAssignClick,
}: BaseAvatarProps) {
  const styles = avatarStyles({ size, variant: 'unassigned' });
  const iconSize = getIconSize(size);

  // Determine tooltip content and cursor style based on assignment capability
  const tooltipContent = canAssign ? 'Assign' : 'No assignation';
  const cursorClass = canAssign ? 'cursor-pointer' : 'cursor-not-allowed';

  // Determine if this should be clickable
  const isClickable = canAssign && onAssignClick;
  const handleClick = isClickable ? onAssignClick : undefined;

  const avatarElement = (
    <Avatar
      className={cn(styles.container(), className, cursorClass)}
      style={{
        borderDashArray: '1 2',
        borderWidth: '2px',
      }}
      data-testid={testId}
      onClick={handleClick}
    >
      <AvatarFallback className={cn(styles.fallback(), styles.text())}>
        {canAssign ? <MousePointer className={iconSize} /> : <User className={iconSize} />}
      </AvatarFallback>
    </Avatar>
  );

  // Wrap with tooltip only if canAssign prop is defined (not undefined)
  if (canAssign !== undefined) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>{avatarElement}</TooltipTrigger>
          <TooltipContent>
            <p>{tooltipContent}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return avatarElement;
}
