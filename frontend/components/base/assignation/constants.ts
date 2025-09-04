import { AvatarUser } from './avatar/avatar.types';

/**
 * Shared constants for assignation components
 */
export const ASSIGNATION_CONSTANTS = {
  // Special user ID for "not assigned" state
  NOT_ASSIGNED_USER_ID: 'not-assign',

  // Default avatar sizes
  AVATAR_SIZES: {
    SMALL: 'sm' as const,
    MEDIUM: 'md' as const,
    LARGE: 'lg' as const,
  },

  // Avatar dimensions in pixels (content size, not including borders)
  AVATAR_DIMENSIONS: {
    sm: 20,
    md: 24,
    lg: 32,
  },

  // Maximum count display for count avatars
  MAX_COUNT_DISPLAY: 99,
} as const;

/**
 * Creates the "not assigned" user object
 * Note: The name should be overridden with translation in components that use this
 */
export function createNotAssignedUser(name?: string): AvatarUser {
  return {
    id: ASSIGNATION_CONSTANTS.NOT_ASSIGNED_USER_ID,
    name: name || 'Not assigned', // Default fallback, should be overridden with translation
    organization: '',
  };
}

/**
 * Checks if a user is the "not assigned" user
 */
export function isNotAssignedUser(user: AvatarUser): boolean {
  return user.id === ASSIGNATION_CONSTANTS.NOT_ASSIGNED_USER_ID;
}
