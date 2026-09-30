import type { AvatarSize } from '@/components/base/shadcn/avatar';

export interface AvatarUser {
  id: string;
  name: string;
  initials?: string;
  email?: string;
  organization?: string;
}

export interface AvatarProps {
  users?: AvatarUser[];
  size?: AvatarSize;
  /** Max number of avatars shown before collapsing the overflow into a `+N` count chip. */
  maxAvatars?: number;
  className?: string;
  canAssign?: boolean;
  onAssignClick?: () => void;
  /** Show the assignees hovercard; off when the avatar triggers the assignment picker. */
  showDetails?: boolean;
}

export interface BaseAvatarProps {
  size?: AvatarSize;
  className?: string;
  canAssign?: boolean;
  onAssignClick?: () => void;
}

export interface UserAvatarProps {
  user: AvatarUser;
  size?: AvatarSize;
  className?: string;
  popoverTitle?: string;
  showDetails?: boolean;
}
