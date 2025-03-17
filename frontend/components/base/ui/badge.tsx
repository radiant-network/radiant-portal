import { cn } from '@/components/lib/utils';
import { XIcon } from 'lucide-react';
import * as React from 'react';
import { tv, type VariantProps } from 'tailwind-variants';

const badgeVariants = tv({
  slots: {
    base: 'inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs transition-colors focus:outline-none focus:ring-2 focus:ring-ring',
    closeIcon: '',
  },
  variants: {
    variant: {
      default: 'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
      secondary: 'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
      destructive: 'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
      outline: 'text-foreground',
    },
    defaultVariants: {
      variant: 'default',
    },
  },
});

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {
  onClose?: () => void;
  closeIconProps?: React.HTMLAttributes<SVGElement>;
}

function Badge({ className, variant, children, closeIconProps, ...props }: BadgeProps) {
  const styles = badgeVariants({ variant });

  return (
    <div
      className={cn(styles.base({ className }), {
        'pr-1.5': props.onClose,
      })}
      {...props}
    >
      {children}
      {props.onClose && (
        <button onClick={props.onClose} className="ml-1">
          <XIcon size={12} className={styles.closeIcon()} {...closeIconProps} />
        </button>
      )}
    </div>
  );
}

export { Badge, badgeVariants };
