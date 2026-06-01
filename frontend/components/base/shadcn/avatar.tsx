import * as React from 'react';
import { Avatar as AvatarPrimitive } from 'radix-ui';
import { tv, type VariantProps } from 'tailwind-variants';

import { cn } from '@/lib/utils';

const avatarVariants = tv({
  slots: {
    root: 'relative flex shrink-0 overflow-hidden rounded-full select-none',
    fallback: 'flex size-full items-center justify-center rounded-full font-medium',
    badge:
      'absolute right-0 bottom-0 z-10 inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground ring-2 ring-background select-none',
  },
  variants: {
    size: {
      '2xs': { root: 'size-5', fallback: 'text-xs', badge: 'size-2 [&>svg]:hidden' },
      xs: { root: 'size-6', fallback: 'text-xs', badge: 'size-2 [&>svg]:hidden' },
      sm: { root: 'size-7', fallback: 'text-sm', badge: 'size-2.5 [&>svg]:size-2' },
      md: { root: 'size-8', fallback: 'text-sm', badge: 'size-2.5 [&>svg]:size-2' },
      lg: { root: 'size-9', fallback: 'text-base', badge: 'size-3 [&>svg]:size-2' },
      xl: { root: 'size-10', fallback: 'text-base', badge: 'size-3 [&>svg]:size-2.5' },
      '2xl': { root: 'size-12', fallback: 'text-lg', badge: 'size-3.5 [&>svg]:size-3' },
    },
    color: {
      red: { fallback: 'bg-avatar-red text-avatar-red-foreground' },
      orange: { fallback: 'bg-avatar-orange text-avatar-orange-foreground' },
      amber: { fallback: 'bg-avatar-amber text-avatar-amber-foreground' },
      yellow: { fallback: 'bg-avatar-yellow text-avatar-yellow-foreground' },
      lime: { fallback: 'bg-avatar-lime text-avatar-lime-foreground' },
      green: { fallback: 'bg-avatar-green text-avatar-green-foreground' },
      emerald: { fallback: 'bg-avatar-emerald text-avatar-emerald-foreground' },
      teal: { fallback: 'bg-avatar-teal text-avatar-teal-foreground' },
      cyan: { fallback: 'bg-avatar-cyan text-avatar-cyan-foreground' },
      sky: { fallback: 'bg-avatar-sky text-avatar-sky-foreground' },
      blue: { fallback: 'bg-avatar-blue text-avatar-blue-foreground' },
      indigo: { fallback: 'bg-avatar-indigo text-avatar-indigo-foreground' },
      violet: { fallback: 'bg-avatar-violet text-avatar-violet-foreground' },
      purple: { fallback: 'bg-avatar-purple text-avatar-purple-foreground' },
      fuchsia: { fallback: 'bg-avatar-fuchsia text-avatar-fuchsia-foreground' },
      pink: { fallback: 'bg-avatar-pink text-avatar-pink-foreground' },
      rose: { fallback: 'bg-avatar-rose text-avatar-rose-foreground' },
      neutral: { fallback: 'bg-avatar-neutral text-avatar-neutral-foreground' },
    },
  },
  defaultVariants: {
    size: 'xs',
    color: 'cyan',
  },
});

type AvatarSize = NonNullable<VariantProps<typeof avatarVariants>['size']>;
type AvatarColor = NonNullable<VariantProps<typeof avatarVariants>['color']>;

const AvatarContext = React.createContext<{ size?: AvatarSize }>({ size: 'xs' });

function Avatar({
  className,
  size,
  children,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root> & { size?: AvatarSize }) {
  const styles = avatarVariants({ size });
  return (
    <AvatarPrimitive.Root data-slot="avatar" className={styles.root({ className })} {...props}>
      <AvatarContext.Provider value={{ size }}>{children}</AvatarContext.Provider>
    </AvatarPrimitive.Root>
  );
}

function AvatarImage({ className, ...props }: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image data-slot="avatar-image" className={cn('aspect-square size-full', className)} {...props} />
  );
}

function AvatarFallback({
  className,
  color,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback> & { color?: AvatarColor }) {
  const { size } = React.useContext(AvatarContext);
  const styles = avatarVariants({ size, color });
  return <AvatarPrimitive.Fallback data-slot="avatar-fallback" className={styles.fallback({ className })} {...props} />;
}

function AvatarBadge({ className, ...props }: React.ComponentProps<'span'>) {
  const { size } = React.useContext(AvatarContext);
  const styles = avatarVariants({ size });
  return <span data-slot="avatar-badge" className={styles.badge({ className })} {...props} />;
}

function AvatarGroup({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="avatar-group"
      className={cn('flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:ring-background', className)}
      {...props}
    />
  );
}

function AvatarGroupCount({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="avatar-group-count"
      className={cn(
        'relative flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-sm text-muted-foreground ring-2 ring-background [&>svg]:size-4',
        className,
      )}
      {...props}
    />
  );
}

export { Avatar, AvatarImage, AvatarFallback, AvatarBadge, AvatarGroup, AvatarGroupCount, avatarVariants };
export type { AvatarSize, AvatarColor };
