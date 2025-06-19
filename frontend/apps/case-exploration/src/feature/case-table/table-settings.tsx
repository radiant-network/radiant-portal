import { createColumnHelper } from '@tanstack/react-table';
import { CaseResult } from '@/api/api';
import TooltipsHeader from '@/components/base/data-table/headers/table-tooltips-header';
import LinkCell from '@/components/base/data-table/cells/link-cell';
import { createColumnSettings, TableColumnDef } from '@/components/base/data-table/data-table';
import DateCell from '@/components/base/data-table/cells/date-cell';
import TextTooltipsCell from '@/components/base/data-table/cells/text-tooltips-cell';
import { TFunction } from 'i18next';
import PriorityCell from '../cells/priority-cell';
import StatusCell from '../cells/status-cells';
import AnalysisTypeCodeCell, { AnalysisTypeCodeCellTooltips } from '../cells/analysis-type-code-cell';
import CaseActionsMenuCell from '../cells/case-actions-menu-cell';

const columnHelper = createColumnHelper<CaseResult>();

function getCaseExplorationColumns(t: TFunction<string, undefined>) {
  return [
    // case
    columnHelper.accessor(row => row.case_id, {
      id: 'case_id',
      cell: info => <LinkCell url={`/cases/entity/${info.row.original.case_id}`}>{info.getValue()}</LinkCell>,
      header: t('caseExploration.case.headers.case_id'),
      size: 124,
      minSize: 124,
    }),
    // MRN
    columnHelper.accessor(row => row.mrn, {
      id: 'mrn',
      cell: info => <>{info.getValue()}</>,
      header: () => (
        <TooltipsHeader tooltips={t('caseExploration.case.headers.mrn_tooltips')}>
          {t('caseExploration.case.headers.mrn')}
        </TooltipsHeader>
      ),
      size: 124,
      minSize: 124,
    }),
    // Priority
    columnHelper.accessor(row => row.priority_code, {
      id: 'priority_code',
      cell: info => <PriorityCell code={info.getValue()} />,
      header: t('caseExploration.case.headers.priority_code'),
      size: 124,
      minSize: 124,
    }),
    // Status
    columnHelper.accessor(row => row.status_code, {
      id: 'status_code',
      cell: info => <StatusCell status={info.getValue()} />,
      header: t('caseExploration.case.headers.status_code'),
      size: 124,
      minSize: 124,
    }),
    // Type
    columnHelper.accessor(row => row.case_analysis_type_code, {
      id: 'case_analysis_type_code',
      cell: info => <AnalysisTypeCodeCell code={info.getValue()} />,
      header: () => (
        <TooltipsHeader tooltips={<AnalysisTypeCodeCellTooltips />}>
          {t('caseExploration.case.headers.case_analysis_type_code')}
        </TooltipsHeader>
      ),
      size: 120,
      minSize: 120,
    }),
    // Analysis
    columnHelper.accessor(row => row.case_analysis_code, {
      id: 'case_analysis_code',
      cell: info => (
        <TextTooltipsCell tooltipsText={info.row.original.case_analysis_name}>{info.getValue()}</TextTooltipsCell>
      ),
      header: t('caseExploration.case.headers.case_analysis_code'),
      size: 120,
      minSize: 120,
    }),
    // Req. by
    columnHelper.accessor(row => row.requested_by_code, {
      id: 'requested_by_code',
      cell: info => (
        <TextTooltipsCell tooltipsText={info.row.original.requested_by_name}>{info.getValue()}</TextTooltipsCell>
      ),
      header: () => (
        <TooltipsHeader tooltips={t('caseExploration.case.headers.requested_by_code_tooltips')}>
          {t('caseExploration.case.headers.requested_by_code')}
        </TooltipsHeader>
      ),
      size: 120,
      minSize: 120,
    }),
    // Updated
    columnHelper.accessor(row => row.updated_on, {
      id: 'updated_on',
      cell: info => <DateCell date={info.getValue()} />,
      header: () => (
        <TooltipsHeader tooltips={t('caseExploration.case.headers.updated_on_tooltips')}>
          {t('caseExploration.case.headers.updated_on')}
        </TooltipsHeader>
      ),
      size: 120,
      minSize: 120,
    }),
    // Actions Buttons
    {
      id: 'actions_menu',
      cell: CaseActionsMenuCell,
      size: 64,
      maxSize: 64,
      enableResizing: false,
      enablePinning: false,
    },
  ] as TableColumnDef<CaseResult, any>[]; // todo replace with correct type when api is updated
}

const defaultSettings = createColumnSettings([
  {
    id: 'case_id',
    visible: true,
    label: 'caseExploration.case.headers.case_id',
  },
  {
    id: 'mrn',
    visible: true,
    label: 'caseExploration.case.headers.mrn',
  },
  {
    id: 'priority_code',
    visible: true,
    label: 'caseExploration.case.headers.priority_code',
  },
  {
    id: 'status_code',
    visible: true,
    label: 'caseExploration.case.headers.status_code',
  },
  {
    id: 'case_analysis_type_code',
    visible: true,
    label: 'caseExploration.case.headers.case_analysis_type_code',
  },
  {
    id: 'case_analysis_code',
    visible: true,
    label: 'caseExploration.case.headers.case_analysis_code',
  },
  {
    id: 'requested_by_code',
    visible: true,
    label: 'caseExploration.case.headers.requested_by_code',
  },
  {
    id: 'updated_on',
    visible: true,
    label: 'caseExploration.case.headers.updated_on',
  },
  {
    id: 'actions_menu',
    visible: true,
    fixed: true,
  },
]);

export { getCaseExplorationColumns, defaultSettings };
