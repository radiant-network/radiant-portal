import { LucideIcon } from 'lucide-react';
import { tv, VariantProps } from 'tailwind-variants';

import { cn } from '@/components/lib/utils';

const inputVariants = tv({
  slots: {
    base: 'flex w-full rounded-md border border-input bg-background shadow-xs ring-offset-background file:border-0 file:bg-transparent file:text-foreground file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50',
  },
  variants: {
    variant: {
      default: {
        base: 'h-9 px-3 py-2 text-sm ',
      },
      facet: {
        base: 'h-7 px-3 py-2 text-sm',
      },
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export type InputProps = React.ComponentProps<'input'> &
  VariantProps<typeof inputVariants> & {
    startIcon?: LucideIcon;
    endIcon?: LucideIcon;
    wrapperClassName?: string;
  };

function Input({
  wrapperClassName,
  variant,
  className,
  type,
  startIcon: StartIcon,
  endIcon: EndIcon,
  ...props
}: InputProps) {
  const style = inputVariants({ variant });

  return (
    <div className={cn('relative', wrapperClassName)}>
      {StartIcon && (
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
          <StartIcon size={16} className="text-muted-foreground" />
        </div>
      )}
      <input
        type={type}
        className={cn(
          style.base({ className }),
          {
            '!pl-8': !!StartIcon,
            '!pr-8': !!EndIcon,
          },
          className,
        )}
        {...props}
      />
      {EndIcon && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <EndIcon size={16} className="text-muted-foreground" />
        </div>
      )}
    </div>
  );
}
Input.displayName = 'Input';

export { Input };
