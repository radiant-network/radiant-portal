import { useMemo } from 'react';
import { useParams } from 'react-router';
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
  const { patientId, caseId } = useParams<{ patientId?: string; caseId?: string }>();

  const href = useMemo(() => {
    if (!librechatDavidUrl) return undefined;
    const url = new URL(librechatDavidUrl);
    if (patientId) url.searchParams.set('patient', patientId);
    if (caseId) url.searchParams.set('case', caseId);
    return url.toString();
  }, [librechatDavidUrl, patientId, caseId]);

  if (!librechatDavidUrl && !demoMode) return null;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          asChild
          className={cn(
            'bg-[linear-gradient(19.65deg,#1C75BC_12.636%,#00B6BE_102.78%)] text-white hover:bg-[linear-gradient(19.65deg,#00B6BE_12.636%,#1C75BC_102.78%)]',
            className,
          )}
          {...buttonProps}
        >
          <a href={href ?? '#'} target="_blank" rel="noopener noreferrer">
            <SparklesIcon />
            {t('librechat.david.title')}
          </a>
        </Button>
      </TooltipTrigger>
      <TooltipContent side="left">{t('librechat.david.tooltip')}</TooltipContent>
    </Tooltip>
  );
}

export default LibreChatDavid;
