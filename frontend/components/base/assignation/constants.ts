import type { AvatarUser } from '@/components/base/avatar/avatar.types';

/**
 * Shared constants for assignation components
 */
export const ASSIGNATION_CONSTANTS = {
  // Special user ID for "not assigned" state
  NOT_ASSIGNED_USER_ID: 'not-assign',
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
