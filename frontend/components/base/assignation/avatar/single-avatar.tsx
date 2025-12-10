import { Avatar, AvatarFallback } from '@/components/base/shadcn/avatar';
import { cn } from '@/components/lib/utils';

import { avatarStyles } from './avatar.styles';
import { SingleAvatarProps } from './avatar.types';
import { getInitials, getUserColor } from './avatar.utils';
import { AvatarPopover } from './avatar-popover';

export function SingleAvatar({ user, size = 'md', className }: SingleAvatarProps) {
  const initials = getInitials(user);
  const colorClass = getUserColor(user.id);
  const styles = avatarStyles({ size, variant: 'single' });

  const avatarElement = (
    <Avatar className={cn(styles.container(), className)} title={user.name}>
      <AvatarFallback className={cn(styles.fallback(), styles.text(), colorClass)}>{initials}</AvatarFallback>
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
