import * as React from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { Check } from 'lucide-react';
import { tv, VariantProps } from 'tailwind-variants';

import { cn } from '@/lib/utils';

export const checkboxVariants = tv({
  slots: {
    base: 'peer shrink-0 rounded-xs border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring shadow-sm disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:border-primary data-[state=checked]:text-primary-foreground',
    icon: '',
  },
  variants: {
    size: {
      default: {
        base: 'w-4 h-4',
        icon: 'w-3 h-3',
      },
      xs: {
        base: 'w-3.5 h-3.5',
        icon: 'w-3 h-3',
      },
      sm: {
        base: 'w-4 h-4',
        icon: 'w-3 h-3',
      },
      md: {
        base: 'w-5 h-5',
        icon: 'w-4 h-4',
      },
      lg: {
        base: 'w-6 h-6',
        icon: 'w-5 h-5',
      },
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

export type CheckboxProps = React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> &
  VariantProps<typeof checkboxVariants>;

function Checkbox({ className, size, ...props }: CheckboxProps) {
  const style = checkboxVariants({ size });
  return (
    <CheckboxPrimitive.Root className={style.base({ className })} {...props}>
      <CheckboxPrimitive.Indicator className={cn('flex items-center justify-center text-current')}>
        <Check className={style.icon()} />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
