import { useState } from 'react';
import { Download } from 'lucide-react';
import { toast } from 'sonner';

import { alertDialog } from '@/components/base/dialog/alert-dialog-store';
import type { TableSelection } from '@/components/base/query-builder/hooks/use-table-selection';
import { Button } from '@/components/base/shadcn/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/base/shadcn/tooltip';
import { useI18n } from '@/components/hooks/i18n';
import { useTenant } from '@/components/hooks/use-tenant';
import { getFilenameFromContentDisposition, saveBlob } from '@/components/lib/file-download';
import { occurrencesApi } from '@/utils/api';
import { useCaseIdFromParam } from '@/utils/helper';

const MAX_REPORT_VARIANTS = 100;
const FALLBACK_REPORT_FILENAME = 'variants-report.xlsx';

type VariantsReportKind = 'germline' | 'somatic';

type VariantsReportButtonProps = {
  kind: VariantsReportKind;
  seqId: number;
  taskId?: number;
  selection: TableSelection;
};

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

function VariantsReportButton({ kind, seqId, taskId, selection }: VariantsReportButtonProps) {
  const { t } = useI18n();
  const { tenant } = useTenant();
  const caseId = useCaseIdFromParam();
  const [isDownloading, setIsDownloading] = useState(false);

  const isDisabled = selection.selectedCount === 0 || taskId === undefined;

  const downloadReport = async (reportTaskId: number) => {
    const locusIds = await selection.getSelectedIds(MAX_REPORT_VARIANTS);
    const response = await fetchReport(kind, tenant, caseId, seqId, reportTaskId, locusIds.join(','));
    const filename = getFilenameFromContentDisposition(
      response.headers['content-disposition'],
      FALLBACK_REPORT_FILENAME,
    );
    saveBlob(response.data as unknown as Blob, filename);
  };

  const handleClick = () => {
    if (taskId === undefined) return;

    if (selection.selectedCount > MAX_REPORT_VARIANTS) {
      alertDialog.open({
        type: 'error',
        title: t('variant.report.max_exceeded.title'),
        description: t('variant.report.max_exceeded.description'),
        hideCancel: true,
        actionProps: { children: t('common.close') },
      });
      return;
    }

    setIsDownloading(true);
    toast.promise(
      downloadReport(taskId).finally(() => setIsDownloading(false)),
      {
        loading: t('variant.report.toast.loading'),
        success: t('variant.report.toast.success'),
        error: t('variant.report.toast.error'),
      },
    );
  };

  const button = (
    <Button size="sm" disabled={isDisabled} loading={isDownloading} onClick={handleClick}>
      <Download />
      {t('variant.report.download')}
    </Button>
  );

  if (!isDisabled) return button;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {/* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- focusable so keyboard users can open the tooltip */}
        <span tabIndex={0}>{button}</span>
      </TooltipTrigger>
      <TooltipContent>{t('variant.report.select_at_least_one')}</TooltipContent>
    </Tooltip>
  );
}

export default VariantsReportButton;
