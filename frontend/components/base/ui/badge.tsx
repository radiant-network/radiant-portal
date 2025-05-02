import { cn } from '@/components/lib/utils';
import { XIcon } from 'lucide-react';
import * as React from 'react';
import { tv, type VariantProps } from 'tailwind-variants';

const badgeVariants = tv({
  slots: {
    base: 'inline-flex items-center shadow-sm rounded-md transition-colors px-1.5 py-0.5 text-xs [&_svg]:size-3 gap-1 outline-none font-medium',
    closeIcon: '',
  },
  variants: {
    clickable: {
      true: {
        base: 'cursor-pointer focus:ring-2 focus:ring-offset-2 focus:ring-ring',
      },
    },
    closable: {
      true: {
        base: '',
        closeIcon: 'opacity-65 hover:opacity-100',
      },
    },
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
      red: {
        base: 'bg-red/20 text-red-foreground',
      },
      orange: {
        base: 'bg-orange/20 text-orange-foreground',
      },
      yellow: {
        base: 'bg-yellow/20 text-yellow-foreground',
      },
      lime: {
        base: 'bg-lime/20 text-lime-foreground',
      },
      green: {
        base: 'bg-green/20 text-green-foreground',
      },
      cyan: {
        base: 'bg-cyan/20 text-cyan-foreground',
      },
      blue: {
        base: 'bg-blue/20 text-blue-foreground',
      },
      violet: {
        base: 'bg-violet/20 text-violet-foreground',
      },
      fuchsia: {
        base: 'bg-fuchsia/20 text-fuchsia-foreground',
      },
      slate: {
        base: 'bg-slate/20 text-slate-foreground',
      },
    },
  },
  compoundVariants: [
    {
      clickable: true,
      variant: 'default',
      className: 'hover:bg-primary/90',
    },
    {
      clickable: true,
      variant: 'secondary',
      className: 'hover:bg-secondary/80',
    },
    {
      clickable: true,
      variant: 'destructive',
      className: 'hover:bg-destructive/90',
    },
    {
      clickable: true,
      variant: 'outline',
      className: 'hover:bg-accent',
    },
    {
      clickable: true,
      variant: 'red',
      className: 'hover:bg-red/15',
    },
    {
      clickable: true,
      variant: 'orange',
      className: 'hover:bg-orange/15',
    },
    {
      clickable: true,
      variant: 'yellow',
      className: 'hover:bg-yellow/15',
    },
    {
      clickable: true,
      variant: 'lime',
      className: 'hover:bg-lime/15',
    },
    {
      clickable: true,
      variant: 'green',
      className: 'hover:bg-green/15',
    },
    {
      clickable: true,
      variant: 'cyan',
      className: 'hover:bg-cyan/15',
    },
    {
      clickable: true,
      variant: 'blue',
      className: 'hover:bg-blue/15',
    },
    {
      clickable: true,
      variant: 'violet',
      className: 'hover:bg-violet/15',
    },
    {
      clickable: true,
      variant: 'fuchsia',
      className: 'hover:bg-fuchsia/15',
    },
    {
      clickable: true,
      variant: 'slate',
      className: 'hover:bg-slate/15',
    },
  ],
  defaultVariants: {
    variant: 'default',
  },
});

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {
  onClose?: () => void;
  closeIconProps?: React.HTMLAttributes<SVGElement>;
}

function Badge({ className, variant, children, closeIconProps, ...props }: BadgeProps) {
  const styles = badgeVariants({ variant, closable: !!props.onClose, clickable: !!props.onClick });

  return (
    <div className={cn(styles.base({ className }))} {...props}>
      {children}
      {props.onClose && (
        <button onClick={props.onClose}>
          <XIcon {...closeIconProps} className={styles.closeIcon({ className: closeIconProps?.className })} />
        </button>
      )}
    </div>
  );
}

export { Badge, badgeVariants };
