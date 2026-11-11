import type { TFunction } from 'i18next';

import type { CaseStatus, PatientCase } from '@/api/api';
import CaseLinkCell from '@/components/base/data-table/cells/case-link-cell';
import DateCell from '@/components/base/data-table/cells/date-cell';
import EmptyCell from '@/components/base/data-table/cells/empty-cell';
import PriorityIndicatorCell from '@/components/base/data-table/cells/priority-indicator-cell';
import StatusCell from '@/components/base/data-table/cells/status-cell';
import {
  createAppColumnHelper,
  createColumnSettings,
  type TableColumnDef,
} from '@/components/base/data-table/data-table';

import AnalysisCodeCell from '../variant-interpretations/cells/analysis-code-cell';

import CaseTypeCell from './cells/case-type-cell';
import PrimaryConditionCell from './cells/primary-condition-cell';
import RequestedByCell from './cells/requested-by-cell';

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
      size: 160,
      minSize: 112,
    }),
    columnHelper.accessor(row => row.case_type_code, {
      id: 'case_type',
      cell: info => <CaseTypeCell code={info.getValue()} caseType={info.row.original.case_type} />,
      header: t('patient_entity.genomics.cases.headers.type'),
      size: 128,
      minSize: 96,
    }),
    columnHelper.accessor(row => row.analysis_catalog_code, {
      id: 'analysis',
      cell: info => <AnalysisCodeCell code={info.getValue()} name={info.row.original.analysis_catalog_name} />,
      header: t('patient_entity.genomics.cases.headers.analysis'),
      size: 112,
      minSize: 80,
    }),
    columnHelper.accessor(row => row.primary_condition_name, {
      id: 'primary_condition',
      cell: info => <PrimaryConditionCell mondoId={info.row.original.primary_condition_id} name={info.getValue()} />,
      header: t('patient_entity.genomics.cases.headers.primary_condition'),
      size: 288,
      minSize: 180,
    }),
    columnHelper.accessor(row => row.status_code, {
      id: 'status_code',
      cell: info => <StatusCell status={info.getValue() as CaseStatus} />,
      header: t('patient_entity.genomics.cases.headers.status'),
      size: 128,
      minSize: 96,
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
    columnHelper.accessor(row => row.ordering_organization_code, {
      id: 'requested_by',
      cell: info => <RequestedByCell code={info.getValue()} name={info.row.original.ordering_organization_name} />,
      header: t('patient_entity.genomics.cases.headers.requested_by'),
      size: 128,
      minSize: 96,
    }),
    columnHelper.accessor(row => row.updated_on, {
      id: 'updated_on',
      cell: info => <DateCell date={info.getValue()} />,
      header: t('patient_entity.genomics.cases.headers.updated'),
      size: 128,
      minSize: 96,
    }),
  ] as TableColumnDef<PatientCase, any>[];
}

const defaultSettings = createColumnSettings([
  { id: 'case_id', visible: true, label: 'patient_entity.genomics.cases.headers.case' },
  { id: 'case_type', visible: true, label: 'patient_entity.genomics.cases.headers.type' },
  { id: 'analysis', visible: true, label: 'patient_entity.genomics.cases.headers.analysis' },
  {
    id: 'primary_condition',
    visible: true,
    label: 'patient_entity.genomics.cases.headers.primary_condition',
  },
  { id: 'status_code', visible: true, label: 'patient_entity.genomics.cases.headers.status' },
  { id: 'priority_code', visible: true, label: 'patient_entity.genomics.cases.headers.priority' },
  { id: 'requested_by', visible: true, label: 'patient_entity.genomics.cases.headers.requested_by' },
  { id: 'updated_on', visible: true, label: 'patient_entity.genomics.cases.headers.updated' },
]);

export { getGenomicCasesColumns, defaultSettings };
