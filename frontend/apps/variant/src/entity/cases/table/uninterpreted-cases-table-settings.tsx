import { createColumnHelper } from '@tanstack/react-table';
import { TFunction } from 'i18next';

import { Term, VariantUninterpretedCase } from '@/api/api';
import AffectedStatusCell from '@/components/base/data-table/cells/affected-status-cell';
import BadgeCell from '@/components/base/data-table/cells/badge-cell';
import DateCell from '@/components/base/data-table/cells/date-cell';
import DialogListCell from '@/components/base/data-table/cells/dialog-list-cell';
import StatusCell from '@/components/base/data-table/cells/status-cell';
import TextCell from '@/components/base/data-table/cells/text-cell';
import TextTooltipCell from '@/components/base/data-table/cells/text-tooltip-cell';
import { createColumnSettings, TableColumnDef } from '@/components/base/data-table/data-table';
import TooltipHeader from '@/components/base/data-table/headers/table-tooltip-header';
import PhenotypeConditionLink from '@/components/base/navigation/phenotypes/phenotype-condition-link';

import UninterpretedCasePreviewCell from './cells/uninterpreted-case-preview-cell';

const columnHelper = createColumnHelper<VariantUninterpretedCase>();

function getUninterpretedCasesColumns(t: TFunction<string, undefined>) {
  return [
    columnHelper.accessor(row => row.case_id, {
      id: 'case_id',
      cell: info => (
        <UninterpretedCasePreviewCell
          caseId={info.row.original.case_id}
          patientId={info.row.original.patient_id}
          relationshipToProband={info.row.original.relationship_to_proband}
        />
      ),
      header: t('variant_entity.cases.other_table.headers.case'),
      minSize: 80,
      maxSize: 150,
      size: 120,
      enableSorting: false,
    }),
    columnHelper.accessor(row => row.seq_id, {
      id: 'seq_id',
      cell: info => info.getValue(),
      header: t('variant_entity.cases.other_table.headers.seq_id'),
      minSize: 80,
      maxSize: 150,
      size: 120,
      enableSorting: false,
    }),
    columnHelper.accessor(row => row.patient_id, {
      id: 'patient_id',
      cell: info => info.getValue(),
      header: t('variant_entity.cases.other_table.headers.patient_id'),
      minSize: 80,
      maxSize: 150,
      size: 120,
      enableSorting: false,
    }),
    columnHelper.accessor(row => row.submitter_sample_id, {
      id: 'submitter_sample_id',
      cell: info => <TextCell>{info.getValue()}</TextCell>,
      header: t('variant_entity.cases.other_table.headers.sample'),
      minSize: 80,
      maxSize: 150,
      size: 120,
      enableSorting: false,
    }),
    columnHelper.accessor(row => row.affected_status, {
      id: 'affected_status',
      cell: info => <AffectedStatusCell status={info.getValue()} />,
      header: () => (
        <TooltipHeader tooltip={t('variant_entity.cases.other_table.headers.affected_status_tooltip')}>
          {t('variant_entity.cases.other_table.headers.affected_status')}
        </TooltipHeader>
      ),
      minSize: 80,
      maxSize: 150,
      size: 120,
      enableSorting: false,
    }),
    columnHelper.accessor(row => row.created_on, {
      id: 'created_on',
      cell: info => <DateCell date={info.getValue()} />,
      header: () => (
        <TooltipHeader tooltip={t('variant_entity.cases.other_table.headers.date_tooltip')}>
          {t('variant_entity.cases.other_table.headers.date')}
        </TooltipHeader>
      ),
      size: 120,
      minSize: 80,
      maxSize: 150,
    }),
    columnHelper.accessor(row => row.observed_phenotypes, {
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
    columnHelper.accessor(row => row.zygosity, {
      id: 'zygosity',
      cell: info => <BadgeCell variant="outline">{info.getValue()}</BadgeCell>,
      header: t('variant_entity.cases.other_table.headers.zygosity'),
      size: 120,
      minSize: 80,
      maxSize: 150,
      enableSorting: false,
    }),
    columnHelper.accessor(row => row.diagnosis_lab_code, {
      id: 'diagnosis_lab_code',
      cell: info => (
        <TextTooltipCell tooltipText={info.row.original.diagnosis_lab_name}>{info.getValue()}</TextTooltipCell>
      ),
      header: () => (
        <TooltipHeader tooltip={t('variant_entity.cases.other_table.headers.institution_tooltip')}>
          {t('variant_entity.cases.other_table.headers.institution')}
        </TooltipHeader>
      ),
      minSize: 100,
      maxSize: 150,
      size: 120,
      enableSorting: false,
    }),
    columnHelper.accessor(row => row.analysis_catalog_code, {
      id: 'analysis_catalog_code',
      cell: info => (
        <TextTooltipCell tooltipText={info.row.original.analysis_catalog_name}>{info.getValue()}</TextTooltipCell>
      ),
      header: t('variant_entity.cases.other_table.headers.test'),
      minSize: 80,
      maxSize: 150,
      size: 120,
      enableSorting: false,
    }),
    columnHelper.accessor(row => row.status_code, {
      id: 'status_code',
      cell: info => <StatusCell status={info.getValue()} />,
      header: t('variant_entity.cases.other_table.headers.status'),
      minSize: 100,
      maxSize: 150,
      size: 120,
    }),
  ] as TableColumnDef<VariantUninterpretedCase, any>[]; // todo replace with correct type when api is updated
}

const uninterpretedCasesDefaultSettings = createColumnSettings([
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
    id: 'created_on',
    visible: true,
    label: 'variant.headers.date',
  },
]);

export { getUninterpretedCasesColumns, uninterpretedCasesDefaultSettings };
