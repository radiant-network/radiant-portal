import { createColumnHelper } from '@tanstack/react-table';
import { TFunction } from 'i18next';

import { CaseResult } from '@/api/api';
import AnalysisTypeCodeCell, {
  AnalysisTypeCodeCellTooltip,
} from '@/components/base/data-table/cells/analysis-type-code-cell';
import AnchorLinkCell from '@/components/base/data-table/cells/anchor-link-cell';
import AssayStatusCell from '@/components/base/data-table/cells/assay-status-cell';
import DateCell from '@/components/base/data-table/cells/date-cell';
import PhenotypeConditionLinkCell from '@/components/base/data-table/cells/phenotype-condition-link-cell';
import PriorityIndicatorCell from '@/components/base/data-table/cells/priority-indicator-cell';
import TextTooltipCell from '@/components/base/data-table/cells/text-tooltip-cell';
import { createColumnSettings, TableColumnDef } from '@/components/base/data-table/data-table';
import TooltipHeader from '@/components/base/data-table/headers/table-tooltip-header';

import CaseActionsMenuCell from '../cells/case-actions-menu-cell';

const columnHelper = createColumnHelper<CaseResult>();

function getCaseExplorationColumns(t: TFunction<string, undefined>) {
  return [
    // case
    columnHelper.accessor(row => row.case_id, {
      id: 'case_id',
      cell: info => (
        <AnchorLinkCell href={`/case/entity/${info.row.original.case_id}`}>{info.getValue()}</AnchorLinkCell>
      ),
      header: t('case_exploration.case.headers.case_id'),
      size: 48,
      minSize: 40,
    }),
    // Patient
    columnHelper.accessor(row => row.proband_id, {
      id: 'proband_id',
      cell: info => <>{info.getValue()}</>,
      header: t('case_exploration.case.headers.patient_id'),
      size: 48,
      minSize: 40,
    }),
    // MRN
    columnHelper.accessor(row => row.proband_organization_id, {
      id: 'proband_organization_id',
      cell: info => <>{info.getValue()}</>,
      header: () => (
        <TooltipHeader tooltip={t('case_exploration.case.headers.mrn_tooltip')}>
          {t('case_exploration.case.headers.mrn')}
        </TooltipHeader>
      ),
      size: 124,
      minSize: 40,
    }),
    // Priority
    columnHelper.accessor(row => row.priority_code, {
      id: 'priority_code',
      cell: info => <PriorityIndicatorCell code={info.getValue()} />,
      header: t('case_exploration.case.headers.priority_code'),
      size: 124,
      minSize: 40,
    }),
    // Status
    columnHelper.accessor(row => row.status_code, {
      id: 'status_code',
      cell: info => <AssayStatusCell status={info.getValue()} />,
      header: t('case_exploration.case.headers.status_code'),
      size: 124,
      minSize: 40,
    }),
    // Type
    columnHelper.accessor(row => row.case_type, {
      id: 'case_type',
      cell: info => <AnalysisTypeCodeCell code={info.getValue()} />,
      header: () => (
        <TooltipHeader tooltip={<AnalysisTypeCodeCellTooltip />}>
          {t('case_exploration.case.headers.case_type')}
        </TooltipHeader>
      ),
      size: 48,
      minSize: 40,
      enableSorting: false,
    }),
    // Analysis
    columnHelper.accessor(row => row.case_analysis_code, {
      id: 'case_analysis_code',
      cell: info => (
        <TextTooltipCell tooltipText={info.row.original.case_analysis_name}>{info.getValue()}</TextTooltipCell>
      ),
      header: t('case_exploration.case.headers.case_analysis_code'),
      size: 48,
      minSize: 40,
    }),
    // Primary Condition
    columnHelper.accessor(row => row.primary_condition_id, {
      id: 'primary_condition',
      cell: info => (
        <PhenotypeConditionLinkCell code={info.getValue()} name={info.row.original.primary_condition_name} />
      ),
      header: t('case_exploration.case.headers.primary_condition'),
      size: 208,
      minSize: 40,
    }),
    // Req. by
    columnHelper.accessor(row => row.requested_by_code, {
      id: 'requested_by_code',
      cell: info => (
        <TextTooltipCell tooltipText={info.row.original.requested_by_name}>{info.getValue()}</TextTooltipCell>
      ),
      header: () => (
        <TooltipHeader tooltip={t('case_exploration.case.headers.requested_by_code_tooltip')}>
          {t('case_exploration.case.headers.requested_by_code')}
        </TooltipHeader>
      ),
      size: 48,
      minSize: 40,
    }),
    // Project
    columnHelper.accessor(row => row.project_code, {
      id: 'project_code',
      cell: info => <TextTooltipCell tooltipText={info.row.original.project_name}>{info.getValue()}</TextTooltipCell>,
      header: t('case_exploration.case.headers.project_code'),
      size: 48,
      minSize: 40,
    }),
    // Created on
    columnHelper.accessor(row => row.created_on, {
      id: 'created_on',
      cell: info => <DateCell date={info.getValue()} />,
      header: () => (
        <TooltipHeader tooltip={t('case_exploration.case.headers.created_on_tooltip')}>
          {t('case_exploration.case.headers.created_on')}
        </TooltipHeader>
      ),
      size: 96,
      minSize: 40,
    }),
    // Updated
    columnHelper.accessor(row => row.updated_on, {
      id: 'updated_on',
      cell: info => <DateCell date={info.getValue()} />,
      header: () => (
        <TooltipHeader tooltip={t('case_exploration.case.headers.updated_on_tooltip')}>
          {t('case_exploration.case.headers.updated_on')}
        </TooltipHeader>
      ),
      size: 96,
      minSize: 40,
    }),
    // Prescriber
    columnHelper.accessor(row => row.prescriber, {
      id: 'prescriber',
      cell: info => info.getValue(),
      header: () => (
        <TooltipHeader tooltip={t('case_exploration.case.headers.prescriber_tooltip')}>
          {t('case_exploration.case.headers.prescriber')}
        </TooltipHeader>
      ),
      size: 124,
      minSize: 40,
    }),
    // Diagnostic lab
    columnHelper.accessor(row => row.performer_lab_code, {
      id: 'diagnostic_lab',
      cell: info => (
        <TextTooltipCell tooltipText={info.row.original.performer_lab_name}>{info.getValue()}</TextTooltipCell>
      ),
      header: () => (
        <TooltipHeader tooltip={t('case_exploration.case.headers.diagnostic_lab_tooltip')}>
          {t('case_exploration.case.headers.diagnostic_lab')}
        </TooltipHeader>
      ),
      size: 124,
      minSize: 40,
    }),
    // Request
    columnHelper.accessor(row => row.request_id, {
      id: 'request_id',
      cell: info => info.getValue(),
      header: t('case_exploration.case.headers.request_id'),
      size: 48,
      minSize: 40,
    }),
    // Patient managing organization
    columnHelper.accessor(row => row.organization_code, {
      id: 'managing_organization',
      cell: info => (
        <TextTooltipCell tooltipText={info.row.original.organization_name}>{info.getValue()}</TextTooltipCell>
      ),
      header: () => (
        <TooltipHeader tooltip={t('case_exploration.case.headers.managing_organization_tooltip')}>
          {t('case_exploration.case.headers.managing_organization')}
        </TooltipHeader>
      ),
      size: 124,
      minSize: 40,
    }),
    // Actions Buttons
    {
      id: 'actions',
      cell: CaseActionsMenuCell,
      size: 44,
      maxSize: 44,
      enableResizing: false,
      enablePinning: true,
    },
  ] as TableColumnDef<CaseResult, any>[];
}

const defaultSettings = createColumnSettings([
  {
    id: 'case_id',
    visible: true,
    label: 'case_exploration.case.headers.case_id',
  },
  {
    id: 'proband_id',
    visible: false,
    label: 'case_exploration.case.headers.patient_id',
  },
  {
    id: 'proband_organization_id',
    visible: true,
    label: 'case_exploration.case.headers.mrn',
  },
  {
    id: 'priority_code',
    visible: true,
    label: 'case_exploration.case.headers.priority_code',
  },
  {
    id: 'status_code',
    visible: true,
    label: 'case_exploration.case.headers.status_code',
  },
  {
    id: 'case_type',
    visible: true,
    label: 'case_exploration.case.headers.case_type',
  },
  {
    id: 'case_analysis_code',
    visible: true,
    label: 'case_exploration.case.headers.case_analysis_code',
  },
  {
    id: 'primary_condition',
    visible: false,
    label: 'case_exploration.case.headers.primary_condition',
  },
  {
    id: 'requested_by_code',
    visible: true,
    label: 'case_exploration.case.headers.requested_by_code',
  },
  {
    id: 'project_code',
    visible: false,
    label: 'case_exploration.case.headers.project_code',
  },
  {
    id: 'created_on',
    visible: false,
    label: 'case_exploration.case.headers.created_on',
  },
  {
    id: 'updated_on',
    visible: true,
    label: 'case_exploration.case.headers.updated_on',
  },
  {
    id: 'prescriber',
    visible: false,
    label: 'case_exploration.case.headers.prescriber',
  },
  {
    id: 'diagnostic_lab',
    visible: false,
    label: 'case_exploration.case.headers.diagnostic_lab',
  },
  {
    id: 'request_id',
    visible: false,
    label: 'case_exploration.case.headers.request_id',
  },
  {
    id: 'managing_organization',
    visible: false,
    label: 'case_exploration.case.headers.managing_organization',
  },
  {
    id: 'actions',
    visible: true,
    fixed: true,
    pinningPosition: 'right',
  },
]);

export { getCaseExplorationColumns, defaultSettings };
