import { cn } from '@/components/lib/utils';
import { XIcon } from 'lucide-react';
import * as React from 'react';
import { tv, type VariantProps } from 'tailwind-variants';

const badgeVariants = tv({
  slots: {
    base: 'inline-flex items-center shadow-sm rounded-md transition-colors focus:outline-none focus:ring-1 focus:ring-ring',
    closeIcon: '',
  },
  variants: {
    size: {
      sm: {
        base: 'px-1.5 py-0.5 text-xs',
        closeIcon: 'w-3 h-3',
      },
      md: {
        base: 'px-2 py-0.5 text-sm',
        closeIcon: 'w-3.5 h-3.5',
        closeButton: 'ml-1.5',
      },
      lg: {
        base: 'px-3 py-1 text-md',
        closeIcon: 'w-4 h-4',
      },
    },
    color: {
      primary: '',
      destructive: '',
      info: '',
      success: '',
      warning: '',
    },
    closable: {
      true: {
        base: '',
      },
    },
    variant: {
      filled: {
        base: '',
      },
      outlined: {
        base: 'border',
      },
    },
  },
  compoundVariants: [
    {
      closable: true,
      size: 'sm',
      className: 'pr-1',
    },
    {
      closable: true,
      size: 'md',
      className: 'pr-1.5',
    },
    {
      closable: true,
      size: 'lg',
      className: 'pr-2',
    },
    {
      color: 'primary',
      variant: 'filled',
      className: {
        base: 'bg-primary text-primary-foreground enabled:hover:bg-primary/90',
      },
    },
    {
      color: 'primary',
      variant: 'outlined',
      className: {
        base: 'border-primary text-primary',
      },
    },
    {
      color: 'destructive',
      variant: 'filled',
      className: {
        base: 'bg-destructive text-destructive-foreground',
      },
    },
    {
      color: 'destructive',
      variant: 'outlined',
      className: {
        base: 'border-destructive text-destructive',
      },
    },
    {
      color: 'info',
      variant: 'filled',
      className: {
        base: 'bg-info text-white',
      },
    },
    {
      color: 'info',
      variant: 'outlined',
      className: {
        base: 'border-info text-info',
      },
    },
    {
      color: 'success',
      variant: 'filled',
      className: {
        base: 'bg-success text-white',
      },
    },
    {
      color: 'success',
      variant: 'outlined',
      className: {
        base: 'border-success text-success',
      },
    },
    {
      color: 'warning',
      variant: 'filled',
      className: {
        base: 'bg-warning text-white',
      },
    },
    {
      color: 'warning',
      variant: 'outlined',
      className: {
        base: 'border-warning text-warning',
      },
    },
  ],
  defaultVariants: {
    size: 'sm',
    color: 'primary',
    variant: 'filled',
  },
});

export interface BadgeProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'color'>,
    VariantProps<typeof badgeVariants> {
  onClose?: () => void;
  closeIconProps?: React.HTMLAttributes<SVGElement>;
}

function Badge({ className, variant, color, size, children, closeIconProps, ...props }: BadgeProps) {
  const styles = badgeVariants({ variant, color, size, closable: !!props.onClose });

  return (
    <div className={cn(styles.base({ className }))} {...props}>
      {children}
      {props.onClose && (
        <button onClick={props.onClose} className="ml-1">
          <XIcon {...closeIconProps} className={styles.closeIcon({ className: closeIconProps?.className })} />
        </button>
      )}
    </div>
  );
}

export { Badge, badgeVariants };
