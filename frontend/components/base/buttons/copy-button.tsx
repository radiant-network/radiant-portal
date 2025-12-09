import { useCallback, useEffect, useState } from 'react';
import { CheckIcon, CopyIcon } from 'lucide-react';

import { Button } from '@/components/base/shadcn/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/base/shadcn/tooltip';
import { useI18n } from '@/components/hooks/i18n';
import { cn } from '@/lib/utils';

interface CopyButtonProps {
  value: string;
  className?: string;
  size?: 'sm' | 'default' | 'lg';
  variant?: 'default' | 'ghost' | 'outline' | 'secondary' | 'destructive' | 'link';
  iconSize?: number;
  successDuration?: number;
  label?: string;
}

export function CopyButton({
  value,
  className,
  size = 'sm',
  variant = 'ghost',
  iconSize = 14,
  successDuration = 500,
  label,
}: CopyButtonProps) {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);

  const onCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  }, [value]);

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => {
        setCopied(false);
      }, successDuration);

      return () => clearTimeout(timer);
    }
  }, [copied, successDuration]);

  return (
    <Tooltip {...(copied && { open: true })}>
      <TooltipTrigger asChild>
        <Button
          variant={variant}
          size={size}
          className={cn(
            'h-auto',
            'h-7',
            copied && 'pointer-events-none',
            label ? 'px-2 py-0.5 gap-1' : 'p-1',
            className,
          )}
          onClick={onCopy}
        >
          {label && <span className={cn('text-sm', copied && 'text-foreground')}>{label}</span>}
          {copied ? <CheckIcon size={iconSize} /> : <CopyIcon size={iconSize} />}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{copied ? t('common.actions.copied') : t('common.actions.copy')}</TooltipContent>
    </Tooltip>
  );
}
