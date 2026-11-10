import { useState } from 'react';
import { Download } from 'lucide-react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogIcon,
  AlertDialogTitle,
} from '@/components/base/shadcn/alert-dialog';
import { Button } from '@/components/base/shadcn/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/base/shadcn/tooltip';
import { useI18n } from '@/components/hooks/i18n';
import { useTenant } from '@/components/hooks/use-tenant';
import { usePatientIdFromParam } from '@/utils/helper';

import { fetchPatientTumorBoardReportUrl } from '../../api/patient';

type TumorBoardReportButtonProps = {
  sessionId: number;
  hasReport: boolean;
};

function TumorBoardReportButton({ sessionId, hasReport }: TumorBoardReportButtonProps) {
  const { t } = useI18n();
  const { tenant } = useTenant();
  const patientKey = usePatientIdFromParam();
  const [isDownloading, setIsDownloading] = useState(false);
  const [showError, setShowError] = useState(false);

  if (!hasReport) return null;

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const url = await fetchPatientTumorBoardReportUrl(tenant, patientKey, sessionId);
      if (url) {
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = '';
        anchor.target = '_blank';
        anchor.rel = 'noopener noreferrer';
        document.body.appendChild(anchor);
        anchor.click();
        anchor.remove();
      } else {
        setShowError(true);
      }
    } catch (error) {
      console.error(`Error downloading tumor board report for session ${sessionId}:`, error);
      setShowError(true);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            iconOnly
            size="sm"
            onClick={handleDownload}
            disabled={isDownloading}
            loading={isDownloading}
            aria-label={t('common.download.tooltip')}
          >
            <Download />
          </Button>
        </TooltipTrigger>
        <TooltipContent>{t('common.download.tooltip')}</TooltipContent>
      </Tooltip>
      {showError && (
        <AlertDialog open={showError} onOpenChange={setShowError}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <div className="flex items-center gap-2">
                <AlertDialogIcon type="error" />
                <AlertDialogTitle>{t('common.download.error_title')}</AlertDialogTitle>
              </div>
              <AlertDialogDescription>{t('common.download.error_description')}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction onClick={() => setShowError(false)}>
                {t('common.download.error_close')}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
}

export default TumorBoardReportButton;
