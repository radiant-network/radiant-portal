import { Avatar, AvatarFallback } from '@/components/base/ui/avatar';
import { cn } from '@/components/lib/utils';

import { avatarStyles, getOverlapClasses } from './avatar.styles';
import { CountAvatarProps } from './avatar.types';
import { getInitials, getUserColor } from './avatar.utils';

export function CountAvatar({
  firstUser,
  additionalCount,
  size = 'md',
  className,
  'data-testid': testId,
}: CountAvatarProps) {
  const initials = getInitials(firstUser);
  const colorClass = getUserColor(firstUser.id);

  const userStyles = avatarStyles({ size, variant: 'count', position: 'first' });
  const countStyles = avatarStyles({ size, variant: 'count', position: 'second' });
  const overlapClass = getOverlapClasses(size);

  const countText = additionalCount > 99 ? '99+' : `+${additionalCount}`;

  return (
    <div
      className={cn('flex items-center', className)}
      data-testid={testId}
      title={`${firstUser.name} and ${additionalCount} other${additionalCount > 1 ? 's' : ''}`}
    >
      {/* First user avatar - behind (lower z-index) */}
      <Avatar className={userStyles.container()}>
        <AvatarFallback className={cn(userStyles.fallback(), userStyles.text(), colorClass)}>{initials}</AvatarFallback>
      </Avatar>

      {/* Count avatar - overlapped on top (higher z-index) */}
      <Avatar className={cn(countStyles.container(), overlapClass, 'bg-background')}>
        <AvatarFallback className={cn(countStyles.fallback(), 'bg-cyan/20 text-cyan-foreground')}>
          {countText}
        </AvatarFallback>
      </Avatar>
    </div>
  );
}
