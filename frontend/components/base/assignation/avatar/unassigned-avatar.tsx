import { User } from 'lucide-react';

import { Avatar, AvatarFallback } from '@/components/base/ui/avatar';
import { cn } from '@/components/lib/utils';

import { avatarStyles, getIconSize } from './avatar.styles';
import { BaseAvatarProps } from './avatar.types';

export function UnassignedAvatar({ size = 'md', className, 'data-testid': testId }: BaseAvatarProps) {
  const styles = avatarStyles({ size, variant: 'unassigned' });
  const iconSize = getIconSize(size);

  return (
    <Avatar
      className={cn(styles.container(), className)}
      style={{
        borderDashArray: '1 2',
        borderWidth: '2px',
      }}
      data-testid={testId}
    >
      <AvatarFallback className={cn(styles.fallback(), styles.text())}>
        <User className={iconSize} />
      </AvatarFallback>
    </Avatar>
  );
}
