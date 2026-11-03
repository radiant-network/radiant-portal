import { useCallback } from 'react';
import { useSearchParams } from 'react-router';
import { SparklesIcon } from 'lucide-react';

import { Button, type ButtonProps } from '@/components/base/shadcn/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/base/shadcn/tooltip';
import { useI18n } from '@/components/hooks/i18n';
import { useRuntimeConfig } from '@/components/hooks/use-runtime-config';
import { cn } from '@/components/lib/utils';

type LibreChatDavidProps = Omit<ButtonProps, 'onClick' | 'children' | 'asChild'> & {
  demoMode?: boolean;
};

function LibreChatDavid({ className, demoMode = false, ...buttonProps }: LibreChatDavidProps) {
  const { t } = useI18n();
  const { librechatDavidUrl } = useRuntimeConfig();
  const [, setSearchParams] = useSearchParams();

  const handleClick = useCallback(() => {
    setSearchParams(
      prev => {
        const p = new URLSearchParams(prev);
        p.set('david', '1');
        return p;
      },
      { preventScrollReset: true },
    );
  }, [setSearchParams]);

  if (!librechatDavidUrl && !demoMode) return null;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          onClick={handleClick}
          className={cn(
            'bg-[linear-gradient(19.65deg,#1C75BC_12.636%,#00B6BE_102.78%)] text-white hover:bg-[linear-gradient(19.65deg,#00B6BE_12.636%,#1C75BC_102.78%)]',
            className,
          )}
          {...buttonProps}
        >
          <SparklesIcon />
          {t('librechat.david.title')}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="left">{t('librechat.david.tooltip')}</TooltipContent>
    </Tooltip>
  );
}

export default LibreChatDavid;
