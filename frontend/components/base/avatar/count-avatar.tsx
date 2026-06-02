import { Avatar, AvatarFallback, AvatarGroup, AvatarGroupCount } from '@/components/base/shadcn/avatar';

import type { CountAvatarProps } from './avatar.types';
import { getInitials, getUserColor } from './avatar.utils';
import { AvatarPopover } from './avatar-popover';

// Maximum count display for count avatars
const MAX_COUNT_DISPLAY = 99;

export function CountAvatar({ firstUser, additionalCount, allUsers, size = 'sm', className }: CountAvatarProps) {
  const initials = getInitials(firstUser);
  const color = getUserColor(firstUser.id);

  const countText = additionalCount > MAX_COUNT_DISPLAY ? `${MAX_COUNT_DISPLAY}+` : `+${additionalCount}`;

  const avatarElement = (
    <AvatarGroup
      size={size}
      className={className}
      title={`${firstUser.name} and ${additionalCount} other${additionalCount > 1 ? 's' : ''}`}
    >
      <Avatar>
        <AvatarFallback color={color}>{initials}</AvatarFallback>
      </Avatar>
      <AvatarGroupCount>{countText}</AvatarGroupCount>
    </AvatarGroup>
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
