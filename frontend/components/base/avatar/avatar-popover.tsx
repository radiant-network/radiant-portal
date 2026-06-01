import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/base/shadcn/hover-card';

import { AvatarUser } from './avatar.types';
import { AvatarUserItem } from './avatar-user-item';

interface AvatarPopoverProps {
  users: AvatarUser | AvatarUser[];
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  children: React.ReactNode;
}

export function AvatarPopover({ users, children }: AvatarPopoverProps) {
  // Normalize users to always be an array
  const usersArray = Array.isArray(users) ? users : [users];

  // Sort users alphabetically by last name
  const sortedUsers = usersArray.sort((a, b) => {
    const getLastName = (name: string) => {
      const words = name.trim().split(/\s+/);
      return words.length > 1 ? words[words.length - 1] : words[0];
    };

    const lastNameA = getLastName(a.name).toLowerCase();
    const lastNameB = getLastName(b.name).toLowerCase();

    return lastNameA.localeCompare(lastNameB);
  });

  const isSingleUser = sortedUsers.length === 1;

  return (
    <HoverCard>
      <HoverCardTrigger asChild>{children}</HoverCardTrigger>
      <HoverCardContent className="w-80 max-h-96 overflow-y-auto" side="top">
        <div className={isSingleUser ? '' : 'space-y-3'}>
          {sortedUsers.map(user => (
            <AvatarUserItem key={user.id} user={user} size="md" />
          ))}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
