import * as React from 'react';
import { X } from 'lucide-react';
import { tv, VariantProps } from 'tailwind-variants';

import { cn } from '@/components/lib/utils';

import { Button } from './button';

const AlertContext = React.createContext<VariantProps<typeof alertVariants>>({
  variant: 'info',
});

const alertVariants = tv({
  slots: {
    base: 'flex items-start gap-3 self-stretch relative w-full p-3',
    border: 'border border-solid rounded-md',
    icon: '[&>svg]:w-5 [&>svg]:h-5',
    content: 'flex flex-col items-start gap-3 flex-1',
    title: 'text-sm font-semibold leading-5',
    description: 'text-sm font-normal leading-5',
    actions: 'flex items-center gap-2',
    close: 'w-4 h-4 p-1',
  },
  variants: {
    variant: {
      default: {
        base: 'bg-alert-default text-alert-default-foreground',
        border: 'border-alert-default-foreground/30',
        actions: '',
        close: 'hover:bg-alert-default/30 hover:text-alert-default-foreground',
      },
      info: {
        base: 'bg-alert-info/20 text-alert-info-foreground',
        border: 'border-alert-info-foreground/30',
        actions:
          '[&>button[data-variant="default"]]:bg-alert-info-foreground [&>button[data-variant="default"]]:hover:bg-alert-info-foreground/90 [&>button[data-variant="ghost"]]:hover:bg-alert-info/30 [&>button[data-variant="ghost"]]:hover:text-alert-info-foreground',
        close: 'hover:bg-alert-info/30 hover:text-alert-info-foreground',
      },
      warning: {
        base: 'bg-alert-warning/20 text-alert-warning-foreground',
        border: 'border-alert-warning-foreground/30',
        actions:
          '[&>button[data-variant="default"]]:bg-alert-warning-foreground [&>button[data-variant="default"]]:hover:bg-alert-warning-foreground/90 [&>button[data-variant="ghost"]]:hover:bg-alert-warning/30 [&>button[data-variant="ghost"]]:hover:text-alert-warning-foreground',
        close: 'hover:bg-alert-warning/30 hover:text-alert-warning-foreground',
      },
      error: {
        base: 'bg-alert-error/20 text-alert-error-foreground',
        border: 'border-alert-error-foreground/30',
        actions:
          '[&>button[data-variant="default"]]:bg-alert-error-foreground [&>button[data-variant="default"]]:hover:bg-alert-error-foreground/90 [&>button[data-variant="ghost"]]:hover:bg-alert-error/30 [&>button[data-variant="ghost"]]:hover:text-alert-error-foreground',
        close: 'hover:bg-alert-error/30 hover:text-alert-error-foreground',
      },
      success: {
        base: 'bg-alert-success/20 text-alert-success-foreground',
        border: 'border-alert-success-foreground/30',
        actions:
          '[&>button[data-variant="default"]]:bg-alert-success-foreground [&>button[data-variant="default"]]:hover:bg-alert-success-foreground/90 [&>button[data-variant="ghost"]]:hover:bg-alert-success/30 [&>button[data-variant="ghost"]]:hover:text-alert-success-foreground',
        close: 'hover:bg-alert-success/30 hover:text-alert-success-foreground',
      },
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

type AlertProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof alertVariants> & {
    bordered?: boolean;
  };

function Alert({ bordered, className, variant, ...props }: AlertProps) {
  const styles = alertVariants({ variant });
  return (
    <AlertContext.Provider value={{ variant }}>
      <div role="alert" className={cn(styles.base({ className }), bordered && styles.border())} {...props} />
    </AlertContext.Provider>
  );
}
Alert.displayName = 'Alert';

function AlertIcon({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  const { variant } = React.useContext(AlertContext);
  const styles = alertVariants({ variant });
  return (
    <span className={styles.icon({ className })} {...props}>
      {props.children}
    </span>
  );
}
AlertIcon.displayName = 'AlertIcon';

function AlertContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { variant } = React.useContext(AlertContext);
  const styles = alertVariants({ variant });
  return (
    <div className={styles.content({ className })} {...props}>
      {props.children}
    </div>
  );
}
AlertContent.displayName = 'AlertContent';

function AlertTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  const { variant } = React.useContext(AlertContext);
  const styles = alertVariants({ variant });
  return <h5 className={styles.title({ className })} {...props} />;
}
AlertTitle.displayName = 'AlertTitle';

function AlertDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  const { variant } = React.useContext(AlertContext);
  const styles = alertVariants({ variant });
  return <div className={styles.description({ className })} {...props} />;
}
AlertDescription.displayName = 'AlertDescription';

function AlertActions({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { variant } = React.useContext(AlertContext);
  const styles = alertVariants({ variant });
  return (
    <div className={styles.actions({ className })} {...props}>
      {props.children}
    </div>
  );
}
AlertActions.displayName = 'AlertActions';

function AlertClosableIcon({ className, onClick, ...props }: React.HTMLAttributes<HTMLButtonElement>) {
  const { variant } = React.useContext(AlertContext);
  const styles = alertVariants({ variant });
  return (
    <Button variant="ghost" size="sm" className={styles.close({ className })} onClick={onClick} {...props}>
      <X />
    </Button>
  );
}
AlertClosableIcon.displayName = 'AlertClosableIcon';

export { Alert, AlertIcon, AlertContent, AlertTitle, AlertDescription, AlertActions, AlertClosableIcon };
