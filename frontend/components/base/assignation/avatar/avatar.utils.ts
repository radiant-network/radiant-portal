import { AvatarUser } from './avatar.types';

/**
 * Generate initials from a user's name
 * If custom initials are provided, use those instead
 */
export function getInitials(user: AvatarUser): string {
  if (user.initials) {
    return user.initials.substring(0, 2).toUpperCase();
  }

  if (!user.name || typeof user.name !== 'string') {
    return '';
  }

  const words = user.name.trim().split(/\s+/);

  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  } else {
    return words[0].substring(0, 2).toUpperCase();
  }
}

/**
 * Generate a consistent background color for a user based on their ID
 * This ensures the same user always gets the same color
 *
 * Uses HSL color generation similar to ferlab-ui but with the project's theme colors
 */
export function getUserColor(userId: string): string {
  // Available theme-aware colors from the design system that work well with white text
  const colors = [
    'bg-amber', // --color-amber with theme support
    'bg-red', // --color-red with theme support
    'bg-orange', // --color-orange with theme support
    'bg-lime', // --color-lime with theme support
    'bg-green', // --color-green with theme support
    'bg-cyan', // --color-cyan with theme support
    'bg-blue', // --color-blue with theme support
    'bg-violet', // --color-violet with theme support
    'bg-fuchsia', // --color-fuchsia with theme support
  ];

  // Hash function similar to ferlab-ui for consistency
  let hash = 0;
  if (userId.length) {
    for (let i = 0; i < userId.length; i += 1) {
      hash = userId.charCodeAt(i) + ((hash << 5) - hash);
      hash &= hash; // Keep it 32bit
    }
  }

  return colors[Math.abs(hash) % colors.length];
}

/**
 * Get size classes for avatar dimensions
 */
export function getSizeClasses(size: 'sm' | 'md' | 'lg' = 'md'): {
  container: string;
  text: string;
} {
  const sizeMap = {
    sm: {
      container: 'h-5 w-5', // 20px
      text: 'text-xs', // 12px
    },
    md: {
      container: 'h-6 w-6', // 24px (default)
      text: 'text-xs', // 12px
    },
    lg: {
      container: 'h-8 w-8', // 32px
      text: 'text-sm', // 14px
    },
  };

  return sizeMap[size];
}
