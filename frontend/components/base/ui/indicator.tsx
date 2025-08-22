import * as React from 'react';
import { tv } from 'tailwind-variants';

import { cn } from '@/components/lib/utils';

import ShapeCircleIcon from '../icons/shape-circle-icon';
import ShapeDiamondIcon from '../icons/shape-diamond-icon';
import ShapeTriangleDownIcon from '../icons/shape-triangle-down-icon';
import ShapeTriangleUpIcon from '../icons/shape-triangle-up-icon';

export type IndicatorVariant = 'red' | 'amber' | 'emerald' | 'blue' | 'fuchsia' | 'grey';

const IndicatorVariants = tv({
  slots: {
    base: 'shrink-0',
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
    size: {
      sm: {
        base: '!w-2.5 !h-2.5',
      },
      lg: {
        base: '!w-3.5 !h-3.5',
      },
    },
  },
});

export interface IndicatorProps extends React.HTMLAttributes<HTMLDivElement> {
  variant: 'red' | 'amber' | 'emerald' | 'blue' | 'fuchsia' | 'grey';
  symbol?: 'triangle-up' | 'triangle-down' | 'diamond' | 'circle';
  size?: 'lg' | 'sm';
}

function Indicator({ className, variant, size = 'lg', symbol = 'circle', children, ...props }: IndicatorProps) {
  const styles = IndicatorVariants({ variant });
  const iconProps = { className: cn(styles.base({ size })) };

  return (
    <div className={cn('flex items-center gap-2', className)} {...props}>
      {
        {
          'triangle-up': <ShapeTriangleUpIcon {...iconProps} />,
          'triangle-down': <ShapeTriangleDownIcon {...iconProps} />,
          diamond: <ShapeDiamondIcon {...iconProps} />,
          circle: <ShapeCircleIcon {...iconProps} />,
        }[symbol]
      }
      {children}
    </div>
  );
}

export { Indicator, IndicatorVariants };
