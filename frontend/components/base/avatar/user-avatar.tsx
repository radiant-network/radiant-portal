import { Avatar, AvatarFallback } from '@/components/base/shadcn/avatar';

import type { UserAvatarProps } from './avatar.types';
import { getInitials, getUserColor } from './avatar.utils';
import { AvatarPopover } from './avatar-popover';

/**
 * Renders a single user's avatar (initials + deterministic color), with a hover
 * popover when the user has an email or organization. The atomic building block
 * the assignment `Avatar` aggregator composes for each shown user.
 */
export function UserAvatar({
  user,
  size = 'sm',
  className,
  popoverTitle,
  showDetails = true,
  onEdit,
}: UserAvatarProps) {
  // Show popover if user has email or organization
  const shouldShowPopover = showDetails && Boolean(user.email || user.organization);

  const avatarElement = (
    <Avatar size={size} className={className}>
      <AvatarFallback color={getUserColor(user.id)}>{getInitials(user)}</AvatarFallback>
    </Avatar>
  );

  if (shouldShowPopover) {
    return (
      <AvatarPopover users={user} size={size} title={popoverTitle} onEdit={onEdit}>
        {avatarElement}
      </AvatarPopover>
    );
  }

  return avatarElement;
}
