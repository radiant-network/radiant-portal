import * as React from 'react';
import { Slot, Slottable } from '@radix-ui/react-slot';
import { VariantProps } from 'tailwind-variants';

import { buttonVariants } from '@/base/buttons';

import { Spinner } from '../spinner';

export interface ButtonProps extends React.ComponentProps<'button'>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const Button = function ({
  className,
  variant,
  size,
  children,
  asChild = false,
  loading = false,
  disabled = false,
  iconOnly,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : 'button';
  const style = buttonVariants({ variant, size, iconOnly, disabled: disabled });

  return (
    <Comp className={style.base({ className })} data-variant={variant} disabled={disabled || loading} {...props}>
      {loading && <Spinner />}
      {iconOnly && loading ? null : <Slottable>{children}</Slottable>}
    </Comp>
  );
};

Button.displayName = 'Button';

export { Button, buttonVariants };
