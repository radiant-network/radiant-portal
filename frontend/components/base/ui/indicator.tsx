import { cn } from '@/components/lib/utils';
import * as React from 'react';
import { tv, type VariantProps } from 'tailwind-variants';

export type IndicatorVariant = "red" | "amber" | "emerald" | "blue" | "fuchsia" | "grey";

const IndicatorVariants = tv({
  slots: {
    base: 'rounded-sm px-0 py-0 w-2 h-2',
  },
  variants: {
    variant: {
      red: {
        base: 'bg-indicator-red',
      },
      amber: {
        base: 'bg-indicator-amber',
      },
      emerald: {
        base: 'bg-indicator-emerald',
      },
      blue: {
        base: 'bg-indicator-blue',
      },
      fuchsia: {
        base: 'bg-indicator-fuchsia',
      },
      grey: {
        base: 'bg-indicator-grey',
      },
    },
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
