import { cn } from '@/components/lib/utils';
import * as React from 'react';
import { tv, type VariantProps } from 'tailwind-variants';

const IndicatorVariants = tv({
  slots: {
    base: 'rounded-sm px-0 py-0 w-2 h-2',
  },
  variants: {
    variant: {
      default: {
        base: 'bg-primary text-primary-foreground',
      },
      secondary: {
        base: 'bg-secondary text-secondary-foreground',
      },
      destructive: {
        base: 'bg-destructive text-destructive-foreground',
      },
      outline: {
        base: 'text-foreground border',
      },
      amber: {
        base: 'bg-amber text-amber-foreground',
      },
      red: {
        base: 'bg-red text-red-foreground',
      },
      orange: {
        base: 'bg-orange text-orange-foreground',
      },
      yellow: {
        base: 'bg-yellow text-yellow-foreground',
      },
      lime: {
        base: 'bg-lime text-lime-foreground',
      },
      green: {
        base: 'bg-green text-green-foreground',
      },
      cyan: {
        base: 'bg-cyan text-cyan-foreground',
      },
      blue: {
        base: 'bg-blue text-blue-foreground',
      },
      violet: {
        base: 'bg-violet text-violet-foreground',
      },
      fuchsia: {
        base: 'bg-fuchsia text-fuchsia-foreground',
      },
      slate: {
        base: 'bg-slate text-slate-foreground',
      },
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export interface IndicatorProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof IndicatorVariants> {}

function Indicator({ className, variant, children, ...props }: IndicatorProps) {
  const styles = IndicatorVariants({ variant });

  return (
    <div className="flex gap-2 items-center">
      <div className={cn(styles.base({ className }))} {...props} />
      {children}
    </div>
  );
}

export { Indicator, IndicatorVariants };
