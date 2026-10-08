import type { TFunction } from 'i18next';

import type { CaseStatus } from '@/api/api';
import CaseLinkCell from '@/components/base/data-table/cells/case-link-cell';
import ExperimentalStrategyCell from '@/components/base/data-table/cells/experimental-strategy-code-cell';
import PriorityIndicatorCell from '@/components/base/data-table/cells/priority-indicator-cell';
import StatusCell from '@/components/base/data-table/cells/status-cell';
import TextTooltipCell from '@/components/base/data-table/cells/text-tooltip-cell';
import {
  createAppColumnHelper,
  createColumnSettings,
  type TableColumnDef,
} from '@/components/base/data-table/data-table';

import type { GenomicCase } from '../../../api/patient-genomics';

const columnHelper = createAppColumnHelper<GenomicCase>();

function getGenomicCasesColumns(t: TFunction<string, undefined>) {
  return [
    columnHelper.accessor(row => row.case_id, {
      id: 'case_id',
      cell: info => (
        <CaseLinkCell caseId={info.getValue()}>
          <span className="font-mono text-xs">{info.getValue()}</span>
        </CaseLinkCell>
      ),
      header: t('patient_entity.genomics.cases.headers.case'),
      size: 144,
      minSize: 100,
    }),
    columnHelper.accessor(row => row.priority_code, {
      id: 'priority_code',
      cell: info => <PriorityIndicatorCell code={info.getValue()} />,
      header: t('patient_entity.genomics.cases.headers.priority'),
      size: 112,
      minSize: 80,
    }),
    columnHelper.accessor(row => row.status_code, {
      id: 'status_code',
      cell: info => <StatusCell status={info.getValue() as CaseStatus} />,
      header: t('patient_entity.genomics.cases.headers.status'),
      size: 128,
      minSize: 96,
    }),
    columnHelper.accessor(row => row.sample_scope, {
      id: 'sample_scope',
      cell: info => <span className="text-muted-foreground">{info.getValue()}</span>,
      header: t('patient_entity.genomics.cases.headers.sample_scope'),
      size: 160,
      minSize: 100,
    }),
    columnHelper.accessor(row => row.assay, {
      id: 'assay',
      cell: info => <ExperimentalStrategyCell code={info.getValue()} />,
      header: t('patient_entity.genomics.cases.headers.assay'),
      size: 96,
      minSize: 72,
    }),
    columnHelper.accessor(row => row.requested_by, {
      id: 'requested_by',
      cell: info => (
        <TextTooltipCell tooltipText={info.row.original.requested_by_name}>{info.getValue()}</TextTooltipCell>
      ),
      header: t('patient_entity.genomics.cases.headers.requested_by'),
      size: 112,
      minSize: 80,
    }),
    columnHelper.accessor(row => row.updated_day, {
      id: 'updated_day',
      cell: info => (
        <span className="text-muted-foreground font-mono text-xs">
          {t('patient_entity.genomics.day', { day: info.getValue() })}
        </span>
      ),
      header: t('patient_entity.genomics.cases.headers.updated'),
      size: 112,
      minSize: 80,
    }),
  ] as TableColumnDef<GenomicCase, any>[];
}

const defaultSettings = createColumnSettings([
  { id: 'case_id', visible: true, label: 'patient_entity.genomics.cases.headers.case' },
  { id: 'priority_code', visible: true, label: 'patient_entity.genomics.cases.headers.priority' },
  { id: 'status_code', visible: true, label: 'patient_entity.genomics.cases.headers.status' },
  { id: 'sample_scope', visible: true, label: 'patient_entity.genomics.cases.headers.sample_scope' },
  { id: 'assay', visible: true, label: 'patient_entity.genomics.cases.headers.assay' },
  { id: 'requested_by', visible: true, label: 'patient_entity.genomics.cases.headers.requested_by' },
  { id: 'updated_day', visible: true, label: 'patient_entity.genomics.cases.headers.updated' },
]);

export { getGenomicCasesColumns, defaultSettings };
