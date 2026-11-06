import { useState } from 'react';
import { SparklesIcon } from 'lucide-react';

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
import { useI18n } from '@/components/hooks/i18n';
import { useTenant } from '@/components/hooks/use-tenant';
import { usePatientIdFromParam } from '@/utils/helper';

import { fetchPatientTumorBoardDeckUrl } from '../../api/patient';

function CreatePresentationButton() {
  const { t } = useI18n();
  const { tenant } = useTenant();
  const patientKey = usePatientIdFromParam();
  const [isLoading, setIsLoading] = useState(false);
  const [showError, setShowError] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    try {
      const url = await fetchPatientTumorBoardDeckUrl(tenant, patientKey);
      if (url) {
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = '';
        anchor.rel = 'noopener noreferrer';
        document.body.appendChild(anchor);
        anchor.click();
        anchor.remove();
      } else {
        setShowError(true);
      }
    } catch (error) {
      console.error('Error downloading tumor board deck:', error);
      setShowError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button type="button" onClick={handleClick} disabled={isLoading} loading={isLoading}>
        <SparklesIcon />
        {t('patient_entity.tumor_board.create_presentation')}
      </Button>
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

export default CreatePresentationButton;
