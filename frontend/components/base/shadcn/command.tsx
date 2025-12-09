/* eslint-disable react/no-unknown-property */
'use client';

import * as React from 'react';
import { type DialogProps } from '@radix-ui/react-dialog';
import { Command as CommandPrimitive, useCommandState } from 'cmdk';
import { tv, VariantProps } from 'tailwind-variants';

import { Checkbox } from '@/components/base/shadcn/checkbox';
import { Dialog, DialogContent } from '@/components/base/shadcn/dialog';
import { cn } from '@/lib/utils';

function Command({ className, ...props }: React.ComponentPropsWithoutRef<typeof CommandPrimitive>) {
  return (
    <CommandPrimitive
      className={cn(
        'flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground',
        className,
      )}
      {...props}
    />
  );
}
Command.displayName = CommandPrimitive.displayName;

const CommandDialog = ({ children, ...props }: DialogProps) => (
  <Dialog {...props}>
    <DialogContent className="overflow-hidden p-0">
      <Command className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">
        {children}
      </Command>
    </DialogContent>
  </Dialog>
);

const CommandInputVariants = tv({
  slots: {
    base: 'flex h-9 items-center px-3 bg-background rounded-md border',
  },
  variants: {
    variant: {
      default: 'enabled:focus-within:ring-1 enabled:focus-within:ring-ring',
      search:
        'focus-within:ring-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-offset-0 [&:has(:focus-visible)]:ring-1',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

type CommandInputProps = React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input> &
  VariantProps<typeof CommandInputVariants> & {
    wrapperClassName?: string;
    rightAddon?: React.ReactNode;
    leftAddon?: React.ReactNode;
  };
function CommandInput({
  className,
  wrapperClassName,
  leftAddon,
  rightAddon,
  disabled,
  variant,
  ...props
}: CommandInputProps) {
  const styles = CommandInputVariants({ variant });
  return (
    <div
      className={cn(styles.base({ variant }), wrapperClassName, {
        'cursor-not-allowed opacity-50': disabled,
      })}
      cmdk-input-wrapper=""
    >
      {leftAddon}
      <CommandPrimitive.Input
        className={cn(
          'flex w-full rounded-md bg-background text-sm outline-none placeholder:text-muted-foreground',
          className,
        )}
        disabled={disabled}
        {...props}
      />
      {rightAddon}
    </div>
  );
}
CommandInput.displayName = CommandPrimitive.Input.displayName;

function CommandList({ className, ...props }: React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>) {
  return (
    <CommandPrimitive.List className={cn('max-h-[300px] overflow-y-auto overflow-x-hidden', className)} {...props} />
  );
}
CommandList.displayName = CommandPrimitive.List.displayName;

function CommandEmpty({ className, ...props }: React.ComponentProps<typeof CommandPrimitive.Empty>) {
  const render = useCommandState(state => state.filtered.count === 0);
  if (!render) return null;
  return <div className={cn('py-4 text-center text-sm', className)} cmdk-empty="" role="presentation" {...props} />;
}
CommandEmpty.displayName = CommandPrimitive.Empty.displayName;

function CommandGroup({ className, ...props }: React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group>) {
  return (
    <CommandPrimitive.Group
      className={cn(
        'overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground',
        className,
      )}
      {...props}
    />
  );
}
CommandGroup.displayName = CommandPrimitive.Group.displayName;

function CommandSeparator({ className, ...props }: React.ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>) {
  return <CommandPrimitive.Separator className={cn('-mx-1 h-px bg-border', className)} {...props} />;
}
CommandSeparator.displayName = CommandPrimitive.Separator.displayName;

function CommandItem({ className, ...props }: React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>) {
  return (
    <CommandPrimitive.Item
      className={cn(
        'relative flex cursor-default gap-2 select-none items-center rounded-xs px-2 py-1 text-sm outline-none data-[disabled=true]:pointer-events-none data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
        className,
      )}
      {...props}
    />
  );
}
CommandItem.displayName = CommandPrimitive.Item.displayName;

/**
 * Custom Component added. We be overrided if shadcn command is run
 */
function CommandItemCheckbox({ ...props }: React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>) {
  const [checked, setChecked] = React.useState<boolean>(false);
  return (
    <CommandItem
      {...props}
      onSelect={(value: string) => {
        props.onSelect && props.onSelect(value);
        setChecked(!checked);
      }}
    >
      <Checkbox checked={checked} disabled={props.disabled} />
      {props.children}
    </CommandItem>
  );
}
CommandItemCheckbox.displayName = 'CommandItemCheckbox';

const CommandShortcut = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => (
  <span className={cn('ml-auto text-xs tracking-widest text-muted-foreground', className)} {...props} />
);
CommandShortcut.displayName = 'CommandShortcut';

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandItemCheckbox,
  CommandShortcut,
  CommandSeparator,
};
