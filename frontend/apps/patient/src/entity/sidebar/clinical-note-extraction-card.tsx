import { useState } from 'react';
import { ArrowUpRight, NotepadText } from 'lucide-react';

import { Button } from '@/components/base/shadcn/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/base/shadcn/card';
import { Dialog, DialogBody, DialogContent, DialogHeader, DialogTitle } from '@/components/base/shadcn/dialog';
import { Skeleton } from '@/components/base/shadcn/skeleton';
import { Spinner } from '@/components/base/spinner';
import { useI18n } from '@/components/hooks/i18n';
import { useTenant } from '@/components/hooks/use-tenant';
import { patientsApi } from '@/utils/api';

type ClinicalNoteExtractionCardProps = {
  patientKey: string;
};

function ClinicalNoteExtractionCard({ patientKey }: ClinicalNoteExtractionCardProps) {
  const { t } = useI18n();
  const { tenant } = useTenant();
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState<string>();
  const [iframeLoaded, setIframeLoaded] = useState(false);

  const handleRun = async () => {
    setUrl(undefined);
    setIframeLoaded(false);
    setOpen(true);
    const response = await patientsApi.patientProcessingReportDownloadUrl(tenant, patientKey);
    setUrl(response.data.url);
  };

  return (
    <>
      <Card>
        <CardHeader bordered>
          <CardTitle>{t('patient_entity.sidebar.clinical_note_extraction.title')}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <div className="flex items-center justify-center rounded-md border p-2">
            <NotepadText className="size-6 text-foreground" aria-hidden />
          </div>
          <p className="text-center text-xs text-muted-foreground">
            {t('patient_entity.sidebar.clinical_note_extraction.description')}
          </p>
          <Button variant="outline" size="sm" className="w-full" onClick={handleRun}>
            {t('patient_entity.sidebar.clinical_note_extraction.run')}
          </Button>
        </CardContent>
      </Card>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent size="xl" variant="stickyHeader">
          <DialogHeader>
            <div className="flex w-full items-center gap-3">
              <DialogTitle>{t('patient_entity.sidebar.clinical_note_extraction.title')}</DialogTitle>
              <Button
                type="button"
                variant="ghost"
                size="3xs"
                className="ml-auto mr-8"
                disabled={!url}
                onClick={() => url && window.open(url, '_blank', 'noopener,noreferrer')}
              >
                {t('patient_entity.sidebar.clinical_note_extraction.open_in_new_tab')}
                <ArrowUpRight />
              </Button>
            </div>
          </DialogHeader>
          <DialogBody className="h-[82vh] p-0">
            {url ? (
              <div className="relative h-full w-full">
                <iframe
                  src={url}
                  title={t('patient_entity.sidebar.clinical_note_extraction.iframe_title')}
                  className="h-full w-full border-0"
                  sandbox="allow-same-origin allow-scripts allow-popups"
                  onLoad={() => setIframeLoaded(true)}
                />
                {!iframeLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center bg-background">
                    <Spinner size={32} className="text-muted-foreground" />
                  </div>
                )}
              </div>
            ) : (
              <Skeleton className="h-full w-full rounded-none" />
            )}
          </DialogBody>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default ClinicalNoteExtractionCard;
