import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { buttonVariants } from '@/base/buttons';
import { VariantProps } from 'tailwind-variants';
import { Spinner } from '../spinner';

export interface ButtonProps extends React.ComponentProps<'button'>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, children, asChild = false, loading = false, disabled = false, iconOnly, ...props },
    ref,
  ) => {
    const Comp = asChild ? Slot : 'button';
    const style = buttonVariants({ variant, size, iconOnly });

    return (
      <Comp ref={ref} className={style.base({ className })} disabled={disabled || loading} {...props}>
        {loading && <Spinner />}
        {iconOnly && loading ? null : children}
      </Comp>
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
