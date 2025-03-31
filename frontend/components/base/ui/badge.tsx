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
      default: {
        base: 'px-1.5 py-0.5 text-xs',
        closeIcon: 'w-3 h-3',
      },
      sm: {
        base: 'px-2 py-0.5 text-sm',
        closeIcon: 'w-3.5 h-3.5',
        closeButton: 'ml-1.5',
      },
      md: {
        base: 'px-3 py-1 text-md',
        closeIcon: 'w-4 h-4',
      },
    },
    closable: {
      true: {
        base: '',
      },
    },
    variant: {
      default: {
        base: 'border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80',
      },
      secondary: {
        base: 'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
      },
      destructive: {
        base: 'border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80',
      },
      outline: {
        base: 'text-foreground',
      },
    },
  },
  compoundVariants: [
    {
      closable: true,
      size: 'default',
      className: 'pr-1',
    },
    {
      closable: true,
      size: 'sm',
      className: 'pr-1.5',
    },
    {
      closable: true,
      size: 'md',
      className: 'pr-2',
    },
  ],
  defaultVariants: {
    size: 'default',
    variant: 'default',
  },
});

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {
  onClose?: () => void;
  closeIconProps?: React.HTMLAttributes<SVGElement>;
}

function Badge({ className, variant, size, children, closeIconProps, ...props }: BadgeProps) {
  const styles = badgeVariants({ variant, size, closable: !!props.onClose });

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
