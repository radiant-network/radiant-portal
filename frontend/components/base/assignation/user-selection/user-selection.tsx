import { useState } from 'react';
import { User, X } from 'lucide-react';

import { Avatar, AvatarFallback } from '@/components/base/ui/avatar';
import { useI18n } from '@/components/hooks/i18n';
import { cn } from '@/components/lib/utils';

import { avatarStyles, getIconSize } from '../avatar/avatar.styles';
import { AvatarUser } from '../avatar/avatar.types';
import { getInitials, getUserColor } from '../avatar/avatar.utils';
import { isNotAssignedUser } from '../constants';
import { createFilteredUserList, handleUserSelection } from '../user-filtering';

// Shared component for displaying selected users
function SelectedUsersDisplay({
  selectedUsers,
  onRemoveUser,
  readOnly = false,
}: {
  selectedUsers: AvatarUser[];
  onRemoveUser?: (user: AvatarUser) => void;
  readOnly?: boolean;
}) {
  const avatarStyles24 = avatarStyles({ size: 'md', variant: 'single' });
  const avatarStylesUnassigned = avatarStyles({ size: 'sm', variant: 'unassigned' });
  const iconSize = getIconSize('sm');

  return (
    <>
      {selectedUsers.map(user => {
        const isNotAssign = user.id === 'not-assign';
        const initials = isNotAssign ? '' : getInitials(user);
        const colorClass = isNotAssign ? '' : getUserColor(user.id);
        const avatarStyle = isNotAssign ? avatarStylesUnassigned : avatarStyles24;

        return (
          <div key={user.id} className="relative inline-flex items-center text-sm flex-shrink-0">
            {/* Background that starts from middle of avatar - adjust for smaller unassigned avatar */}
            <div
              className={cn(
                'absolute right-0 top-0.5 bottom-0.5 bg-gray-200 rounded-r-md',
                isNotAssign ? 'left-3' : 'left-3.5',
              )}
            ></div>

            {/* Avatar */}
            <div className="flex items-center z-10">
              <Avatar className={cn(avatarStyle.container(), 'z-20', isNotAssign && 'bg-background')}>
                <AvatarFallback className={cn(avatarStyle.fallback(), avatarStyle.text(), !isNotAssign && colorClass)}>
                  {isNotAssign ? <User className={iconSize} /> : initials}
                </AvatarFallback>
              </Avatar>
            </div>

            {/* Text and Remove Button */}
            <div className="inline-flex items-center gap-2 px-2 py-1 h-7 z-10 ml-2">
              {/* User Name and Organization */}
              <div className="flex items-center gap-1">
                <span className="font-medium text-gray-900">{user.name}</span>
                {user.organization && <span className="text-gray-500">{user.organization}</span>}
              </div>

              {/* Remove Button - only show if not read-only */}
              {!readOnly && onRemoveUser && (
                <button
                  onClick={() => onRemoveUser(user)}
                  className="text-gray-400 hover:text-gray-600 ml-1 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        );
      })}
    </>
  );
}

// Read-only component for displaying selected users
interface ReadOnlyUserSelectionProps {
  selectedUsers: AvatarUser[];
  className?: string;
}

export function ReadOnlyUserSelection({ selectedUsers }: ReadOnlyUserSelectionProps) {
  if (selectedUsers.length === 0) {
    return null;
  }

  return (
    <div className="pt-3 pb-1.5">
      <div className="flex flex-wrap items-center gap-2 min-h-9 w-full rounded-md border border-input bg-background pl-3 pr-3 py-2 text-sm shadow-xs">
        <SelectedUsersDisplay selectedUsers={selectedUsers} readOnly={true} />
      </div>
    </div>
  );
}

// Editable component for user selection
interface EditableUserSelectionProps {
  availableUsers: AvatarUser[];
  selectedUsers: AvatarUser[];
  onUsersChange: (users: AvatarUser[]) => void;
  defaultUser?: AvatarUser;
  placeholder?: string;
  className?: string;
  isOpen?: boolean;
}

export function EditableUserSelection({
  availableUsers,
  selectedUsers,
  onUsersChange,
  defaultUser,
  placeholder,
  isOpen = true,
}: EditableUserSelectionProps) {
  const { t } = useI18n();
  const [searchTerm, setSearchTerm] = useState('');

  const defaultPlaceholder = placeholder || t('common.user_selection.search_placeholder');

  // Create filtered user list using shared utility
  const allFilteredUsers = createFilteredUserList({
    availableUsers,
    searchTerm,
    selectedUsers,
    defaultUser,
    includeNotAssigned: true,
    notAssignedName: t('common.user_selection.not_assigned'),
  });

  const handleUserSelect = (user: AvatarUser) => {
    const newSelectedUsers = handleUserSelection({
      selectedUser: user,
      currentSelectedUsers: selectedUsers,
      isNotAssignedUser: isNotAssignedUser(user),
    });
    onUsersChange(newSelectedUsers);
  };

  const handleRemoveAll = () => {
    onUsersChange([]);
    setSearchTerm('');
  };

  const handleRemoveUser = (userToRemove: AvatarUser) => {
    onUsersChange(selectedUsers.filter(user => user.id !== userToRemove.id));
  };

  const avatarStyles24 = avatarStyles({ size: 'md', variant: 'single' });
  const avatarStylesUnassigned = avatarStyles({ size: 'sm', variant: 'unassigned' });
  const iconSize = getIconSize('sm');

  if (!isOpen) {
    return null;
  }

  return (
    <>
      {/* Search Bar with Selected Users */}
      <div className="pt-3 pb-1.5">
        <div className="flex flex-wrap items-center gap-2 min-h-9 w-full rounded-md border border-input bg-background pl-3 pr-3 py-2 text-sm shadow-xs ring-offset-background focus-within:outline-none focus-within:ring-1 focus-within:ring-ring focus-within:ring-offset-0">
          <SelectedUsersDisplay selectedUsers={selectedUsers} onRemoveUser={handleRemoveUser} />

          {/* Search Input */}
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder={selectedUsers.length === 0 ? defaultPlaceholder : ''}
            className="flex-1 min-w-32 bg-transparent border-0 outline-none text-sm placeholder:text-muted-foreground"
          />
        </div>
      </div>

      {/* Remove All Assignment Link */}
      <div className="pt-1.5 pb-1.5">
        <button
          onClick={selectedUsers.length > 0 ? handleRemoveAll : undefined}
          disabled={selectedUsers.length === 0}
          className={cn(
            'text-sm underline transition-colors',
            selectedUsers.length > 0
              ? 'text-blue-600 hover:text-blue-800 cursor-pointer'
              : 'text-gray-400 cursor-not-allowed',
          )}
        >
          {t('common.user_selection.remove_assignment')}
        </button>
      </div>

      {/* Users List */}
      <div className="max-h-60 overflow-y-auto">
        {allFilteredUsers.length === 0 ? (
          <div className="py-1.5 text-sm text-muted-foreground text-center">
            {searchTerm ? t('common.user_selection.no_users_found') : t('common.user_selection.start_typing_to_search')}
          </div>
        ) : (
          allFilteredUsers.map(user => {
            const isNotAssign = user.id === 'not-assign';
            const initials = isNotAssign ? '' : getInitials(user);
            const colorClass = isNotAssign ? '' : getUserColor(user.id);
            const avatarStyle = isNotAssign ? avatarStylesUnassigned : avatarStyles24;

            return (
              <button
                key={user.id}
                onClick={() => handleUserSelect(user)}
                className="w-full flex items-center gap-1.5 py-1.5 hover:bg-accent transition-colors text-left"
              >
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
              </button>
            );
          })
        )}
      </div>
    </>
  );
}

// Legacy component for backward compatibility
interface UserSelectionProps {
  availableUsers: AvatarUser[];
  selectedUsers: AvatarUser[];
  onUsersChange: (users: AvatarUser[]) => void;
  defaultUser?: AvatarUser;
  placeholder?: string;
  className?: string;
  isOpen?: boolean;
  readOnly?: boolean;
}

export function UserSelection({
  availableUsers,
  selectedUsers,
  onUsersChange,
  defaultUser,
  placeholder,
  className,
  isOpen = true,
  readOnly = false,
}: UserSelectionProps) {
  return (
    <div className={cn('bg-background border border-border rounded-md shadow-sm px-3', className)}>
      {readOnly ? (
        <ReadOnlyUserSelection selectedUsers={selectedUsers} className={className} />
      ) : (
        <EditableUserSelection
          availableUsers={availableUsers}
          selectedUsers={selectedUsers}
          onUsersChange={onUsersChange}
          defaultUser={defaultUser}
          placeholder={placeholder}
          className={className}
          isOpen={isOpen}
        />
      )}
    </div>
  );
}
