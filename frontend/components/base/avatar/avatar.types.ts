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
}
