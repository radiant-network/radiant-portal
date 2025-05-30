import React from 'react';
import { cn } from '../lib/utils';
import { tv, VariantProps } from 'tailwind-variants';

export const numberBadgeVariants = tv({
  slots: {
    base: 'relative',
    badge: 'absolute h-[14px] px-[3px] rounded text-xs leading-[14px]',
  },
  variants: {
    variant: {
      default: {
        badge: 'bg-primary text-primary-foreground',
      },
      ghost: {
        badge: 'bg-background text-muted-foreground',
      },
      destructive: {
        badge: 'bg-destructive text-destructive-foreground',
      },
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

interface NumberBadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof numberBadgeVariants> {
  count: number;
  offsetTop?: number;
}

function NumberBadge({ count, className, children, offsetTop = 5, variant, ...props }: NumberBadgeProps) {
  const styles = numberBadgeVariants({ variant });

  return (
    <div className={styles.base({ className })} {...props}>
      <div
        className={styles.badge({
          className: cn({
            'right-[-12px]': count > 9,
            'right-[-8px]': count <= 9,
            'right-[-18px]': count > 99,
          }),
        })}
        style={{ top: -1 * offsetTop }}
      >
        {count > 99 ? '99+' : count}
      </div>
      {children}
    </div>
  );
}

export default NumberBadge;
