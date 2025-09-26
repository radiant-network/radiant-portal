import { createColumnHelper } from '@tanstack/react-table';
import { TFunction } from 'i18next';
import { EllipsisVertical } from 'lucide-react';

import { Term, VariantInterpretedCase, VariantUninterpretedCase } from '@/api/api';
import AffectedStatusCell from '@/components/base/data-table/cells/affected-status-cell';
import AssayStatusCell from '@/components/base/data-table/cells/assay-status-cell';
import BadgeCell from '@/components/base/data-table/cells/badge-cell';
import ClassificationCell from '@/components/base/data-table/cells/classification-cell';
import ConditionCell from '@/components/base/data-table/cells/condition-cell';
import DateCell from '@/components/base/data-table/cells/date-cell';
import DialogListCell from '@/components/base/data-table/cells/dialog-list-cell';
import EmptyCell from '@/components/base/data-table/cells/empty-cell';
import RelationshipToProbandCell from '@/components/base/data-table/cells/relationship-to-proband-cell';
import RowExpandCell from '@/components/base/data-table/cells/row-expand-cell';
import TextCell from '@/components/base/data-table/cells/text-cell';
import TextTooltipCell from '@/components/base/data-table/cells/text-tooltip-cell';
import { createColumnSettings, TableColumnDef } from '@/components/base/data-table/data-table';
import TooltipHeader from '@/components/base/data-table/headers/table-tooltip-header';
import AnchorLink from '@/components/base/navigation/anchor-link';
import PhenotypeConditionLink from '@/components/base/navigation/phenotypes/phenotype-condition-link';
import { Button } from '@/components/base/ui/button';

const interpretedCasesColumnHelper = createColumnHelper<VariantInterpretedCase>();
const otherCasesColumnHelper = createColumnHelper<VariantUninterpretedCase>();

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
    interpretedCasesColumnHelper.accessor(row => row.performer_lab_code, {
      id: 'performer_lab_code',
      cell: info => (
        <TextTooltipCell tooltipText={info.row.original.performer_lab_name}>{info.getValue()}</TextTooltipCell>
      ),
      header: t('variant_entity.cases.interpreted_table.headers.institution'),
      minSize: 100,
      maxSize: 150,
      size: 120,
      enableSorting: false,
    }),
    interpretedCasesColumnHelper.accessor(row => row.case_analysis_code, {
      id: 'case_analysis_code',
      cell: info => (
        <TextTooltipCell tooltipText={info.row.original.case_analysis_name}>{info.getValue()}</TextTooltipCell>
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

function getOtherCasesColumns(t: TFunction<string, undefined>) {
  return [
    otherCasesColumnHelper.accessor(row => row.case_id, {
      id: 'case_id',
      cell: info => (
        <RelationshipToProbandCell relationship={info.row.original.relationship_to_proband}>
          <AnchorLink href={`/case/entity/${info.getValue()}`} mono size="xs">
            {info.getValue()}
          </AnchorLink>
        </RelationshipToProbandCell>
      ),
      header: t('variant_entity.cases.other_table.headers.case'),
      minSize: 80,
      maxSize: 150,
      size: 120,
      enableSorting: false,
    }),
    otherCasesColumnHelper.accessor(row => row.seq_id, {
      id: 'seq_id',
      cell: info => <span>{info.getValue()}</span>,
      header: t('variant_entity.cases.other_table.headers.seq_id'),
      minSize: 80,
      maxSize: 150,
      size: 120,
      enableSorting: false,
    }),
    otherCasesColumnHelper.accessor(row => row.patient_id, {
      id: 'patient_id',
      cell: info => <span>{info.getValue()}</span>,
      header: t('variant_entity.cases.other_table.headers.patient_id'),
      minSize: 80,
      maxSize: 150,
      size: 120,
      enableSorting: false,
    }),
    otherCasesColumnHelper.accessor(row => row.submitter_sample_id, {
      id: 'submitter_sample_id',
      cell: info => <TextCell>{info.getValue()}</TextCell>,
      header: t('variant_entity.cases.other_table.headers.sample'),
      minSize: 80,
      maxSize: 150,
      size: 120,
      enableSorting: false,
    }),
    otherCasesColumnHelper.accessor(row => row.affected_status, {
      id: 'affected_status',
      cell: info => <AffectedStatusCell status={info.getValue()} />,
      header: t('variant_entity.cases.other_table.headers.affected_status'),
      minSize: 80,
      maxSize: 150,
      size: 120,
      enableSorting: false,
    }),
    otherCasesColumnHelper.accessor(row => row.created_on, {
      id: 'created_on',
      cell: info => <DateCell date={info.getValue()} />,
      header: () => (
        <TooltipHeader tooltip={t('variant_entity.cases.other_table.headers.date.tooltip')}>
          {t('variant_entity.cases.other_table.headers.date')}
        </TooltipHeader>
      ),
      size: 120,
      minSize: 80,
      maxSize: 150,
    }),
    otherCasesColumnHelper.accessor(row => row.observed_phenotypes, {
      id: 'observed_phenotypes',
      cell: info => {
        const items = (info.getValue() as Term[]).sort((a, b) => {
          const nameA = a.name || '';
          const nameB = b.name || '';
          return nameA.localeCompare(nameB);
        });

        return (
          <DialogListCell
            header={t('variant_entity.cases.other_table.headers.phenotypes_hpo')}
            items={items}
            renderItem={item => <PhenotypeConditionLink name={item.name} code={item.id} />}
            visibleCount={1}
          />
        );
      },
      header: t('variant_entity.cases.other_table.headers.phenotypes_hpo'),
      minSize: 140,
      maxSize: 350,
      enableSorting: false,
    }),
    otherCasesColumnHelper.accessor(row => row.zygosity, {
      id: 'zygosity',
      cell: info => <BadgeCell variant="outline">{info.getValue()}</BadgeCell>,
      header: t('variant_entity.cases.other_table.headers.zygosity'),
      size: 120,
      minSize: 80,
      maxSize: 150,
      enableSorting: false,
    }),
    otherCasesColumnHelper.accessor(row => row.performer_lab_code, {
      id: 'performer_lab_code',
      cell: info => (
        <TextTooltipCell tooltipText={info.row.original.performer_lab_name}>{info.getValue()}</TextTooltipCell>
      ),
      header: t('variant_entity.cases.other_table.headers.institution'),
      minSize: 100,
      maxSize: 150,
      size: 120,
      enableSorting: false,
    }),
    otherCasesColumnHelper.accessor(row => row.case_analysis_code, {
      id: 'case_analysis_code',
      cell: info => (
        <TextTooltipCell tooltipText={info.row.original.case_analysis_name}>{info.getValue()}</TextTooltipCell>
      ),
      header: t('variant_entity.cases.other_table.headers.test'),
      minSize: 80,
      maxSize: 150,
      size: 120,
      enableSorting: false,
    }),
    otherCasesColumnHelper.accessor(row => row.status_code, {
      id: 'status_code',
      cell: info => <AssayStatusCell status={info.getValue()} />,
      header: t('variant_entity.cases.other_table.headers.status'),
      minSize: 100,
      maxSize: 150,
      size: 120,
    }),
  ] as TableColumnDef<VariantUninterpretedCase, any>[]; // todo replace with correct type when api is updated
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
    id: 'performer_lab_code',
    visible: true,
    label: 'variant.headers.institution',
  },
  {
    id: 'case_analysis_code',
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

const otherCasesDefaultSettings = createColumnSettings([
  {
    id: 'case_id',
    visible: true,
    label: 'variant.headers.case_id',
  },
  {
    id: 'seq_id',
    visible: true,
    label: 'variant.headers.seq_id',
  },
  {
    id: 'patient_id',
    visible: true,
    label: 'variant.headers.patient_id',
  },
  {
    id: 'submitter_sample_id',
    visible: true,
    label: 'variant.headers.sample',
  },
  {
    id: 'affected_status',
    visible: true,
    label: 'variant.headers.affected_status',
  },
  {
    id: 'observed_phenotypes',
    visible: true,
    label: 'variant.headers.hpo',
  },
  {
    id: 'zygosity',
    visible: true,
    label: 'variant.headers.zygosity',
  },
  {
    id: 'performer_lab_code',
    visible: true,
    label: 'variant.headers.institution',
  },
  {
    id: 'case_analysis_code',
    visible: true,
    label: 'variant.headers.test',
  },
  {
    id: 'created_on',
    visible: true,
    label: 'variant.headers.date',
  },
  {
    id: 'status_code',
    visible: true,
    label: 'variant.headers.status',
  },
]);

export { getInterpretedCasesColumns, getOtherCasesColumns, interpretedCasesDefaultSettings, otherCasesDefaultSettings };
