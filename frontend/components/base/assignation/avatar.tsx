import { User } from 'lucide-react';

import { Avatar, AvatarFallback } from '@/components/base/ui/avatar';
import { cn } from '@/components/lib/utils';

import { avatarStyles, getIconSize } from './avatar/avatar.styles';
import { AvatarUser } from './avatar/avatar.types';
import { getInitials, getUserColor } from './avatar/avatar.utils';
import { isNotAssignedUser } from './constants';

/**
 * Props for rendering avatar elements
 */
export interface AvatarRenderProps {
  user: AvatarUser;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showTooltip?: boolean;
}

/**
 * Renders an avatar element with proper styling and content
 */
export function renderAvatarElement({ user, size = 'md', className }: AvatarRenderProps): React.ReactElement {
  const isNotAssigned = isNotAssignedUser(user);
  const initials = isNotAssigned ? '' : getInitials(user);
  const colorClass = isNotAssigned ? '' : getUserColor(user.id);
  const avatarStyle = avatarStyles({
    size,
    variant: isNotAssigned ? 'unassigned' : 'single',
  });
  const iconSize = getIconSize(size);

  return (
    <Avatar className={cn(avatarStyle.container(), className)}>
      <AvatarFallback className={cn(avatarStyle.fallback(), avatarStyle.text(), !isNotAssigned && colorClass)}>
        {isNotAssigned ? <User className={iconSize} /> : initials}
      </AvatarFallback>
    </Avatar>
  );
}

/**
 * Renders a user item with avatar and details
 */
export function renderUserItem({
  user,
  size = 'md',
  className,
  showOrganization = true,
  showEmail = false,
}: AvatarRenderProps & {
  showOrganization?: boolean;
  showEmail?: boolean;
}): React.ReactElement {
  const avatarElement = renderAvatarElement({ user, size, className });

  return (
    <div className={cn('flex space-x-3 items-start', className)}>
      {/* Avatar on the left */}
      <div className="flex-shrink-0">{avatarElement}</div>

      {/* User details on the right */}
      <div className="space-y-1 flex-1 min-w-0">
        {/* Name and organization */}
        <div className="flex items-center space-x-2">
          <h4 className="text-sm font-semibold truncate">{user.name}</h4>
          {showOrganization && user.organization && (
            <p className="text-xs text-muted-foreground truncate">{user.organization}</p>
          )}
        </div>

        {/* Email (if requested) */}
        {showEmail && user.email && <p className="text-xs text-muted-foreground truncate">{user.email}</p>}
      </div>
    </div>
  );
}

/**
 * Gets the appropriate avatar styles for a given size and variant
 */
export function getAvatarStyles(size: 'sm' | 'md' | 'lg', variant: 'single' | 'unassigned' = 'single') {
  return avatarStyles({ size, variant });
}

/**
 * Gets the icon size for a given avatar size
 */
export function getAvatarIconSize(size: 'sm' | 'md' | 'lg') {
  return getIconSize(size);
}
