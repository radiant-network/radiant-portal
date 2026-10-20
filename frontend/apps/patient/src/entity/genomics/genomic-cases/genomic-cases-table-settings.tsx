import type { TFunction } from 'i18next';

import type { CaseStatus, PatientCase } from '@/api/api';
import CaseLinkCell from '@/components/base/data-table/cells/case-link-cell';
import EmptyCell from '@/components/base/data-table/cells/empty-cell';
import ExperimentalStrategyCell from '@/components/base/data-table/cells/experimental-strategy-code-cell';
import PriorityIndicatorCell from '@/components/base/data-table/cells/priority-indicator-cell';
import StatusCell from '@/components/base/data-table/cells/status-cell';
import {
  createAppColumnHelper,
  createColumnSettings,
  type TableColumnDef,
} from '@/components/base/data-table/data-table';

const columnHelper = createAppColumnHelper<PatientCase>();

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
      cell: info => {
        const value = info.getValue();
        return value ? <PriorityIndicatorCell code={value} /> : <EmptyCell />;
      },
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
    columnHelper.accessor(row => row.analysis_catalog_code, {
      id: 'assay',
      cell: info => {
        const value = info.getValue();
        return value ? <ExperimentalStrategyCell code={value} /> : <EmptyCell />;
      },
      header: t('patient_entity.genomics.cases.headers.assay'),
      size: 96,
      minSize: 72,
    }),
  ] as TableColumnDef<PatientCase, any>[];
}

const defaultSettings = createColumnSettings([
  { id: 'case_id', visible: true, label: 'patient_entity.genomics.cases.headers.case' },
  { id: 'priority_code', visible: true, label: 'patient_entity.genomics.cases.headers.priority' },
  { id: 'status_code', visible: true, label: 'patient_entity.genomics.cases.headers.status' },
  { id: 'assay', visible: true, label: 'patient_entity.genomics.cases.headers.assay' },
]);

export { getGenomicCasesColumns, defaultSettings };
