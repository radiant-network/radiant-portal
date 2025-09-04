// Main Avatar component
export { Avatar } from '@/components/base/assignation/avatar/avatar';

// User Selection
export { UserSelection, UserSelectionPopover } from '../user-selection';

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

// Shared utilities
export * from '../constants';
export * from '../user-filtering';
