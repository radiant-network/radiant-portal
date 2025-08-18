import * as React from 'react';
import { createContext, useContext } from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { tv, VariantProps } from 'tailwind-variants';

import { cn } from '@/lib/utils';

const dialogVariants = tv({
  slots: {
    base: 'fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] border bg-background shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg outline-none',
    close:
      'absolute right-4 top-4 rounded-xs opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-1 focus:ring-ring disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground [&_svg]:size-4',
    header: 'flex flex-col space-y-1.5 px-6 pt-6 text-center sm:text-left',
    body: 'p-6',
    footer: 'flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 px-6 pb-6',
    title: 'text-lg font-semibold leading-none tracking-tight',
    description: 'text-sm text-muted-foreground',
  },
  variants: {
    variant: {
      stickyHeader: {
        header: 'border-b pb-4',
        body: 'px-6 py-4',
      },
      stickyFooter: {
        footer: 'border-t pt-4',
        body: 'px-6 py-4',
      },
      stickyBoth: {
        header: 'border-b pb-4',
        footer: 'border-t pt-4',
        body: 'px-6 py-4',
      },
    },
  },
});

const DialogContext = createContext<VariantProps<typeof dialogVariants> | undefined>(undefined);

export const useDialogContext = () => {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error('useDialogContext must be used within a DialogContext.Provider');
  }
  return context;
};

const Dialog = DialogPrimitive.Root;

const DialogTrigger = DialogPrimitive.Trigger;

const DialogPortal = DialogPrimitive.Portal;

const DialogClose = DialogPrimitive.Close;

function DialogOverlay({ className, ...props }: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      className={cn(
        'fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
        className,
      )}
      {...props}
    />
  );
}
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

export type DialogContentProps = React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> &
  VariantProps<typeof dialogVariants>;

function DialogContent({ className, children, variant, ...props }: DialogContentProps) {
  const style = dialogVariants({ variant });

  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogContext.Provider value={{ variant }}>
        <DialogPrimitive.Content className={style.base({ className })} {...props}>
          {children}
          <DialogPrimitive.Close className={style.close()}>
            <X className="bg-background" />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogContext.Provider>
    </DialogPortal>
  );
}
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogBody = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  const { variant } = useDialogContext();
  const styles = dialogVariants({ variant });

  return (
    <div className={styles.body({ className })} {...props}>
      {children}
    </div>
  );
};
DialogBody.displayName = 'DialogBody';

const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  const { variant } = useDialogContext();
  const styles = dialogVariants({ variant });

  return <div className={styles.header({ className })} {...props} />;
};
DialogHeader.displayName = 'DialogHeader';

const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  const { variant } = useDialogContext();
  const styles = dialogVariants({ variant });

  return <div className={styles.footer({ className })} {...props} />;
};
DialogFooter.displayName = 'DialogFooter';

function DialogTitle({ className, ...props }: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>) {
  const { variant } = useDialogContext();
  const styles = dialogVariants({ variant });

  return <DialogPrimitive.Title className={styles.title({ className })} {...props} />;
}
DialogTitle.displayName = DialogPrimitive.Title.displayName;

function DialogDescription({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>) {
  const { variant } = useDialogContext();
  const styles = dialogVariants({ variant });

  return <DialogPrimitive.Description className={styles.description({ className })} {...props} />;
}
DialogDescription.displayName = DialogPrimitive.Description.displayName;

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogBody,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};
