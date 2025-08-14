import { createColumnHelper } from '@tanstack/react-table';
import { TFunction } from 'i18next';

import { CaseAssay } from '@/api/api';
import AssayStatusCell from '@/components/base/data-table/cells/assay-status-cell';
import BadgeCell from '@/components/base/data-table/cells/badge-cell';
import DateCell from '@/components/base/data-table/cells/date-cell';
import ExperimentalStrategyCell from '@/components/base/data-table/cells/experimental-strategy-code-cell';
import RelationshipToProbandCell from '@/components/base/data-table/cells/relationship-to-proband-cell';
import { createColumnSettings, TableColumnDef } from '@/components/base/data-table/data-table';
import TooltipsHeader from '@/components/base/data-table/headers/table-tooltips-header';

import ActionsMenuCell from '../cells/actions-menu-cell';

const columnHelper = createColumnHelper<CaseAssay>();

function getColumns(t: TFunction<string, undefined>) {
  return [
    // Assay ID
    columnHelper.accessor(row => row.seq_id, {
      id: 'seq_id',
      cell: info => info.getValue(),
      header: t('case_entity.details.assay_id'),
      size: 124,
      minSize: 124,
    }),
    // Sample ID
    columnHelper.accessor(row => row.sample_id, {
      id: 'sample_id',
      cell: info => (
        <RelationshipToProbandCell relationship={info.row.original.relationship_to_proband}>
          <>{info.getValue()}</>
        </RelationshipToProbandCell>
      ),
      header: t('case_entity.details.sample_id'),
      size: 124,
      minSize: 124,
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
      minSize: 124,
    }),
    // Histology
    columnHelper.accessor(row => row.histology_code, {
      id: 'histology_code',
      cell: info => (
        <BadgeCell className="capitalize" variant="secondary">
          {info.getValue()}
        </BadgeCell>
      ),
      header: t('case_entity.details.histology_code'),
      size: 124,
      minSize: 124,
    }),
    // Exp. Strat.
    columnHelper.accessor(row => row.experimental_strategy_code, {
      id: 'experimental_strategy_code',
      cell: info => <ExperimentalStrategyCell code={info.getValue()} />,
      header: () => (
        <TooltipsHeader tooltips={t('case_entity.details.experimental_strategy_code_tooltip')}>
          {t('case_entity.details.experimental_strategy_code')}
        </TooltipsHeader>
      ),
      size: 124,
      minSize: 124,
    }),
    // Assay status
    columnHelper.accessor(row => row.status_code, {
      id: 'status_code',
      cell: info => <AssayStatusCell status={info.getValue()} />,
      header: t('case_entity.details.status_code'),
      size: 124,
      minSize: 124,
    }),
    // Last update
    columnHelper.accessor(row => row.updated_on, {
      id: 'updated_on',
      cell: info => <DateCell date={info.getValue()} />,
      header: () => (
        <TooltipsHeader tooltips={t('case_entity.details.date_format_tooltip')}>
          {t('case_entity.details.last_update')}
        </TooltipsHeader>
      ),
      size: 124,
      minSize: 124,
    }),
    // Actions Buttons
    {
      id: 'actions_menu',
      cell: ActionsMenuCell,
      size: 44,
      maxSize: 44,
      enableResizing: false,
      enablePinning: true,
    },
  ] as TableColumnDef<CaseAssay, any>[];
}

const defaultSettings = createColumnSettings([
  {
    id: 'seq_id',
    visible: true,
    label: 'caseEntity.details.assay_id',
  },
  {
    id: 'sample_id',
    visible: true,
    label: 'caseEntity.details.sample_id',
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
]);

export { getColumns, defaultSettings };
