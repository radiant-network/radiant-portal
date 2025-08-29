import { Avatar, AvatarFallback } from '@/components/base/ui/avatar';
import { cn } from '@/components/lib/utils';

import { avatarStyles } from './avatar.styles';
import { SingleAvatarProps } from './avatar.types';
import { getInitials, getUserColor } from './avatar.utils';

export function SingleAvatar({ user, size = 'md', className, 'data-testid': testId }: SingleAvatarProps) {
  const initials = getInitials(user);
  const colorClass = getUserColor(user.id);
  const styles = avatarStyles({ size, variant: 'single' });

  return (
    <Avatar className={cn(styles.container(), className)} data-testid={testId} title={user.name}>
      <AvatarFallback className={cn(styles.fallback(), styles.text(), colorClass)}>{initials}</AvatarFallback>
    </Avatar>
  );
}
