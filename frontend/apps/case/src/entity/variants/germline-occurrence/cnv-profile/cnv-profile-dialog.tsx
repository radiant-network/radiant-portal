import { lazy, Suspense, useState } from 'react';
import { type AxiosError, isAxiosError } from 'axios';
import { ChartScatter } from 'lucide-react';
import useSWR from 'swr';

import type { ApiError, CNVProfile } from '@/api/api';
import { Alert, AlertDescription } from '@/components/base/shadcn/alert';
import { Button } from '@/components/base/shadcn/button';
import { Dialog, DialogBody, DialogContent, DialogHeader, DialogTitle } from '@/components/base/shadcn/dialog';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/base/shadcn/tooltip';
import { Spinner } from '@/components/base/spinner';
import { useI18n } from '@/components/hooks/i18n';
import { useTenant } from '@/components/hooks/use-tenant';
import { occurrencesApi } from '@/utils/api';

// Plotly reads the window when it loads: the chart is only loaded in the browser, on open.
const CNVProfileChart = lazy(() => import('./cnv-profile-chart'));

const SUPPORTED_STRATEGIES = ['wxs', 'wgs'];

type CNVProfileDialogProps = {
  caseId: number;
  seqId: number;
  taskId?: number;
  experimentalStrategy?: string;
  sampleId?: string;
};

function missingFilesKey(error: AxiosError<ApiError>) {
  const missing: string[] = error.response?.data?.detail?.missing ?? [];
  if (missing.length === 1 && missing[0] === 'copy_ratio')
    return 'case_entity.variants.cnv_profile.errors.copy_ratio_missing';
  if (missing.length === 1 && missing[0] === 'baf') return 'case_entity.variants.cnv_profile.errors.baf_missing';
  return 'case_entity.variants.cnv_profile.errors.not_found';
}

function errorKey(error: unknown) {
  if (isAxiosError<ApiError>(error) && error.response?.status === 404) return missingFilesKey(error);
  if (isAxiosError(error) && error.response?.status === 422)
    return 'case_entity.variants.cnv_profile.errors.unsupported';
  return 'case_entity.variants.cnv_profile.errors.unknown';
}

function CNVProfileDialog({ caseId, seqId, taskId, experimentalStrategy, sampleId }: CNVProfileDialogProps) {
  const { t } = useI18n();
  const { tenant } = useTenant();
  const [open, setOpen] = useState(false);
  const available =
    taskId !== undefined && experimentalStrategy !== undefined && SUPPORTED_STRATEGIES.includes(experimentalStrategy);
  const { data, error, isLoading } = useSWR<CNVProfile>(
    open && taskId !== undefined ? ['cnv-profile', tenant, caseId, seqId, taskId] : null,
    async () => {
      const response = await occurrencesApi.getGermlineCNVProfile(tenant, caseId, seqId, taskId!);
      return response.data;
    },
    { revalidateOnFocus: false, shouldRetryOnError: false },
  );

  const loader = (
    <div className="flex h-full flex-col items-center justify-center gap-3 text-sm text-muted-foreground">
      <Spinner size={32} />
      {t('case_entity.variants.cnv_profile.loading')}
    </div>
  );

  const trigger = (
    <Button size="xs" variant="outline" disabled={!available} onClick={() => setOpen(true)}>
      <ChartScatter />
      {t('case_entity.variants.cnv_profile.button')}
    </Button>
  );

  return (
    <>
      {available ? (
        trigger
      ) : (
        <Tooltip>
          <TooltipTrigger asChild>
            <span>{trigger}</span>
          </TooltipTrigger>
          <TooltipContent>{t('case_entity.variants.cnv_profile.unavailable')}</TooltipContent>
        </Tooltip>
      )}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent size="full" variant="stickyHeader">
          <DialogHeader>
            <DialogTitle>
              {t('case_entity.variants.cnv_profile.title')}
              {sampleId && <span className="font-normal text-muted-foreground"> · {sampleId}</span>}
            </DialogTitle>
          </DialogHeader>
          <DialogBody className="h-[85vh]">
            {error && (
              <Alert variant="error">
                <AlertDescription>{t(errorKey(error))}</AlertDescription>
              </Alert>
            )}
            {isLoading && loader}
            {data && (
              <Suspense fallback={loader}>
                <CNVProfileChart profile={data} ids={{ caseId, seqId, taskId: taskId! }} />
              </Suspense>
            )}
          </DialogBody>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default CNVProfileDialog;
