import * as React from 'react';
import * as SwitchPrimitives from '@radix-ui/react-switch';

import { tv, VariantProps } from 'tailwind-variants';

const switchVariants = tv({
  slots: {
    base: 'peer inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring  focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input',
    thumb:
      'pointer-events-none block rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=unchecked]:translate-x-0',
  },
  variants: {
    size: {
      default: {
        base: 'h-5 w-9',
        thumb: 'size-4 data-[state=checked]:translate-x-4',
      },
      xs: {
        base: 'h-4 w-7',
        thumb: 'size-3 data-[state=checked]:translate-x-3',
      },
      sm: {
        base: 'h-5 w-9',
        thumb: 'size-4 data-[state=checked]:translate-x-4',
      },
      md: {
        base: 'h-6 w-11',
        thumb: 'size-5 data-[state=checked]:translate-x-5',
      },
      lg: {
        base: 'h-7 w-12',
        thumb: 'size-6 data-[state=checked]:translate-x-5',
      },
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

function Switch({
  className,
  size,
  ...props
}: React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root> & VariantProps<typeof switchVariants>) {
  const style = switchVariants({ size });

  return (
    <SwitchPrimitives.Root className={style.base({ className })} {...props}>
      <SwitchPrimitives.Thumb className={style.thumb()} />
    </SwitchPrimitives.Root>
  );
}
Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
