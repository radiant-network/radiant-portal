import { CircleAlertIcon, CircleCheckIcon, CircleXIcon, InfoIcon, Loader2Icon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Toaster as Sonner, type ToasterProps } from 'sonner';

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-5 text-alert-success-foreground fill-alert-success/20 mt-1" />,
        info: <InfoIcon className="size-5 text-alert-info-foreground fill-alert-info/20 mt-1" />,
        warning: <CircleAlertIcon className="size-5 text-alert-warning-foreground fill-alert-warning/20 mt-1" />,
        error: <CircleXIcon className="size-5 text-alert-error-foreground fill-alert-error/20 mt-1" />,
        loading: <Loader2Icon className="size-5 animate-spin text-foreground mt-1" />,
      }}
      style={
        {
          '--normal-bg': 'var(--popover)',
          '--normal-text': 'var(--popover-foreground)',
          '--normal-border': 'var(--border)',
          '--border-radius': 'var(--radius)',
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: '!items-start !text-sm !shadow-lg !rounded-lg',
          title: '!text-base-popover-foreground',
          description: '!text-muted-foreground',
          actionButton:
            '!inline-flex !items-center !justify-center !whitespace-nowrap !rounded-md !gap-2 !font-medium !text-xs !h-6 !p-2 !bg-primary !text-primary-foreground !shadow-sm hover:!bg-primary/90 !transition-colors',
          closeButton:
            '!text-muted-foreground !border !border-border hover:!bg-accent hover:!text-accent-foreground hover:!opacity-100 !transition-all',
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
