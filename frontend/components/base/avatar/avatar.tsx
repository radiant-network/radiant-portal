import { Avatar as AvatarRoot, AvatarFallback, AvatarGroup, AvatarGroupCount } from '@/components/base/shadcn/avatar';

import type { AvatarProps } from './avatar.types';
import { getInitials, getUserColor } from './avatar.utils';
import { AvatarPopover } from './avatar-popover';
import { UnassignedAvatar } from './unassigned-avatar';
import { UserAvatar } from './user-avatar';

// Largest count rendered before falling back to "99+"
const MAX_COUNT_DISPLAY = 99;

/**
 * Avatar component that displays user assignment status.
 *
 * - No users: UnassignedAvatar (dashed circle with user icon)
 * - 1 user: UserAvatar (colored circle with initials)
 * - 2+ users: an AvatarGroup, collapsing the overflow into a `+N` count chip
 *   once there are more than `maxAvatars` users.
 */
export function Avatar({ users = [], size = 'sm', maxAvatars = 2, className, canAssign, onAssignClick }: AvatarProps) {
  // Filter out any falsy users and ensure we have valid user objects
  const validUsers = users.filter(user => user && user.id && user.name);

  if (validUsers.length === 0) {
    return <UnassignedAvatar size={size} className={className} canAssign={canAssign} onAssignClick={onAssignClick} />;
  }

  if (validUsers.length === 1) {
    return <UserAvatar user={validUsers[0]} size={size} className={className} />;
  }

  // When there are more users than we can show, keep room for the count chip.
  const overflow = validUsers.length > maxAvatars;
  const shownUsers = overflow ? validUsers.slice(0, maxAvatars - 1) : validUsers;
  const remaining = validUsers.length - shownUsers.length;
  const countText = remaining > MAX_COUNT_DISPLAY ? `${MAX_COUNT_DISPLAY}+` : `+${remaining}`;

  const shouldShowPopover = validUsers.some(user => user.email || user.organization);

  const avatarElement = (
    <AvatarGroup size={size} className={className}>
      {shownUsers.map(user => (
        <AvatarRoot key={user.id}>
          <AvatarFallback color={getUserColor(user.id)}>{getInitials(user)}</AvatarFallback>
        </AvatarRoot>
      ))}
      {overflow && <AvatarGroupCount>{countText}</AvatarGroupCount>}
    </AvatarGroup>
  );

  return shouldShowPopover ? (
    <AvatarPopover users={validUsers} size={size}>
      {avatarElement}
    </AvatarPopover>
  ) : (
    avatarElement
  );
}
