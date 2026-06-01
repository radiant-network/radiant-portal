import { tv } from 'tailwind-variants';

/**
 * Centralized avatar styles for consistent sizing across all avatar components
 *
 * Note: All avatars use 2px borders, so outer dimensions are calculated as:
 * content size + 4px (2px border on each side)
 */
export const avatarStyles = tv({
  slots: {
    container: 'relative flex shrink-0 overflow-hidden rounded-full',
    fallback: 'flex h-full w-full items-center justify-center rounded-full font-normal',
    text: 'text-white',
  },
  variants: {
    size: {
      sm: {
        container: '!h-6 !w-6', // 24px outer = 20px content
        fallback: 'text-xs font-normal leading-5 tracking-wider', // 12px, 400 weight, 20px line-height, 0.4px letter-spacing
      },
      md: {
        container: '!h-7 !w-7', // 28px outer = 24px content (default)
        fallback: 'text-xs font-normal leading-5 tracking-wider', // 12px, 400 weight, 20px line-height, 0.4px letter-spacing
      },
      lg: {
        container: '!h-10 !w-10', // 40px outer = 32px content
        fallback: 'text-sm font-normal leading-5 tracking-wide', // 14px with font-weight: 400
      },
    },
    variant: {
      single: {
        container: 'border-2 border-transparent',
      },
      dual: {
        container: 'border-2 border-background relative',
      },
      count: {
        container: 'border-2 border-background relative',
      },
      unassigned: {
        container: 'border-2 border-dashed border-muted-foreground/40 bg-muted/20',
        fallback: 'bg-transparent',
        text: 'text-muted-foreground/60',
      },
    },
    position: {
      first: {
        container: 'z-10',
      },
      second: {
        container: 'z-20',
      },
    },
  },
  defaultVariants: {
    size: 'md',
    variant: 'single',
  },
});

/**
 * Get overlap offset classes for grouped avatars based on size
 */
export const getOverlapClasses = (size: 'sm' | 'md' | 'lg') => {
  const overlapMap = {
    sm: '-ml-3', // 20px avatars
    md: '-ml-3', // 24px avatars
    lg: '-ml-3', // 32px avatars
  };

  return overlapMap[size];
};

/**
 * Icon sizes for unassigned avatar based on size variant
 */
export const getIconSize = (size: 'sm' | 'md' | 'lg') => {
  const iconMap = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  return iconMap[size];
};
