import { Avatar, AvatarUser } from '@/components/base/avatar';
import type { AvatarSize } from '@/components/base/shadcn/avatar';

export interface AvatarCellProps {
  users?: AvatarUser[];
  size?: AvatarSize;
  className?: string;
}

/**
 * Avatar cell component for use in data tables
 * Displays user assignment status using the Avatar component
 */
export function AvatarCell({ users, size = 'xs', className }: AvatarCellProps) {
  return (
    <div className="flex items-center">
      <Avatar users={users} size={size} className={className} />
    </div>
  );
}
