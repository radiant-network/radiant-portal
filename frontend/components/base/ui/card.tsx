import * as React from 'react';
import { tv, VariantProps } from 'tailwind-variants';

import { cn } from '@/lib/utils';

import { Separator } from './separator';

/**
 * Card
 */
const cardVariants = tv({
  slots: {
    base: 'bg-card text-card-foreground flex flex-col rounded-xl border shadow-xs',
  },
  variants: {
    size: {
      default: {
        base: 'gap-6 py-6',
      },
      sm: {
        base: 'py-0 gap-2',
      },
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

export type CardProps = React.ComponentProps<'div'> & VariantProps<typeof cardVariants>;

function Card({ className, size = 'default', ...props }: CardProps) {
  const style = cardVariants({ size });
  return <div data-slot="card" className={style.base({ className })} {...props} />;
}

/**
 * CardHeader
 */
const cardHeaderVariants = tv({
  slots: {
    base: '@container/card-header grid auto-rows-min items-start sm:grid-rows-[auto_auto] sm:has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-4',
  },
  variants: {
    size: {
      default: {
        base: 'sm:gap-1.5 px-6 gap-6',
      },
      sm: {
        base: 'py-0 px-2 gap-0 text-card-foreground font-semibold',
      },
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

type CardHeaderProps = React.ComponentProps<'div'> & VariantProps<typeof cardHeaderVariants>;

function CardHeader({ className, size, ...props }: CardHeaderProps) {
  const style = cardHeaderVariants({ size });
  return <div data-slot="card-header" className={style.base({ className })} {...props} />;
}

/**
 * CardTitle
 */
const cardTitleVariants = tv({
  base: 'leading-none font-semibold flex justify-start',
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

type CardTitleProps = React.ComponentProps<'div'> & VariantProps<typeof cardTitleVariants>;

function CardTitle({ className, size = 'base', ...props }: CardTitleProps) {
  return <div data-slot="card-title" className={cn(cardTitleVariants({ size }), className)} {...props} />;
}

/**
 * CardDescription
 */
function CardDescription({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="card-description" className={cn('text-muted-foreground text-sm', className)} {...props} />;
}

/**
 * CardAction
 */
function CardAction({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-action"
      className={cn('sm:col-start-2 sm:row-span-2 sm:row-start-1 sm:self-start sm:justify-self-end', className)}
      {...props}
    />
  );
}

/**
 * CardContent
 */
const cardContentVariants = tv({
  slots: {
    base: 'py-2',
  },
  variants: {
    variant: {
      base: '',
      outline: 'border-t-1 ',
    },
    size: {
      default: {
        base: 'px-4 md:px-6',
      },
      sm: {
        base: 'px-3',
      },
    },
  },
  defaultVariants: {
    size: 'default',
    variant: 'base',
  },
});

export type CardContentProps = React.ComponentProps<'div'> & VariantProps<typeof cardContentVariants>;

function CardContent({ className, size, variant, ...props }: CardContentProps) {
  const style = cardContentVariants({ size, variant });
  return <div data-slot="card-content" className={style.base({ className })} {...props} />;
}

/**
 * CardSeparator
 */
function CardSeparator({ ...props }: React.ComponentProps<'div'>) {
  return (
    <div {...props}>
      <Separator orientation="vertical" />
      <Separator className="md:hidden" />
    </div>
  );
}

/**
 * CardFooter
 */
const cardFooterVariants = tv({
  slots: {
    base: 'border-t-1 flex items-center',
  },
  variants: {
    size: {
      default: {
        base: 'px-4 md:px-6',
      },
      sm: {
        base: 'px-3',
      },
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

export type CardFooterProps = React.ComponentProps<'div'> & VariantProps<typeof cardFooterVariants>;

function CardFooter({ className, size, ...props }: CardFooterProps) {
  const style = cardContentVariants({ size });
  return <div data-slot="card-footer" className={style.base({ className })} {...props} />;
}

export { Card, CardHeader, CardSeparator, CardFooter, CardTitle, CardAction, CardDescription, CardContent };
