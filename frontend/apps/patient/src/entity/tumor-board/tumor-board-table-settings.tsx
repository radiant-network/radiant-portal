import type { TFunction } from 'i18next';

import type { PatientTumorBoardSession } from '@/api/api';
import EmptyCell from '@/components/base/data-table/cells/empty-cell';
import { createAppColumnHelper, type TableColumnDef } from '@/components/base/data-table/data-table';

import TumorBoardDateCell from './cells/tumor-board-date-cell';
import TumorBoardRecommendationsCell from './cells/tumor-board-recommendations-cell';
import TumorBoardReportCell from './cells/tumor-board-report-cell';

const columnHelper = createAppColumnHelper<PatientTumorBoardSession>();

function renderText(value: string | undefined) {
  if (!value) return <EmptyCell />;
  return <span>{value}</span>;
}

function getTumorBoardColumns(t: TFunction<string, undefined>) {
  return [
    columnHelper.accessor('date', {
      cell: info => <TumorBoardDateCell date={info.getValue()} />,
      header: t('patient_entity.tumor_board.columns.date'),
      size: 96,
    }),
    columnHelper.accessor('reason', {
      cell: info => renderText(info.getValue()),
      header: t('patient_entity.tumor_board.columns.reason'),
      size: 128,
    }),
    columnHelper.accessor('diagnosis', {
      cell: info => renderText(info.getValue()),
      header: t('patient_entity.tumor_board.columns.diagnosis'),
      size: 160,
    }),
    columnHelper.accessor('consensus', {
      cell: info => renderText(info.getValue()),
      header: t('patient_entity.tumor_board.columns.consensus'),
    }),
    columnHelper.accessor('recommendations', {
      cell: info => <TumorBoardRecommendationsCell recommendations={info.getValue()} />,
      header: t('patient_entity.tumor_board.columns.recommendations'),
      size: 240,
    }),
    columnHelper.accessor('status', {
      cell: info => renderText(info.getValue()),
      header: t('patient_entity.tumor_board.columns.status'),
      size: 80,
    }),
    columnHelper.display({
      id: 'report',
      cell: info => (
        <TumorBoardReportCell sessionId={info.row.original.session_id} hasReport={info.row.original.has_report} />
      ),
      header: t('patient_entity.tumor_board.columns.report'),
      size: 64,
    }),
  ] as TableColumnDef<PatientTumorBoardSession, any>[];
}

export { getTumorBoardColumns };
