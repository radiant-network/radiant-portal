import { ExternalLink } from 'lucide-react';
import React from 'react';
import { tv, VariantProps } from 'tailwind-variants';

export const anchorLinkVariants = tv({
  slots: {
    base: 'flex items-center gap-1 font-medium hover:underline hover:cursor-pointer underline-offset-3',
    icon: '',
  },
  variants: {
    mono: {
      true: {
        base: 'font-mono',
      },
    },
    variant: {
      primary: {
        base: 'text-primary',
      },
      secondary: {
        base: 'text-foreground',
      },
    },
    size: {
      xs: {
        base: 'text-xs',
        icon: 'size-3',
      },
      default: {
        base: 'text-base',
        icon: 'size-3.5',
      },
      sm: {
        base: 'text-sm',
        icon: 'size-3.5',
      },
      lg: {
        base: 'text-lg',
        icon: 'size-3.5',
      },
    },
  },
  defaultVariants: {
    size: 'default',
    variant: 'primary',
    mono: false,
  },
});

type AnchorLinkProps<C extends React.ElementType> = {
  component?: C;
  className?: string;
  children: React.ReactNode;
} & Omit<React.ComponentPropsWithoutRef<C>, 'className' | 'children'> &
  VariantProps<typeof anchorLinkVariants>;

function AnchorLink<C extends React.ElementType = 'a'>({
  component,
  className,
  children,
  size,
  variant,
  mono,
  ...props
}: AnchorLinkProps<C>) {
  const Component = component || 'a';
  const styles = anchorLinkVariants({ size, mono, variant });

  return (
    <Component className={styles.base({ className })} {...props}>
      {children}
      <ExternalLink className={styles.icon()} />
    </Component>
  );
}

export default AnchorLink;
