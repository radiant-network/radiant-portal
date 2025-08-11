import * as React from 'react';
import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog';

import { cn } from '@/lib/utils';
import { buttonVariants } from '@/base/buttons/button.variants';
import { VariantProps } from 'tailwind-variants';
import { CircleAlertIcon, CircleCheckIcon, CircleXIcon, InfoIcon } from 'lucide-react';

const AlertDialog = AlertDialogPrimitive.Root;

const AlertDialogTrigger = AlertDialogPrimitive.Trigger;

const AlertDialogPortal = AlertDialogPrimitive.Portal;

function AlertDialogOverlay({ className, ...props }: AlertDialogPrimitive.AlertDialogOverlayProps) {
  return (
    <AlertDialogPrimitive.Overlay
      className={cn(
        'fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
        className,
      )}
      {...props}
    />
  );
}
AlertDialogOverlay.displayName = AlertDialogPrimitive.Overlay.displayName;

function AlertDialogContent({ className, ...props }: AlertDialogPrimitive.AlertDialogContentProps) {
  return (
    <AlertDialogPortal>
      <AlertDialogOverlay />
      <AlertDialogPrimitive.Content
        className={cn(
          'fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-3 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg',
          className,
        )}
        {...props}
      />
    </AlertDialogPortal>
  );
}
AlertDialogContent.displayName = AlertDialogPrimitive.Content.displayName;

function AlertDialogHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex flex-col space-y-2 text-center sm:text-left', className)} {...props} />;
}
AlertDialogHeader.displayName = 'AlertDialogHeader';

function AlertDialogFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2', className)} {...props} />;
}
AlertDialogFooter.displayName = 'AlertDialogFooter';

function AlertDialogTitle({ className, ...props }: AlertDialogPrimitive.AlertDialogTitleProps) {
  return <AlertDialogPrimitive.Title className={cn('text-lg font-semibold', className)} {...props} />;
}

function AlertDialogDescription({ className, ...props }: AlertDialogPrimitive.AlertDialogDescriptionProps) {
  return (
    <AlertDialogPrimitive.Description
      className={cn('text-sm text-muted-foreground overflow-auto', className)}
      {...props}
    />
  );
}
AlertDialogDescription.displayName = AlertDialogPrimitive.Description.displayName;

export type AlertDialogActionProps = React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Action> &
  VariantProps<typeof buttonVariants>;

function AlertDialogAction({ className, variant = 'default', size, ...props }: AlertDialogActionProps) {
  const style = buttonVariants({ variant, size, disabled: props.disabled });
  return <AlertDialogPrimitive.Action className={style.base({ className })} {...props} />;
}
AlertDialogAction.displayName = AlertDialogPrimitive.Action.displayName;

export type AlertDialogCancelProps = React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Cancel> &
  VariantProps<typeof buttonVariants>;

function AlertDialogCancel({ className, variant = 'outline', size, ...props }: AlertDialogCancelProps) {
  const style = buttonVariants({ variant, size, disabled: props.disabled });
  return <AlertDialogPrimitive.Cancel className={cn(style.base(), 'mt-2 sm:mt-0', className)} {...props} />;
}
AlertDialogCancel.displayName = AlertDialogPrimitive.Cancel.displayName;

export type AlertDialogType = 'success' | 'info' | 'warning' | 'error';

const AlertDialogIcon = ({ type }: { type: AlertDialogType }) => {
  switch (type) {
    case 'info':
      return <InfoIcon />; // TODO add info color
    case 'warning':
      return <CircleAlertIcon />; // TODO add warning color
    case 'error':
      return <CircleXIcon className="stroke-destructive" />;
    case 'success':
      return <CircleCheckIcon />; // TODO add success color
    default:
      return null;
  }
};
AlertDialogIcon.displayName = 'AlertDialogIcon';

export {
  AlertDialogIcon,
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
};
