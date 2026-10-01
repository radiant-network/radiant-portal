import { Avatar as AvatarRoot, AvatarFallback, AvatarGroup, AvatarGroupCount } from '@/components/base/shadcn/avatar';
import { useI18n } from '@/components/hooks/i18n';

import type { AvatarProps } from './avatar.types';
import { getInitials, getUserColor } from './avatar.utils';
import { AvatarAssignmentButton } from './avatar-assignment-button';
import { AvatarPopover } from './avatar-popover';
import { UserAvatar } from './user-avatar';

// Largest count rendered before falling back to "99+"
const MAX_COUNT_DISPLAY = 99;

/**
 * Avatar component that displays user assignment status.
 *
 * - No users: AvatarAssignmentButton (bare icon, gray hover when assignable)
 * - 1 user: UserAvatar (colored circle with initials)
 * - 2+ users: an AvatarGroup showing up to `maxAvatars` avatars, the rest
 *   collapsed into a `+N` count chip.
 */
export function Avatar({
  users = [],
  size = 'sm',
  maxAvatars = 2,
  className,
  canAssign = true,
  onAssignClick,
  showDetails = true,
}: AvatarProps) {
  const { t } = useI18n();
  const popoverTitle = t('common.user_selection.case_assignment');

  // Filter out any falsy users and ensure we have valid user objects
  const validUsers = users.filter(user => user && user.id && user.name);

  if (validUsers.length === 0) {
    return (
      <AvatarAssignmentButton size={size} className={className} canAssign={canAssign} onAssignClick={onAssignClick} />
    );
  }

  if (validUsers.length === 1) {
    return (
      <UserAvatar
        user={validUsers[0]}
        size={size}
        className={className}
        popoverTitle={popoverTitle}
        showDetails={showDetails}
      />
    );
  }

  const overflow = validUsers.length > maxAvatars;
  const shownUsers = validUsers.slice(0, maxAvatars);
  const remaining = validUsers.length - shownUsers.length;
  const countText = remaining > MAX_COUNT_DISPLAY ? `${MAX_COUNT_DISPLAY}+` : `+${remaining}`;

  const shouldShowPopover = showDetails && validUsers.some(user => user.email || user.organization);

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

  if (shouldShowPopover) {
    return (
      <AvatarPopover users={validUsers} size={size} title={popoverTitle}>
        {avatarElement}
      </AvatarPopover>
    );
  }

  return avatarElement;
}
