import { User } from 'lucide-react';

import { Avatar, AvatarFallback } from '@/components/base/shadcn/avatar';
import { cn } from '@/components/lib/utils';

import { avatarStyles, getIconSize } from './avatar.styles';
import type { BaseAvatarProps } from './avatar.types';

export function UnassignedAvatar({ size = 'sm', className }: Pick<BaseAvatarProps, 'size' | 'className'>) {
  const styles = avatarStyles({ variant: 'unassigned' });
  const iconSize = getIconSize(size);

  return (
    <Avatar size={size} className={cn(styles.container(), className)}>
      <AvatarFallback className={cn(styles.fallback(), styles.text())}>
        <User className={iconSize} />
      </AvatarFallback>
    </Avatar>
  );
}
