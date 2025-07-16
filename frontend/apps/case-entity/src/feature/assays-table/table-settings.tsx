import { createColumnHelper } from '@tanstack/react-table';
import { TFunction } from 'i18next';
import { CaseAssay } from '@/api/api';
import { createColumnSettings, TableColumnDef } from '@/components/base/data-table/data-table';
import DateCell from '@/components/base/data-table/cells/date-cell';
import TooltipsHeader from '@/components/base/data-table/headers/table-tooltips-header';
import AssayStatusCell from '@/components/base/data-table/cells/assay-status-cell';
import ActionsMenuCell from '../cells/actions-menu-cell';
import SampleTypeCell from '../cells/sample-type-cell';
import SampleIdCell from '../cells/sample-id-cell';
import HistologyCell from '../cells/histology-cell';
import ExperimentalStrategyCell from '../cells/experimental-strategy-code-cell';

const columnHelper = createColumnHelper<CaseAssay>();

function getColumns(t: TFunction<string, undefined>) {
  return [
    // Assay ID
    columnHelper.accessor(row => row.seq_id, {
      id: 'seq_id',
      cell: info => info.getValue(),
      header: t('caseEntity.details.assay_id'),
      size: 124,
      minSize: 124,
    }),
    // Sample ID
    columnHelper.accessor(row => row.sample_id, {
      id: 'sample_id',
      cell: info => <SampleIdCell id={info.getValue()} relationship={info.row.original.relationship_to_proband} />,
      header: t('caseEntity.details.sample_id'),
      size: 124,
      minSize: 124,
    }),
    // Sample Type 
    columnHelper.accessor(row => row.sample_type_code, {
      id: 'sample_type_code',
      cell: info => <SampleTypeCell type={info.getValue()} />,
      header: t('caseEntity.details.sample_type_code'),
      size: 124,
      minSize: 124,
    }),
    // Histology
    columnHelper.accessor(row => row.histology_code, {
      id: 'histology_code',
      cell: info => <HistologyCell code={info.getValue()} />,
      header: t('caseEntity.details.histology_code'),
      size: 124,
      minSize: 124,
    }),
    // Exp. Strat.
    columnHelper.accessor(row => row.experimental_strategy_code, {
      id: 'experimental_strategy_code',
      cell: info => <ExperimentalStrategyCell code={info.getValue()} />,
      header: () => (
        <TooltipsHeader tooltips={t('caseEntity.details.experimental_strategy_code_tooltips')}>
          {t('caseEntity.details.experimental_strategy_code')}
        </TooltipsHeader>
      ),
      size: 124,
      minSize: 124,
    }),
    // Assay status
    columnHelper.accessor(row => row.status_code, {
      id: 'status_code',
      cell: info => <AssayStatusCell status={info.getValue()} />,
      header: t('caseEntity.details.status_code'),
      size: 124,
      minSize: 124,
    }),
    // Last update
    columnHelper.accessor(row => row.updated_on, {
      id: 'updated_on',
      cell: info => <DateCell date={info.getValue()} />,
      header: () => (
        <TooltipsHeader tooltips={t('caseEntity.details.lastUpdate_tooltips')}>
          {t('caseEntity.details.lastUpdate')}
        </TooltipsHeader>
      ),
      size: 124,
      minSize: 124,
    }),
    // Actions Buttons
    {
      id: 'actions_menu',
      cell: ActionsMenuCell,
      size: 64,
      maxSize: 64,
      enableResizing: false,
      enablePinning: false,
    },
  ] as TableColumnDef<CaseAssay, any>[];
}

const defaultSettings = createColumnSettings([
  {
    id: 'seq_id',
    visible: true,
    label: 'caseEntity.details.assay_id',
  }, {
    id: 'sample_id',
    visible: true,
    label: 'caseEntity.details.sample_id',
  }, {
    id: 'sample_type_code',
    visible: true,
    label: 'caseEntity.details.sample_code_type',
  }, {
    id: 'histology_code',
    visible: true,
    label: 'caseEntity.details.histology_code',
  }, {
    id: 'experimental_strategy_code',
    visible: true,
    label: 'caseEntity.details.experimental_strategy_code',
  }, {
    id: 'status_code',
    visible: true,
    label: 'caseEntity.details.status_code',
  }, {
    id: 'updated_on',
    visible: true,
    label: 'caseEntity.details.updated_on',
  }
]);


export { getColumns, defaultSettings };
