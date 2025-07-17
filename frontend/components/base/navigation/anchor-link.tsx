import { ExternalLink } from 'lucide-react';
import React from 'react';
import { tv, VariantProps } from 'tailwind-variants';

export const anchorLinkVariants = tv({
  slots: {
    base: 'font-medium hover:underline hover:cursor-pointer underline-offset-3',
    icon: '',
  },
  variants: {
    mono: {
      true: {
        base: 'font-mono',
      },
    },
    external: {
      true: {
        base: 'flex items-center gap-1'
      }
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
    external: true,
  },
});

export type AnchorLinkProps<C extends React.ElementType> = {
  component?: C;
  className?: string;
  children: React.ReactNode;
  external?: boolean;
} & Omit<React.ComponentPropsWithoutRef<C>, 'className' | 'children'> &
  VariantProps<typeof anchorLinkVariants>;

function AnchorLink<C extends React.ElementType = 'a'>({
  component,
  className,
  children,
  size,
  variant,
  mono,
  external = false,
  ...props
}: AnchorLinkProps<C>) {
  const Component = component || 'a';
  const styles = anchorLinkVariants({ size, mono, variant, external });

  return (
    <Component className={styles.base({ className })} {...props}>
      {children}
      {external && <ExternalLink className={styles.icon()} />}

    </Component>
  );
}

export default AnchorLink;
