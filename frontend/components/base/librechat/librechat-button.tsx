import { useState } from 'react';
import { ExternalLink, SparklesIcon } from 'lucide-react';

import { Badge } from '@/components/base/shadcn/badge';
import { Button, type ButtonProps } from '@/components/base/shadcn/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/base/shadcn/dialog';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/base/shadcn/tooltip';
import { useI18n } from '@/components/hooks/i18n';
import { useRuntimeConfig } from '@/components/hooks/use-runtime-config';
import { useTenant } from '@/components/hooks/use-tenant';
import { cn } from '@/components/lib/utils';

type EntityContext =
  | { caseId: string | number; patientId?: never }
  | { patientId: string | number; caseId?: never }
  | { caseId?: never; patientId?: never };

type LibrechatButtonProps = Omit<ButtonProps, 'onClick' | 'children' | 'asChild'> & {
  demoMode?: boolean;
} & EntityContext;

type LibrechatMode = 'new' | 'resume';

// LibreChat model spec (librechat.yaml) holding the clinical instructions and the Radiant MCP tools
const LIBRECHAT_MODEL_SPEC = 'radiant-clinical';

function LibrechatButton({ className, demoMode = false, caseId, patientId, ...buttonProps }: LibrechatButtonProps) {
  const { t } = useI18n();
  const { librechatDavidUrl } = useRuntimeConfig();
  const { tenant } = useTenant();
  const hasEntityContext = caseId != null || patientId != null;
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<LibrechatMode | null>(hasEntityContext ? null : 'resume');

  if (!librechatDavidUrl && !demoMode) return null;

  let newChatUrl = '';
  if (librechatDavidUrl) {
    // LibreChat reads the query params on /c/new only: its root redirects there and drops them
    const url = new URL('c/new', librechatDavidUrl.replace(/\/?$/, '/'));
    url.searchParams.set('spec', LIBRECHAT_MODEL_SPEC);
    let prompt = '';
    if (caseId != null) prompt = t('librechat.david.prompt_case', { caseId, tenant });
    else if (patientId != null) prompt = t('librechat.david.prompt_patient', { patientId, tenant });
    if (prompt) {
      url.searchParams.set('prompt', prompt);
      url.searchParams.set('submit', 'true');
    }
    newChatUrl = url.toString();
  }

  let activeUrl = librechatDavidUrl;
  if (mode === 'new') activeUrl = newChatUrl;

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) setMode(hasEntityContext ? null : 'resume');
  };

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={() => setOpen(true)}
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
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent size="xl" className="h-[85vh] grid-rows-[auto_1fr]">
          <DialogHeader className="flex-row items-center gap-2 space-y-0 px-4 py-3 pr-10 w-full">
            <DialogTitle className="text-sm font-semibold leading-none">{t('librechat.david.title')}</DialogTitle>
            <Badge variant="outline" className="text-[11px] font-medium px-1.5 py-0">
              {t('librechat.david.badge')}
            </Badge>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => window.open(activeUrl, '_blank', 'noopener,noreferrer')}
            >
              <ExternalLink />
              {t('librechat.david.open_in_new_tab')}
            </Button>
          </DialogHeader>
          <div className="w-full h-full border-t">
            {mode ? (
              <iframe
                src={activeUrl}
                title={t('librechat.david.frame_title')}
                className="w-full h-full border-0"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
              />
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-3 p-8">
                <Button type="button" size="lg" className="w-64" onClick={() => setMode('new')}>
                  <SparklesIcon />
                  {t('librechat.david.new_analysis')}
                </Button>
                <Button type="button" size="lg" variant="outline" className="w-64" onClick={() => setMode('resume')}>
                  {t('librechat.david.resume_history')}
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default LibrechatButton;
