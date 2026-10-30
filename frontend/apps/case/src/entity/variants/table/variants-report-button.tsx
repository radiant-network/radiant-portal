import { useState } from 'react';
import { Download } from 'lucide-react';

import { alertDialog } from '@/components/base/dialog/alert-dialog-store';
import type { TableSelection } from '@/components/base/query-builder/hooks/use-table-selection';
import { Button } from '@/components/base/shadcn/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/base/shadcn/tooltip';
import { useI18n } from '@/components/hooks/i18n';

import useVariantsReportDownload, { type VariantsReportKind } from './use-variants-report-download';

const MAX_REPORT_VARIANTS = 100;

type VariantsReportButtonProps = {
  kind: VariantsReportKind;
  seqId: number;
  taskId?: number;
  selection: TableSelection;
};

function VariantsReportButton({ kind, seqId, taskId, selection }: VariantsReportButtonProps) {
  const { t } = useI18n();
  const downloadReport = useVariantsReportDownload(kind);
  const [isDownloading, setIsDownloading] = useState(false);

  const isDisabled = selection.selectedCount === 0 || taskId === undefined;

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
    downloadReport(seqId, taskId, () => selection.getSelectedIds(MAX_REPORT_VARIANTS))
      .catch(() => undefined)
      .finally(() => setIsDownloading(false));
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
