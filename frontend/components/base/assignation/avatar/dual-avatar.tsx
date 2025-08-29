import { Avatar, AvatarFallback } from '@/components/base/ui/avatar';
import { cn } from '@/components/lib/utils';

import { avatarStyles, getOverlapClasses } from './avatar.styles';
import { DualAvatarProps } from './avatar.types';
import { getInitials, getUserColor } from './avatar.utils';

export function DualAvatar({ users, size = 'md', className, 'data-testid': testId }: DualAvatarProps) {
  const [firstUser, secondUser] = users;

  const firstInitials = getInitials(firstUser);
  const secondInitials = getInitials(secondUser);
  const firstColorClass = getUserColor(firstUser.id);
  const secondColorClass = getUserColor(secondUser.id);

  const firstStyles = avatarStyles({ size, variant: 'dual', position: 'first' });
  const secondStyles = avatarStyles({ size, variant: 'dual', position: 'second' });
  const overlapClass = getOverlapClasses(size);

  return (
    <div
      className={cn('flex items-center', className)}
      data-testid={testId}
      title={`${firstUser.name}, ${secondUser.name}`}
    >
      {/* First avatar - behind (lower z-index) */}
      <Avatar className={firstStyles.container()}>
        <AvatarFallback className={cn(firstStyles.fallback(), firstStyles.text(), firstColorClass)}>
          {firstInitials}
        </AvatarFallback>
      </Avatar>

      {/* Second avatar - overlapped on top (higher z-index) */}
      <Avatar className={cn(secondStyles.container(), overlapClass)}>
        <AvatarFallback className={cn(secondStyles.fallback(), secondStyles.text(), secondColorClass)}>
          {secondInitials}
        </AvatarFallback>
      </Avatar>
    </div>
  );
}
