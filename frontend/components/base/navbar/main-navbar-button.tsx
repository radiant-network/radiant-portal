import * as React from 'react';
import { Link } from 'react-router';
import { VariantProps } from 'tailwind-variants';

import { buttonVariants } from '@/components/base/shadcn/button';
import { cn } from '@/components/lib/utils';

type MainNavbarAnchorProps = {
  as: 'a';
  href: string;
  to?: never;
};

type MainNavbarButtonProps = {
  as: 'button';
  href?: never;
  to?: never;
};

type MainNavbarRouterLinkProps = {
  as: typeof Link;
  to: string;
  href?: never;
};

export type MainNavbarLinkProps = VariantProps<typeof buttonVariants> & {
  className?: string;
  title?: string;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
} & (MainNavbarAnchorProps | MainNavbarButtonProps | MainNavbarRouterLinkProps);

function MainNavbarLink({
  icon,
  rightIcon,
  title,
  iconOnly,
  active,
  className,
  variant = 'ghost',
  size,
  disabled,
  as,
  ...rest
}: MainNavbarLinkProps) {
  const styles = buttonVariants({ variant, iconOnly, size, disabled });

  let Component: React.ElementType;
  if (as === Link) {
    Component = Link;
  } else if (as === 'button') {
    Component = 'button';
  } else {
    Component = 'a';
  }

  let otherProps;
  if (as === Link) {
    otherProps = { to: rest.to };
  } else if (as === 'button') {
    otherProps = { type: 'button', onClick: rest.onClick };
  } else {
    otherProps = { href: rest.href };
  }

  return (
    <Component
      className={cn(
        styles.base(),
        'enabled text-muted-foreground text-base md:text-sm',
        {
          'h-10 md:h-7 py-2.5 md:py-1 px-2': !iconOnly,
          'md:size-7 [&_svg]:size-5': iconOnly,
          'text-primary': active,
        },
        className,
      )}
      {...otherProps}
      {...rest}
    >
      <span
        className={cn('flex flex-1 gap-2 items-center', {
          'justify-start md:justify-center': !iconOnly,
          'justify-center': iconOnly,
        })}
      >
        {icon} {iconOnly ? '' : title}
      </span>
      {rightIcon && <span className="[&_svg]:size-5">{rightIcon}</span>}
    </Component>
  );
}

export default MainNavbarLink;
