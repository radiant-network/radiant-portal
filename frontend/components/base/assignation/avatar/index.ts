// Main Avatar component
export { Avatar } from './avatar';

// Individual avatar state components
export { UnassignedAvatar } from './unassigned-avatar';
export { SingleAvatar } from './single-avatar';
export { DualAvatar } from './dual-avatar';
export { CountAvatar } from './count-avatar';

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
export { getInitials, getUserColor, getSizeClasses } from './avatar.utils';

// Centralized Styles
export { avatarStyles, getOverlapClasses, getIconSize } from './avatar.styles';
