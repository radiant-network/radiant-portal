import { tv } from 'tailwind-variants';

export const baseButtonVariants = tv({
  slots: {
    base: 'inline-flex items-center justify-center hover:cursor-pointer whitespace-nowrap rounded-md gap-2 font-medium text-sm ring-offset-background transition-colors focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:size-4',
  },
  variants: {
    variant: {
      default: {
        base: 'bg-primary text-primary-foreground shadow-sm hover:bg-primary/90',
      },
      destructive: {
        base: 'bg-destructive text-destructive-foreground shadow-xs hover:bg-destructive/90',
      },
      outline: {
        base: 'border border-input bg-background text-foreground shadow-xs hover:bg-accent hover:text-accent-foreground',
      },
      secondary: {
        base: 'bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80',
      },
      ghost: {
        base: 'hover:bg-accent hover:text-accent-foreground',
      },
      link: {
        base: 'text-primary underline-offset-4 hover:underline',
      },
    },
    disabled: {
      true: {
        base: 'disabled:pointer-events-none',
      },
    },
    size: {
      xs: {
        base: 'h-7 px-2.5 py-2 gap-[6px] text-xs [&_svg]:size-3',
      },
      sm: {
        base: 'h-8 px-3 py-2',
      },
      default: {
        base: 'h-9 px-4 py-2',
      },
      lg: {
        base: 'h-10 px-8 py-2',
      },
    },
  },
});

export const buttonVariants = tv({
  extend: baseButtonVariants,
  slots: {
    base: '',
  },
  variants: {
    iconOnly: {
      true: {
        base: '',
      },
    },
  },
  compoundVariants: [
    {
      iconOnly: true,
      size: 'xs',
      className: {
        base: 'w-7 px-0',
      },
    },
    {
      iconOnly: true,
      size: 'sm',
      className: {
        base: 'w-8 px-0',
      },
    },
    {
      iconOnly: true,
      size: 'default',
      className: {
        base: 'w-9 px-0',
      },
    },
    {
      iconOnly: true,
      size: 'lg',
      className: {
        base: 'w-10 px-0',
      },
    },
  ],
  defaultVariants: {
    iconOnly: false,
    size: 'default',
    variant: 'default',
  },
});

export const actionButtonVariants = tv({
  extend: baseButtonVariants,
  slots: {
    container: 'flex items-center',
    actionsButton: 'rounded-l-none',
  },
  variants: {
    size: {
      xs: {
        actionsButton: 'h-7 px-1.5 [&_svg]:size-3',
      },
      sm: {
        actionsButton: 'h-8 px-2 [&_svg]:size-4',
      },
      default: {
        actionsButton: 'h-9 px-2 [&_svg]:size-5',
      },
      lg: {
        actionsButton: 'h-10 px-2 [&_svg]:size-6',
      },
    },
    variant: {
      outline: {
        base: 'hover:z-2',
        actionsButton: '-ml-px hover:z-2',
      },
      default: {
        container: 'divide-x divide-primary-foreground/30',
      },
      destructive: {
        container: 'divide-x divide-destructive-foreground/30',
      },
      secondary: {
        container: 'divide-x divide-secondary-foreground/30',
      },
    },
  },
  defaultVariants: {
    size: 'default',
    variant: 'default',
  },
});
