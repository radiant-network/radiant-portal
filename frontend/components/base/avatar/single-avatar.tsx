import { Avatar, AvatarFallback } from '@/components/base/shadcn/avatar';

import type { SingleAvatarProps } from './avatar.types';
import { getInitials, getUserColor } from './avatar.utils';
import { AvatarPopover } from './avatar-popover';

export function SingleAvatar({ user, size = 'sm', className }: SingleAvatarProps) {
  const initials = getInitials(user);
  const color = getUserColor(user.id);

  const avatarElement = (
    <Avatar size={size} className={className} title={user.name}>
      <AvatarFallback color={color}>{initials}</AvatarFallback>
    </Avatar>
  );

  // Show popover if user has email or organization
  const shouldShowPopover = user.email || user.organization;

  if (shouldShowPopover) {
    return (
      <AvatarPopover users={user} size={size}>
        {avatarElement}
      </AvatarPopover>
    );
  }

  return avatarElement;
}
