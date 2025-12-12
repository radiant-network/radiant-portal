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
import { useI18n } from '@/hooks/i18n';
import { documentApi } from '@/utils/api';

interface DownloadFileCellProps {
  documentId: number;
}

function DownloadFileCell({ documentId }: DownloadFileCellProps) {
  const { t } = useI18n();
  const [isDownloading, setIsDownloading] = useState(false);
  const [showError, setShowError] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const response = await documentApi.getDocumentDownloadUrl(documentId.toString());
      const { url } = response.data;

      if (url) {
        window.open(url, '_blank');
      }
    } catch (error) {
      console.error('Error downloading file:', error);
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
            onClick={handleDownload}
            disabled={isDownloading}
            loading={isDownloading}
            aria-label={t('common.download.tooltip')}
            className="rounded-md h-7 w-7 p-0"
          >
            <Download />
          </Button>
        </TooltipTrigger>
        <TooltipContent>{t('common.download.tooltip')}</TooltipContent>
      </Tooltip>

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
    </>
  );
}

export default DownloadFileCell;
