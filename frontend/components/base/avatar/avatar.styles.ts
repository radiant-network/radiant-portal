import { tv } from 'tailwind-variants';

import type { AvatarSize } from '@/components/base/shadcn/avatar';

/**
 * Styles for the unassigned avatar (dashed placeholder).
 * Every other avatar relies on the Avatar primitive's `size` / `color` props
 * and `AvatarGroup` for stacking — no custom sizing or colors here.
 */
export const avatarStyles = tv({
  slots: {
    container: 'relative flex shrink-0 overflow-hidden rounded-full',
    fallback: 'flex h-full w-full items-center justify-center rounded-full font-normal',
    text: '',
  },
  variants: {
    variant: {
      unassigned: {
        container: 'border-2 border-dashed border-muted-foreground/40 bg-muted/20',
        fallback: 'bg-transparent',
        text: 'text-muted-foreground/60',
      },
      assignment: {
        container: '',
        fallback: 'bg-transparent',
        text: 'text-muted-foreground/60',
      },
    },
  },
  defaultVariants: {
    variant: 'unassigned',
  },
});

/**
 * Icon sizes for the unassigned avatar based on the primitive's size scale
 */
export const getIconSize = (size: AvatarSize) => {
  const iconMap: Record<AvatarSize, string> = {
    '2xs': 'h-2.5 w-2.5',
    xs: 'h-3 w-3',
    sm: 'h-4 w-4',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
    xl: 'h-5 w-5',
    '2xl': 'h-6 w-6',
  };

  return iconMap[size];
};
