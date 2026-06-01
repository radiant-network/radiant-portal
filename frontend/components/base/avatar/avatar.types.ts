export interface AvatarUser {
  id: string;
  name: string;
  initials?: string;
  email?: string;
  organization?: string;
}

export interface AvatarProps {
  users?: AvatarUser[];
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  canAssign?: boolean;
  onAssignClick?: () => void;
}

export interface BaseAvatarProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  canAssign?: boolean;
  onAssignClick?: () => void;
}

export interface SingleAvatarProps extends BaseAvatarProps {
  user: AvatarUser;
}

export interface DualAvatarProps extends BaseAvatarProps {
  users: [AvatarUser, AvatarUser];
}

export interface CountAvatarProps extends BaseAvatarProps {
  firstUser: AvatarUser;
  additionalCount: number;
  allUsers?: AvatarUser[]; // All users for popover, if available
}
