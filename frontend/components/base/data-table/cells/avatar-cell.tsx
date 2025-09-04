import { Avatar, AvatarUser } from '@/components/base/assignation/avatar';

export interface AvatarCellProps {
  users?: AvatarUser[];
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * Avatar cell component for use in data tables
 * Displays user assignment status using the Avatar component
 */
export function AvatarCell({ users, size = 'sm', className }: AvatarCellProps) {
  return (
    <div className="flex items-center">
      <Avatar users={users} size={size} className={className} />
    </div>
  );
}
