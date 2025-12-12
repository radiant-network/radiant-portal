import { createColumnHelper } from '@tanstack/react-table';
import { TFunction } from 'i18next';
import { EllipsisVertical } from 'lucide-react';

import { VariantInterpretedCase } from '@/api/api';
import AssayStatusCell from '@/components/base/data-table/cells/assay-status-cell';
import BadgeCell from '@/components/base/data-table/cells/badge-cell';
import ClassificationCell from '@/components/base/data-table/cells/classification-cell';
import ConditionCell from '@/components/base/data-table/cells/condition-cell';
import DateCell from '@/components/base/data-table/cells/date-cell';
import EmptyCell from '@/components/base/data-table/cells/empty-cell';
import RelationshipToProbandCell from '@/components/base/data-table/cells/relationship-to-proband-cell';
import RowExpandCell from '@/components/base/data-table/cells/row-expand-cell';
import TextTooltipCell from '@/components/base/data-table/cells/text-tooltip-cell';
import { createColumnSettings, TableColumnDef } from '@/components/base/data-table/data-table';
import TooltipHeader from '@/components/base/data-table/headers/table-tooltip-header';
import AnchorLink from '@/components/base/navigation/anchor-link';
import { Button } from '@/components/base/shadcn/button';

const interpretedCasesColumnHelper = createColumnHelper<VariantInterpretedCase>();

function getInterpretedCasesColumns(t: TFunction<string, undefined>) {
  return [
    {
      id: 'rowExpand',
      cell: RowExpandCell,
      size: 40,
      enableResizing: false,
      enablePinning: false,
    },
    interpretedCasesColumnHelper.accessor(row => row.case_id, {
      id: 'case_id',
      cell: info => (
        <RelationshipToProbandCell relationship={info.row.original.relationship_to_proband}>
          <AnchorLink href={`/case/entity/${info.getValue()}`} mono size="xs" variant="secondary">
            {info.getValue()}
          </AnchorLink>
        </RelationshipToProbandCell>
      ),
      header: t('variant_entity.cases.interpreted_table.headers.case'),
      size: 120,
      minSize: 80,
      maxSize: 150,
      enableSorting: false,
    }),
    interpretedCasesColumnHelper.accessor(row => row.interpretation_updated_on, {
      id: 'interpretation_updated_on',
      cell: info => <DateCell date={info.getValue()} />,
      header: () => (
        <TooltipHeader tooltip={t('variant_entity.cases.interpreted_table.headers.date.tooltip')}>
          {t('variant_entity.cases.interpreted_table.headers.date')}
        </TooltipHeader>
      ),
      size: 120,
      minSize: 80,
      maxSize: 150,
    }),
    interpretedCasesColumnHelper.accessor(row => row.condition_name, {
      id: 'condition_name',
      cell: info => <ConditionCell conditionId={info.row.original.condition_id} conditionName={info.getValue()} />,
      header: t('variant_entity.cases.interpreted_table.headers.mondo'),
      minSize: 120,
      maxSize: 350,
      enableSorting: false,
    }),
    interpretedCasesColumnHelper.accessor(row => row.classification, {
      id: 'classification',
      cell: info => <ClassificationCell codes={[info.getValue()]} />,
      header: t('variant_entity.cases.interpreted_table.headers.classification'),
      minSize: 150,
      maxSize: 250,
    }),
    interpretedCasesColumnHelper.accessor(row => row.zygosity, {
      id: 'zygosity',
      cell: info => <BadgeCell variant="outline">{info.getValue()}</BadgeCell>,
      header: t('variant_entity.cases.interpreted_table.headers.zygosity'),
      size: 120,
      minSize: 80,
      maxSize: 150,
      enableSorting: false,
    }),
    interpretedCasesColumnHelper.accessor(row => row.transcript_id, {
      id: 'inheritance',
      cell: () => <EmptyCell />,
      header: t('variant_entity.cases.interpreted_table.headers.inheritance'),
      size: 130,
      minSize: 130,
      maxSize: 250,
      enableSorting: false,
    }),
    interpretedCasesColumnHelper.accessor(row => row.diagnosis_lab_code, {
      id: 'diagnosis_lab_code',
      cell: info => (
        <TextTooltipCell tooltipText={info.row.original.diagnosis_lab_name}>{info.getValue()}</TextTooltipCell>
      ),
      header: t('variant_entity.cases.interpreted_table.headers.institution'),
      minSize: 100,
      maxSize: 150,
      size: 120,
      enableSorting: false,
    }),
    interpretedCasesColumnHelper.accessor(row => row.analysis_catalog_code, {
      id: 'analysis_catalog_code',
      cell: info => (
        <TextTooltipCell tooltipText={info.row.original.analysis_catalog_name}>{info.getValue()}</TextTooltipCell>
      ),
      header: t('variant_entity.cases.interpreted_table.headers.test'),
      minSize: 80,
      maxSize: 150,
      size: 120,
      enableSorting: false,
    }),
    interpretedCasesColumnHelper.accessor(row => row.status_code, {
      id: 'status_code',
      cell: info => <AssayStatusCell status={info.getValue()} />,
      header: t('variant_entity.cases.interpreted_table.headers.status'),
      minSize: 100,
      maxSize: 150,
      size: 120,
    }),
    interpretedCasesColumnHelper.accessor(row => row, {
      id: 'action',
      cell: () => (
        <Button iconOnly variant="outline" className="size-6">
          <EllipsisVertical />
        </Button>
      ),
      header: '',
      size: 50,
      enableSorting: false,
      enablePinning: true,
      enableResizing: false,
    }),
  ] as TableColumnDef<VariantInterpretedCase, any>[]; // todo replace with correct type when api is updated
}

const interpretedCasesDefaultSettings = createColumnSettings([
  {
    id: 'rowExpand',
    visible: true,
    fixed: true,
  },
  {
    id: 'case_id',
    visible: true,
  },
  {
    id: 'patient_id',
    visible: true,
    label: 'variant.headers.patient_id',
  },
  {
    id: 'relationship_to_proband',
    visible: true,
    label: 'variant.headers.relationship_to_proband',
  },

  {
    id: 'interpretation_updated_on',
    visible: true,
  },
  {
    id: 'condition_name',
    visible: true,
    label: 'variant.headers.mondo',
  },
  {
    id: 'classification',
    visible: true,
    label: 'variant.headers.classification',
  },
  {
    id: 'zygosity',
    visible: true,
    label: 'variant.headers.zygosity',
  },
  {
    id: 'inheritance',
    visible: true,
    label: 'variant.headers.inheritance',
  },
  {
    id: 'diagnosis_lab_code',
    visible: true,
    label: 'variant.headers.institution',
  },
  {
    id: 'analysis_catalog_code',
    visible: true,
    label: 'variant.headers.test',
  },
  {
    id: 'status_code',
    visible: true,
    label: 'variant.headers.status',
  },
  {
    id: 'action',
    visible: false,
    label: '',
  },
]);

export { getInterpretedCasesColumns, interpretedCasesDefaultSettings };
