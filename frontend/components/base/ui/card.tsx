import * as React from 'react';
import { tv } from 'tailwind-variants';

import { cn } from '@/lib/utils';
import { Separator } from './separator';

export type CardProps = React.ComponentProps<'div'>;

function Card({ className, ...props }: CardProps) {
  return (
    <div
      data-slot="card"
      className={cn('bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-xs', className)}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        '@container/card-header grid auto-rows-min items-start gap-6 sm:gap-1.5 px-6 sm:grid-rows-[auto_auto] sm:has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-4',
        className,
      )}
      {...props}
    />
  );
}

const cardTitleVariants = tv({
  base: 'leading-none font-semibold',
  variants: {
    size: {
      base: 'text-base',
      xs: 'text-xs',
      sm: 'text-sm',
      md: 'text-md',
      xl: 'text-xl',
    },
  },
});
type CardTitleProps = React.ComponentProps<'div'> & {
  size?: 'base' | 'xs' | 'sm' | 'md' | 'xl';
};
function CardTitle({ className, size = 'base', ...props }: CardTitleProps) {
  return <div data-slot="card-title" className={cardTitleVariants({ size })} {...props} />;
}

function CardDescription({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="card-description" className={cn('text-muted-foreground text-sm', className)} {...props} />;
}

function CardAction({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-action"
      className={cn('sm:col-start-2 sm:row-span-2 sm:row-start-1 sm:self-start sm:justify-self-end', className)}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="card-content" className={cn('px-6', className)} {...props} />;
}

function CardSeparator({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div {...props}>
      <Separator orientation="vertical" />
      <Separator className="md:hidden" />
    </div>
  );
}

function CardFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div data-slot="card-footer" className={cn('flex items-center px-6 [.border-t]:pt-6', className)} {...props} />
  );
}

export { Card, CardHeader, CardSeparator, CardFooter, CardTitle, CardAction, CardDescription, CardContent };
