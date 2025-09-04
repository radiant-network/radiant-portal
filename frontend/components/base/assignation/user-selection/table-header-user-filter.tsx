import { useEffect, useState } from 'react';
import { User } from 'lucide-react';

import { Avatar, AvatarFallback } from '@/components/base/ui/avatar';
import { Button } from '@/components/base/ui/button';
import { Checkbox } from '@/components/base/ui/checkbox';
import { useI18n } from '@/components/hooks/i18n';
import { cn } from '@/components/lib/utils';

import { avatarStyles, getIconSize } from '../avatar/avatar.styles';
import { AvatarUser } from '../avatar/avatar.types';
import { getInitials, getUserColor } from '../avatar/avatar.utils';
import { isNotAssignedUser } from '../constants';
import { createFilteredUserList, handleUserToggle } from '../user-filtering';

// Table Header User Filter component for filtering users with checkboxes
interface TableHeaderUserFilterProps {
  availableUsers: AvatarUser[];
  selectedUsers: AvatarUser[];
  onUsersChange: (users: AvatarUser[]) => void;
  defaultUser?: AvatarUser;
  placeholder?: string;
  className?: string;
  isOpen?: boolean;
}

export function TableHeaderUserFilter({
  availableUsers,
  selectedUsers,
  onUsersChange,
  defaultUser,
  placeholder,
  className,
  isOpen = true,
}: TableHeaderUserFilterProps) {
  const { t } = useI18n();
  const [searchTerm, setSearchTerm] = useState('');
  const [stagedUsers, setStagedUsers] = useState<AvatarUser[]>(selectedUsers);

  const defaultPlaceholder = placeholder || t('common.user_selection.search_placeholder');

  // Update staged users when selectedUsers prop changes
  useEffect(() => {
    setStagedUsers(selectedUsers);
  }, [selectedUsers]);

  // Create filtered user list using shared utility
  const allFilteredUsers = createFilteredUserList({
    availableUsers,
    searchTerm,
    selectedUsers: stagedUsers,
    defaultUser,
    includeNotAssigned: true,
    notAssignedName: t('common.user_selection.not_assigned'),
  });

  const handleUserToggleClick = (user: AvatarUser, checked: boolean) => {
    const newStagedUsers = handleUserToggle({
      user,
      isChecked: checked,
      currentSelectedUsers: stagedUsers,
    });
    setStagedUsers(newStagedUsers);
  };

  const handleApplyFilter = () => {
    onUsersChange(stagedUsers);
  };

  const handleReset = () => {
    setStagedUsers([]);
    setSearchTerm('');
  };

  const avatarStyles24 = avatarStyles({ size: 'md', variant: 'single' });
  const avatarStylesUnassigned = avatarStyles({ size: 'sm', variant: 'unassigned' });
  const iconSize = getIconSize('sm');

  if (!isOpen) {
    return null;
  }

  return (
    <div className={cn('bg-background border border-border rounded-md shadow-sm', className)}>
      {/* Search Input */}
      <div className="px-3 pt-3 pb-1.5">
        <input
          type="text"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder={defaultPlaceholder}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
        />
      </div>

      {/* Users List with Checkboxes */}
      <div className="max-h-60 overflow-y-auto px-3">
        {allFilteredUsers.length === 0 ? (
          <div className="py-1.5 text-sm text-muted-foreground text-center">
            {searchTerm ? t('common.user_selection.no_users_found') : t('common.user_selection.start_typing_to_search')}
          </div>
        ) : (
          allFilteredUsers.map(user => {
            const isNotAssign = isNotAssignedUser(user);
            const initials = isNotAssign ? '' : getInitials(user);
            const colorClass = isNotAssign ? '' : getUserColor(user.id);
            const avatarStyle = isNotAssign ? avatarStylesUnassigned : avatarStyles24;
            const isChecked = stagedUsers.some(stagedUser => stagedUser.id === user.id);

            return (
              <div
                key={user.id}
                className="w-full flex items-center gap-1.5 py-1.5 hover:bg-accent transition-colors cursor-pointer"
                onClick={() => handleUserToggleClick(user, !isChecked)}
              >
                <Checkbox
                  checked={isChecked}
                  onCheckedChange={checked => handleUserToggleClick(user, checked as boolean)}
                  className="flex-shrink-0"
                  onClick={e => e.stopPropagation()}
                />

                <div className="flex items-center justify-center w-7 h-7">
                  <Avatar className={avatarStyle.container()}>
                    <AvatarFallback
                      className={cn(avatarStyle.fallback(), avatarStyle.text(), !isNotAssign && colorClass)}
                    >
                      {isNotAssign ? <User className={iconSize} /> : initials}
                    </AvatarFallback>
                  </Avatar>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm truncate">{user.name}</span>
                    {user.organization && (
                      <span className="text-sm text-muted-foreground truncate">{user.organization}</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 px-3 py-3 border-t border-border justify-between">
        <Button variant="ghost" size="sm" onClick={handleReset}>
          {t('common.user_selection.reset')}
        </Button>
        <Button size="sm" onClick={handleApplyFilter}>
          {t('common.user_selection.filter')}
        </Button>
      </div>
    </div>
  );
}
