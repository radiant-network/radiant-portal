import { cn } from '@/components/lib/utils';
import * as React from 'react';
import { tv } from 'tailwind-variants';
import ShapeTriangleUpIcon from '../icons/shape-triangle-up-icon';
import ShapeTriangleDownIcon from '../icons/shape-triangle-down-icon';
import ShapeDiamondIcon from '../icons/shape-diamond-icon';
import ShapeCircleIcon from '../icons/shape-circle-icon';


export type IndicatorVariant = 'red' | 'amber' | 'emerald' | 'blue' | 'fuchsia' | 'grey';

const IndicatorVariants = tv({
  slots: {
    base: 'rounded-sm px-0 py-0 w-2 h-2',
  },
  variants: {
    variant: {
      red: {
        base: 'text-indicator-red',
      },
      amber: {
        base: 'text-indicator-amber',
      },
      emerald: {
        base: 'text-indicator-emerald',
      },
      blue: {
        base: 'text-indicator-blue',
      },
      fuchsia: {
        base: 'text-indicator-fuchsia',
      },
      grey: {
        base: 'text-indicator-grey',
      },
    },
  },
});



export interface IndicatorProps extends React.HTMLAttributes<HTMLDivElement> {
  variant: 'red' | 'amber' | 'emerald' | 'blue' | 'fuchsia' | 'grey';
  symbol?: 'triangle-up' | 'triangle-down' | 'diamond' | 'circle';
  size?: number;
}

function Indicator({ className, variant, size = 10, symbol = 'circle', children, ...props }: IndicatorProps) {
  const styles = IndicatorVariants({ variant });
  const iconProps = { size: size, className: "shrink-0" }

  return (
    <div className={cn('flex', { "items-center gap-2": !!children })}>
      <div className={cn(styles.base({ className }))} {...props}>
        {
          {
            "triangle-up": <ShapeTriangleUpIcon {...iconProps} />,
            "triangle-down": <ShapeTriangleDownIcon {...iconProps} />,
            "diamond": <ShapeDiamondIcon {...iconProps} />,
            "circle": <ShapeCircleIcon {...iconProps} />,
          }[symbol]
        }
      </div>
      {children}
    </div>
  );
}

export { Indicator, IndicatorVariants };
