import { AvatarProps } from './avatar.types';
import { CountAvatar } from './count-avatar';
import { DualAvatar } from './dual-avatar';
import { SingleAvatar } from './single-avatar';
import { UnassignedAvatar } from './unassigned-avatar';

/**
 * Avatar component that displays user assignment status
 *
 * Renders different states based on the number of assigned users:
 * - No users: UnassignedAvatar (gray dashed circle with user icon)
 * - 1 user: SingleAvatar (colored circle with initials)
 * - 2 users: DualAvatar (two overlapping colored circles with initials)
 * - 3+ users: CountAvatar (first user avatar + count circle)
 */
export function Avatar({ users = [], size = 'md', className, canAssign, onAssignClick }: AvatarProps) {
  // Filter out any falsy users and ensure we have valid user objects
  const validUsers = users.filter(user => user && user.id && user.name);
  const userCount = validUsers.length;

  if (userCount === 0) {
    return <UnassignedAvatar size={size} className={className} canAssign={canAssign} onAssignClick={onAssignClick} />;
  }

  if (userCount === 1) {
    return (
      <SingleAvatar
        user={validUsers[0]}
        size={size}
        className={className}
        canAssign={canAssign}
        onAssignClick={onAssignClick}
      />
    );
  }

  if (userCount === 2) {
    return (
      <DualAvatar
        users={[validUsers[0], validUsers[1]]}
        size={size}
        className={className}
        canAssign={canAssign}
        onAssignClick={onAssignClick}
      />
    );
  }

  // 3 or more users
  return (
    <CountAvatar
      firstUser={validUsers[0]}
      additionalCount={userCount - 1}
      allUsers={validUsers}
      size={size}
      className={className}
      canAssign={canAssign}
      onAssignClick={onAssignClick}
    />
  );
}
