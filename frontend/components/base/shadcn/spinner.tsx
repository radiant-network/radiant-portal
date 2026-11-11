import { Loader, Loader2Icon } from 'lucide-react';

import { useI18n } from '@/components/hooks/i18n';
import { cn } from '@/lib/utils';

type SpinnerVariant = 'loader' | 'loader2';

interface SpinnerProps extends React.ComponentProps<'svg'> {
  variant?: SpinnerVariant;
}

function Spinner({ className, variant = 'loader2', ...props }: SpinnerProps) {
  const { t } = useI18n();
  const Icon = variant === 'loader2' ? Loader2Icon : Loader;

  return (
    <Icon
      role="status"
      aria-label={t('a11y.spinner.loading')}
      className={cn('size-4 animate-spin', className)}
      {...props}
    />
  );
}

export { Spinner };
