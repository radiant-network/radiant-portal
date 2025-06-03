import * as React from 'react';
import * as TogglePrimitive from '@radix-ui/react-toggle';

import { tv, type VariantProps } from 'tailwind-variants';

const toggleVariants = tv({
  slots: {
    base: 'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors bg-background hover:bg-muted enabled:hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 gap-2',
  },
  variants: {
    variant: {
      default: {
        base: '',
      },
      outline: {
        base: 'border border-input hover:bg-accent hover:text-accent-foreground',
      },
    },
    size: {
      default: {
        base: 'h-9 px-3 min-w-9',
      },
      sm: {
        base: 'h-8 px-2.5 min-w-8',
      },
      lg: {
        base: 'h-10 px-5 min-w-10',
      },
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});

function Toggle({
  className,
  variant,
  size,
  ...props
}: React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root> & VariantProps<typeof toggleVariants>) {
  const styles = toggleVariants({ variant, size, className });

  return <TogglePrimitive.Root className={styles.base({ className })} {...props} />;
}

Toggle.displayName = TogglePrimitive.Root.displayName;

export { Toggle, toggleVariants };
