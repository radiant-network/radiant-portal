import { useState } from 'react';

import { Button } from '@/components/base/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/base/ui/popover';
import { useI18n } from '@/components/hooks/i18n';

import { AvatarUser } from '../avatar/avatar.types';

import { UserSelection } from './user-selection';

interface UserSelectionPopoverProps {
  availableUsers: AvatarUser[];
  selectedUsers: AvatarUser[];
  onUsersChange: (users: AvatarUser[]) => void;
  placeholder?: string;
  triggerText?: string;
  className?: string;
}

export function UserSelectionPopover({
  availableUsers,
  selectedUsers,
  onUsersChange,
  placeholder,
  triggerText,
  className,
}: UserSelectionPopoverProps) {
  const { t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);

  const defaultPlaceholder = placeholder || t('common.user_selection.search');
  const defaultTriggerText = triggerText || t('common.user_selection.assignment');

  const handleUsersChange = (users: AvatarUser[]) => {
    onUsersChange(users);
    // Optionally close popover when user selects someone
    // setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className={className}>
          {defaultTriggerText}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0" align="start">
        <UserSelection
          availableUsers={availableUsers}
          selectedUsers={selectedUsers}
          onUsersChange={handleUsersChange}
          placeholder={defaultPlaceholder}
          isOpen={true}
        />
      </PopoverContent>
    </Popover>
  );
}
