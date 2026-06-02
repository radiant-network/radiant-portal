import type { AvatarColor } from '@/components/base/shadcn/avatar';

import type { AvatarUser } from './avatar.types';

/**
 * Generate initials from a user's name
 * If custom initials are provided, use those instead
 */
export function getInitials(user: Pick<AvatarUser, 'name' | 'initials'>): string {
  if (user.initials) {
    return user.initials.substring(0, 2).toUpperCase();
  }

  if (!user.name || typeof user.name !== 'string') {
    return '';
  }

  const words = user.name.trim().split(/\s+/);
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return words[0].substring(0, 2).toUpperCase();
}

/**
 * Theme-aware avatar colors from the design system.
 * `neutral` is intentionally excluded — it is reserved for the count chip.
 */
const AVATAR_COLORS: AvatarColor[] = [
  'red',
  'orange',
  'amber',
  'yellow',
  'lime',
  'green',
  'emerald',
  'teal',
  'cyan',
  'sky',
  'blue',
  'indigo',
  'violet',
  'purple',
  'fuchsia',
  'pink',
  'rose',
];

/**
 * Generate a consistent avatar color token for a user based on their ID.
 * This ensures the same user always gets the same color.
 */
export function getUserColor(userId: string): AvatarColor {
  // Hash function similar to ferlab-ui for consistency
  let hash = 0;
  if (userId.length) {
    for (let i = 0; i < userId.length; i += 1) {
      hash = userId.charCodeAt(i) + ((hash << 5) - hash);
      hash &= hash; // Keep it 32bit
    }
  }

  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}
