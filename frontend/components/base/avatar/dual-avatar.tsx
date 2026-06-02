import { Avatar, AvatarFallback, AvatarGroup } from '@/components/base/shadcn/avatar';

import type { DualAvatarProps } from './avatar.types';
import { getInitials, getUserColor } from './avatar.utils';
import { AvatarPopover } from './avatar-popover';

export function DualAvatar({ users, size = 'sm', className }: DualAvatarProps) {
  const [firstUser, secondUser] = users;

  const avatarElement = (
    <AvatarGroup size={size} className={className} title={`${firstUser.name}, ${secondUser.name}`}>
      <Avatar>
        <AvatarFallback color={getUserColor(firstUser.id)}>{getInitials(firstUser)}</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback color={getUserColor(secondUser.id)}>{getInitials(secondUser)}</AvatarFallback>
      </Avatar>
    </AvatarGroup>
  );

  // Show popover if any user has additional details
  const shouldShowPopover = users.some(user => user.email || user.organization);
  return shouldShowPopover ? (
    <AvatarPopover users={users} size={size}>
      {avatarElement}
    </AvatarPopover>
  ) : (
    avatarElement
  );
}
