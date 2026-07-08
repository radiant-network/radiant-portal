import { useCallback, useMemo, useState } from 'react';
import VennChartOperationTable from './venn-chart-operation-table';
import VennChartSummaryTable from './venn-chart-summary-table';
import VennD3Chart, { VENN_ID } from './venn-d3-chart';
import { ISqonGroupFacet } from '@/components/base/query-builder/type';
import { RowSelectionState } from '@tanstack/react-table';
import d3ToPng from 'd3-svg-to-png';
import { Button } from '../../shadcn/button';
import { useI18n } from '@/components/hooks/i18n';
import { Download } from 'lucide-react';
import { formatDate } from 'date-fns';

export type VennSummary = {
  operation: string;
  sqon: ISqonGroupFacet;
  count: number;
};

export type VennOperation = {
  setId: string;
  operation: string;
  sqon: ISqonGroupFacet;
  count: number;
};

export type VennChartProps = {
  summary: VennSummary[];
  operations: VennOperation[];
};

function VennChart({ summary, operations }: VennChartProps) {
  const { t } = useI18n();
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const handleDownload = useCallback(() => {
    const date = Date.now();
    const formattedDate = formatDate(date, t('common.date.year_month_day'));
    const formattedTime = formatDate(date, t('common.date.hour'));
    d3ToPng(`#${VENN_ID}`, `venn-diagram-${formattedDate}-${formattedTime}`, {
      background: 'white',
      quality: 1,
      scale: 1,
      format: 'png',
    });
  }, [t]);
  const chartProps = useMemo(
    () => ({
      sets: summary.map(summary => summary.operation),
      operations: operations.map(operation => ({
        setId: operation.setId,
        count: operation.count,
      })),
    }),
    [summary, operations],
  );

  return (
    <div className="flex w-full">
      <div className="flex flex-1 flex-col items-center justify-center relative">
        <VennD3Chart {...chartProps} rowSelection={rowSelection} onRowSelectionChange={setRowSelection} />
        <Button className="absolute bottom-0" onClick={handleDownload}>
          <Download />
          {t('analysis.set_operations.download')}
        </Button>
      </div>
      <div className="flex flex-1 flex-col gap-6">
        <VennChartSummaryTable data={summary} />
        <VennChartOperationTable data={operations} rowSelection={rowSelection} onRowSelectionChange={setRowSelection} />
      </div>
    </div>
  );
}
export default VennChart;
