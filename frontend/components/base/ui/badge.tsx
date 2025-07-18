import { cn } from '@/components/lib/utils';
import { XIcon } from 'lucide-react';
import * as React from 'react';
import { tv, type VariantProps } from 'tailwind-variants';
import { Separator } from './separator';

const badgeVariants = tv({
  slots: {
    base: 'inline-flex items-center rounded-md transition-colors px-1.5 py-0.5 text-xs [&_svg]:size-3 gap-1 outline-none font-medium',
    closeIcon: '',
    countSeparator: '',
  },
  variants: {
    clickable: {
      true: {
        base: 'hover:cursor-pointer focus:ring-2 focus:ring-offset-2 focus:ring-ring',
      },
    },
    showCount: {
      true: {
        base: '',
        countSeparator: 'h-3.5 w-px opacity-65',
      },
    },
    iconOnly: {
      true: {
        base: 'size-5 p-0 items-center justify-center',
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
        countSeparator: 'bg-primary-foreground/65',
      },
      secondary: {
        base: 'bg-secondary text-secondary-foreground',
        countSeparator: 'bg-secondary-foreground/65',
      },
      destructive: {
        base: 'bg-destructive text-destructive-foreground',
        countSeparator: 'bg-destructive-foreground/65',
      },
      outline: {
        base: 'text-foreground border',
        countSeparator: 'bg-foreground/65',
      },
      amber: {
        base: 'bg-amber/20 text-amber-foreground',
        countSeparator: 'bg-amber-foreground/65',
      },
      red: {
        base: 'bg-red/20 text-red-foreground',
        countSeparator: 'bg-red-foreground/65',
      },
      orange: {
        base: 'bg-orange/20 text-orange-foreground',
        countSeparator: 'bg-orange-foreground/65',
      },
      yellow: {
        base: 'bg-yellow/20 text-yellow-foreground',
        countSeparator: 'bg-yellow-foreground/65',
      },
      lime: {
        base: 'bg-lime/20 text-lime-foreground',
        countSeparator: 'bg-lime-foreground/65',
      },
      green: {
        base: 'bg-green/20 text-green-foreground',
        countSeparator: 'bg-green-foreground/65',
      },
      cyan: {
        base: 'bg-cyan/20 text-cyan-foreground',
        countSeparator: 'bg-cyan-foreground/65',
      },
      blue: {
        base: 'bg-blue/20 text-blue-foreground',
        countSeparator: 'bg-blue-foreground/65',
      },
      violet: {
        base: 'bg-violet/20 text-violet-foreground',
        countSeparator: 'bg-violet-foreground/65',
      },
      fuchsia: {
        base: 'bg-fuchsia/20 text-fuchsia-foreground',
        countSeparator: 'bg-fuchsia-foreground/65',
      },
      neutral: {
        base: 'bg-neutral/20 text-neutral-foreground',
        countSeparator: 'bg-neutral-foreground/65',
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
      variant: 'amber',
      className: 'hover:bg-amber/15',
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
      variant: 'neutral',
      className: 'hover:bg-neutral/15',
    },
  ],
  defaultVariants: {
    variant: 'default',
  },
});

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    Omit<VariantProps<typeof badgeVariants>, 'showCount' | 'clickable' | 'closable'> {
  onClose?: () => void;
  count?: number;
}

function Badge({ className, variant, children, iconOnly, count, ...props }: BadgeProps) {
  const showCount = count !== undefined;
  const styles = badgeVariants({
    variant,
    closable: !!props.onClose,
    clickable: !!props.onClick,
    showCount,
    iconOnly,
  });

  return (
    <div className={cn(styles.base({ className }))} {...props}>
      {children}
      {showCount && (
        <>
          <Separator orientation="vertical" className={styles.countSeparator()} />
          <span>{count}</span>
        </>
      )}
      {props.onClose && (
        <button className="hover:cursor-pointer" onClick={props.onClose}>
          <XIcon className={styles.closeIcon()} />
        </button>
      )}
    </div>
  );
}

export { Badge, badgeVariants };
