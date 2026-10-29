import { useCallback, useMemo } from 'react';
import { useParams, useSearchParams } from 'react-router';

import { Badge } from '@/components/base/shadcn/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/base/shadcn/dialog';
import { useI18n } from '@/components/hooks/i18n';

const DAVID_URL = import.meta.env.APPS_LIBRECHAT_DAVID_URL;
const OPEN_PARAM = 'david';

function LibreChatDavidModal() {
  const { t } = useI18n();
  const [searchParams, setSearchParams] = useSearchParams();
  const { patientId } = useParams<{ patientId: string }>();

  const open = searchParams.get(OPEN_PARAM) === '1';

  const handleOpenChange = useCallback(
    (next: boolean) => {
      if (next) return;
      setSearchParams(
        prev => {
          const p = new URLSearchParams(prev);
          p.delete(OPEN_PARAM);
          return p;
        },
        { preventScrollReset: true },
      );
    },
    [setSearchParams],
  );

  const iframeSrc = useMemo(() => {
    if (!DAVID_URL) return undefined;
    if (!patientId) return DAVID_URL;
    const url = new URL(DAVID_URL);
    url.searchParams.set('patient', patientId);
    return url.toString();
  }, [patientId]);

  if (!DAVID_URL) return null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent size="xl" className="h-[85vh] grid-rows-[auto_1fr]">
        <DialogHeader className="flex-row items-center gap-2 space-y-0 px-4 py-3 pr-10 w-full">
          <DialogTitle className="text-sm font-semibold leading-none">{t('librechat.david.title')}</DialogTitle>
          <Badge variant="outline" className="text-[11px] font-medium px-1.5 py-0">
            {t('librechat.david.badge')}
          </Badge>
          {patientId && (
            <span className="ml-auto text-right text-xs text-muted-foreground truncate max-w-56">
              {t('patient_entity.header.title', { id: patientId })}
            </span>
          )}
        </DialogHeader>
        <div className="w-full h-full border-t">
          <iframe
            key={iframeSrc}
            src={iframeSrc}
            title={t('librechat.david.frame_title')}
            className="w-full h-full border-0"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default LibreChatDavidModal;
