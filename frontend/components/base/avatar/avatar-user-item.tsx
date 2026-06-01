import { CopyButton } from '@/components/base/buttons/copy-button';
import { Avatar, AvatarFallback } from '@/components/base/shadcn/avatar';
import { cn } from '@/components/lib/utils';

import { avatarStyles } from './avatar.styles';
import { AvatarUser } from './avatar.types';
import { getInitials, getUserColor } from './avatar.utils';

interface AvatarUserItemProps {
  user: AvatarUser;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function AvatarUserItem({ user, size = 'sm', className }: AvatarUserItemProps) {
  const initials = getInitials(user);
  const colorClass = getUserColor(user.id);
  const styles = avatarStyles({ size, variant: 'single' });

  return (
    <div className={cn('flex space-x-3 items-start', className)}>
      {/* Avatar on the left - aligned with username */}
      <Avatar className={cn(styles.container(), 'flex-shrink-0')}>
        <AvatarFallback className={cn(styles.fallback(), styles.text(), colorClass)}>{initials}</AvatarFallback>
      </Avatar>

      {/* User details on the right */}
      <div className="space-y-1 flex-1 min-w-0">
        {/* Name and organization on same line */}
        <div className="flex items-center space-x-2">
          <h4 className="text-sm font-semibold truncate">{user.name}</h4>
          {user.organization && <p className="text-xs text-muted-foreground truncate">{user.organization}</p>}
        </div>

        {/* Email on bottom with hover effect and copy */}
        {user.email && (
          <div className="group flex items-center space-x-1 hover:bg-accent/50 rounded px-1 py-0.5 -mx-1 transition-colors cursor-pointer">
            <a
              href={`mailto:${user.email}`}
              className="text-xs text-muted-foreground truncate group-hover:text-primary hover:underline"
              onClick={e => e.stopPropagation()}
            >
              {user.email}
            </a>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              <CopyButton
                value={user.email}
                size="sm"
                variant="ghost"
                iconSize={12}
                className="h-5 w-5 p-0 hover:bg-accent"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
