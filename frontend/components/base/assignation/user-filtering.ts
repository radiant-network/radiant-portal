import { AvatarUser } from './avatar/avatar.types';
import { createNotAssignedUser, isNotAssignedUser } from './constants';

/**
 * Filters users based on search term
 */
export function filterUsersBySearch(users: AvatarUser[], searchTerm: string): AvatarUser[] {
  if (!searchTerm.trim()) {
    return users;
  }

  const lowerSearchTerm = searchTerm.toLowerCase();

  return users.filter(user => {
    const nameMatch = user.name.toLowerCase().includes(lowerSearchTerm);
    const organizationMatch = user.organization?.toLowerCase().includes(lowerSearchTerm) || false;
    return nameMatch || organizationMatch;
  });
}

/**
 * Creates filtered user list with special users (not-assigned, default user)
 */
export function createFilteredUserList({
  availableUsers,
  searchTerm,
  selectedUsers,
  defaultUser,
  includeNotAssigned = true,
  notAssignedName = 'Not assigned',
}: {
  availableUsers: AvatarUser[];
  searchTerm: string;
  selectedUsers: AvatarUser[];
  defaultUser?: AvatarUser;
  includeNotAssigned?: boolean;
  notAssignedName?: string;
}): AvatarUser[] {
  const notAssignedUser = createNotAssignedUser(notAssignedName);
  const lowerSearchTerm = searchTerm.toLowerCase();

  // Filter available users
  const filteredAvailableUsers = availableUsers.filter(user => {
    const matchesSearch = filterUsersBySearch([user], searchTerm).length > 0;
    const notSelected = !selectedUsers.some(selected => selected.id === user.id);
    const notDefaultUser = !defaultUser || user.id !== defaultUser.id;
    return matchesSearch && notSelected && notDefaultUser;
  });

  // Check if special users should be included
  const notAssignedMatches =
    includeNotAssigned &&
    notAssignedUser.name.toLowerCase().includes(lowerSearchTerm) &&
    !selectedUsers.some(selected => selected.id === notAssignedUser.id);

  const defaultUserMatches =
    defaultUser &&
    filterUsersBySearch([defaultUser], searchTerm).length > 0 &&
    !selectedUsers.some(selected => selected.id === defaultUser.id);

  // Build final list
  const result: AvatarUser[] = [];

  if (notAssignedMatches) {
    result.push(notAssignedUser);
  }

  if (defaultUserMatches) {
    result.push(defaultUser);
  }

  result.push(...filteredAvailableUsers);

  return result;
}

/**
 * Handles user selection logic for different scenarios
 */
export function handleUserSelection({
  selectedUser,
  currentSelectedUsers,
  isNotAssignedUser: isNotAssigned,
}: {
  selectedUser: AvatarUser;
  currentSelectedUsers: AvatarUser[];
  isNotAssignedUser: boolean;
}): AvatarUser[] {
  if (isNotAssigned) {
    // If selecting 'not-assign', replace all others with just this one
    return [selectedUser];
  } else {
    // For regular users, remove 'not-assign' if it exists and add the new user
    const filteredUsers = currentSelectedUsers.filter(u => !isNotAssignedUser(u));
    return [...filteredUsers, selectedUser];
  }
}

/**
 * Handles user toggle logic for checkbox-based selection
 */
export function handleUserToggle({
  user,
  isChecked,
  currentSelectedUsers,
}: {
  user: AvatarUser;
  isChecked: boolean;
  currentSelectedUsers: AvatarUser[];
}): AvatarUser[] {
  const isNotAssigned = isNotAssignedUser(user);

  if (isNotAssigned) {
    // If selecting 'not-assign', clear all others and add only this one
    return isChecked ? [user] : [];
  } else {
    if (isChecked) {
      // Remove 'not-assign' if it exists and add the new user
      const filteredUsers = currentSelectedUsers.filter(u => !isNotAssignedUser(u));
      return [...filteredUsers, user];
    } else {
      // Remove the user
      return currentSelectedUsers.filter(u => u.id !== user.id);
    }
  }
}
