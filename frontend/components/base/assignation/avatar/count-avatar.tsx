import { Avatar, AvatarFallback } from '@/components/base/ui/avatar';
import { cn } from '@/components/lib/utils';

import { ASSIGNATION_CONSTANTS } from '../constants';

import { avatarStyles, getOverlapClasses } from './avatar.styles';
import { CountAvatarProps } from './avatar.types';
import { getInitials, getUserColor } from './avatar.utils';
import { AvatarPopover } from './avatar-popover';

export function CountAvatar({ firstUser, additionalCount, allUsers, size = 'md', className }: CountAvatarProps) {
  const initials = getInitials(firstUser);
  const colorClass = getUserColor(firstUser.id);

  const userStyles = avatarStyles({ size, variant: 'count', position: 'first' });
  const countStyles = avatarStyles({ size, variant: 'count', position: 'second' });
  const overlapClass = getOverlapClasses(size);

  const countText =
    additionalCount > ASSIGNATION_CONSTANTS.MAX_COUNT_DISPLAY
      ? `${ASSIGNATION_CONSTANTS.MAX_COUNT_DISPLAY}+`
      : `+${additionalCount}`;

  const avatarElement = (
    <div
      className={cn('flex items-center', className)}
      title={`${firstUser.name} and ${additionalCount} other${additionalCount > 1 ? 's' : ''}`}
    >
      {/* First user avatar - behind (lower z-index) */}
      <Avatar className={userStyles.container()}>
        <AvatarFallback className={cn(userStyles.fallback(), userStyles.text(), colorClass)}>{initials}</AvatarFallback>
      </Avatar>

      {/* Count avatar - overlapped on top (higher z-index) */}
      <Avatar className={cn(countStyles.container(), overlapClass, 'bg-background')}>
        <AvatarFallback className={cn(countStyles.fallback(), 'bg-cyan-800/20 text-cyan-foreground')}>
          {countText}
        </AvatarFallback>
      </Avatar>
    </div>
  );

  // Show popover if we have all users and any have additional details
  const shouldShowPopover = allUsers && allUsers.some(user => user.email || user.organization);

  return shouldShowPopover ? (
    <AvatarPopover users={allUsers} size={size}>
      {avatarElement}
    </AvatarPopover>
  ) : (
    avatarElement
  );
}
