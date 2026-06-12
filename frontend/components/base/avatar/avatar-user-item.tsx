import { CopyButton } from '@/components/base/buttons/copy-button';
import AnchorLink from '@/components/base/navigation/anchor-link';
import type { AvatarSize } from '@/components/base/shadcn/avatar';
import { Avatar, AvatarFallback } from '@/components/base/shadcn/avatar';
import { cn } from '@/components/lib/utils';

import type { AvatarUser } from './avatar.types';
import { getInitials, getUserColor } from './avatar.utils';

interface AvatarUserItemProps {
  user: AvatarUser;
  size?: AvatarSize;
  className?: string;
}

export function AvatarUserItem({ user, size = 'xs', className }: AvatarUserItemProps) {
  const initials = getInitials(user);
  const color = getUserColor(user.id);

  return (
    <div className={cn('flex space-x-3 items-start', className)}>
      <Avatar size={size} className="flex-shrink-0">
        <AvatarFallback color={color}>{initials}</AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2">
          <h4 className="text-sm font-semibold truncate">{user.name}</h4>
          {user.organization && <p className="text-xs text-muted-foreground truncate">{user.organization}</p>}
        </div>

        {user.email && (
          <div className="group flex items-center space-x-1 h-5">
            <AnchorLink
              href={`mailto:${user.email}`}
              variant="secondary"
              size="xs"
              className="truncate"
              onClick={e => e.stopPropagation()}
            >
              {user.email}
            </AnchorLink>
            <div className="hidden group-hover:block shrink-0">
              <CopyButton value={user.email} size="3xs" variant="ghost" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
