import { useCallback } from 'react';
import { toast } from 'sonner';

import { useI18n } from '@/components/hooks/i18n';
import { useTenant } from '@/components/hooks/use-tenant';
import { getFilenameFromContentDisposition, saveBlob } from '@/components/lib/file-download';
import { occurrencesApi } from '@/utils/api';
import { useCaseIdFromParam } from '@/utils/helper';

const FALLBACK_REPORT_FILENAME = 'variants-report.xlsx';

export type VariantsReportKind = 'germline' | 'somatic';

function fetchReport(
  kind: VariantsReportKind,
  tenant: string,
  caseId: number,
  seqId: number,
  taskId: number,
  locusIds: string,
) {
  const options = { responseType: 'blob' as const };
  return kind === 'germline'
    ? occurrencesApi.getGermlineSNVTranscriptReportsXlsx(tenant, caseId, seqId, taskId, locusIds, options)
    : occurrencesApi.getSomaticSNVTranscriptReportsXlsx(tenant, caseId, seqId, taskId, locusIds, options);
}

function useVariantsReportDownload(kind: VariantsReportKind) {
  const { t } = useI18n();
  const { tenant } = useTenant();
  const caseId = useCaseIdFromParam();

  return useCallback(
    (seqId: number, taskId: number, getLocusIds: () => Promise<string[]>) => {
      const download = async () => {
        const locusIds = await getLocusIds();
        const response = await fetchReport(kind, tenant, caseId, seqId, taskId, locusIds.join(','));
        const filename = getFilenameFromContentDisposition(
          response.headers['content-disposition'],
          FALLBACK_REPORT_FILENAME,
        );
        saveBlob(response.data as unknown as Blob, filename);
      };

      const promise = download();
      toast.promise(promise, {
        loading: t('variant.report.toast.loading'),
        success: t('variant.report.toast.success'),
        error: t('variant.report.toast.error'),
      });
      return promise;
    },
    [kind, tenant, caseId, t],
  );
}

export default useVariantsReportDownload;
