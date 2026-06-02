// Main Avatar component
export { Avatar } from '@/components/base/avatar/avatar';

// Types
export type {
  AvatarUser,
  AvatarProps,
  BaseAvatarProps,
  SingleAvatarProps,
  DualAvatarProps,
  CountAvatarProps,
} from './avatar.types';

// Utilities
export { getInitials, getUserColor } from './avatar.utils';

// Centralized Styles
export { avatarStyles, getIconSize } from './avatar.styles';
