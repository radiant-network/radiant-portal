import { createColumnHelper } from '@tanstack/react-table';
import { TFunction } from 'i18next';

import { CaseSequencingExperiment } from '@/api/api';
import BadgeCell from '@/components/base/data-table/cells/badge-cell';
import DateCell from '@/components/base/data-table/cells/date-cell';
import ExperimentalStrategyCell from '@/components/base/data-table/cells/experimental-strategy-code-cell';
import { createColumnSettings, TableColumnDef } from '@/components/base/data-table/data-table';
import TooltipHeader from '@/components/base/data-table/headers/table-tooltip-header';
import StatusCell from 'components/base/data-table/cells/status-cell';

import SequencingActionsCell from './cells/sequencing-actions-cell';

const columnHelper = createColumnHelper<CaseSequencingExperiment>();

function getColumns(t: TFunction<string, undefined>) {
  return [
    // Sequencing ID
    columnHelper.accessor(row => row.seq_id, {
      id: 'seq_id',
      cell: info => info.getValue(),
      header: () => (
        <TooltipHeader tooltip={t('case_entity.details.sequencing_id_tooltip')}>
          {t('case_entity.details.sequencing_id')}
        </TooltipHeader>
      ),
      size: 124,
      minSize: 40,
    }),
    // Sample ID
    columnHelper.accessor(row => row.sample_submitter_id, {
      id: 'sample_id',
      cell: info => info.getValue(),
      header: t('case_entity.details.sample_id'),
      size: 124,
      minSize: 40,
    }),
    // Patient
    columnHelper.accessor(row => row.relationship_to_proband, {
      id: 'relation_to_proband',
      cell: info => (
        <BadgeCell className="capitalize" variant="outline">
          {info.getValue()}
        </BadgeCell>
      ),
      header: t('case_entity.details.patient'),
      size: 110,
      minSize: 40,
    }),
    // Sample Type
    columnHelper.accessor(row => row.sample_type_code, {
      id: 'sample_type_code',
      cell: info => (
        <BadgeCell className="uppercase" variant="secondary">
          {info.getValue()}
        </BadgeCell>
      ),
      header: t('case_entity.details.sample_type_code'),
      size: 124,
      minSize: 40,
    }),
    // Histology
    columnHelper.accessor(row => row.histology_code, {
      id: 'histology_code',
      cell: info => (
        <BadgeCell className="capitalize" variant="outline">
          {info.getValue()}
        </BadgeCell>
      ),
      header: t('case_entity.details.histology_code'),
      size: 124,
      minSize: 40,
    }),
    // Exp. Strat.
    columnHelper.accessor(row => row.experimental_strategy_code, {
      id: 'experimental_strategy_code',
      cell: info => <ExperimentalStrategyCell code={info.getValue()} />,
      header: () => (
        <TooltipHeader tooltip={t('case_entity.details.experimental_strategy_code_tooltip')}>
          {t('case_entity.details.experimental_strategy_code')}
        </TooltipHeader>
      ),
      size: 124,
      minSize: 40,
    }),
    // Sequencing status
    columnHelper.accessor(row => row.status_code, {
      id: 'status_code',
      cell: info => <StatusCell status={info.getValue()} />,
      header: () => (
        <TooltipHeader tooltip={t('case_entity.details.status_code_tooltip')}>
          {t('case_entity.details.status_code')}
        </TooltipHeader>
      ),
      size: 124,
      minSize: 40,
    }),
    // Last update
    columnHelper.accessor(row => row.updated_on, {
      id: 'updated_on',
      cell: info => <DateCell date={info.getValue()} />,
      header: () => (
        <TooltipHeader tooltip={t('case_entity.details.date_format_tooltip')}>
          {t('case_entity.details.last_update')}
        </TooltipHeader>
      ),
      size: 124,
      minSize: 40,
    }),
    // Action Buttons
    {
      id: 'actions',
      cell: SequencingActionsCell,
      size: 60,
      maxSize: 60,
      enableResizing: false,
      enablePinning: true,
    },
  ] as TableColumnDef<CaseSequencingExperiment, any>[];
}

const defaultSettings = createColumnSettings([
  {
    id: 'seq_id',
    visible: true,
    label: 'caseEntity.details.sequencing_id',
  },
  {
    id: 'sample_id',
    visible: true,
    label: 'caseEntity.details.sample_id',
  },
  {
    id: 'relation_to_proband',
    visible: true,
    label: 'caseEntity.details.patient',
  },
  {
    id: 'sample_type_code',
    visible: true,
    label: 'caseEntity.details.sample_code_type',
  },
  {
    id: 'histology_code',
    visible: true,
    label: 'caseEntity.details.histology_code',
  },
  {
    id: 'experimental_strategy_code',
    visible: true,
    label: 'caseEntity.details.experimental_strategy_code',
  },
  {
    id: 'status_code',
    visible: true,
    label: 'caseEntity.details.status_code',
  },
  {
    id: 'updated_on',
    visible: true,
    label: 'caseEntity.details.updated_on',
  },
  {
    id: 'actions',
    visible: true,
    fixed: true,
    pinningPosition: 'right',
  },
]);

export { getColumns, defaultSettings };
