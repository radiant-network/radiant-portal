import { createColumnHelper } from '@tanstack/react-table';
import { TFunction } from 'i18next';

import { Term, VariantUninterpretedCase } from '@/api/api';
import TransmissionModeBadge from '@/components/base/badges/transmission-mode-badge';
import AffectedStatusCell from '@/components/base/data-table/cells/affected-status-cell';
import BadgeCell from '@/components/base/data-table/cells/badge-cell';
import DateCell from '@/components/base/data-table/cells/date-cell';
import DialogListCell from '@/components/base/data-table/cells/dialog-list-cell';
import EmptyCell from '@/components/base/data-table/cells/empty-cell';
import NumberCell from '@/components/base/data-table/cells/number-cell';
import PhenotypeConditionLinkCell from '@/components/base/data-table/cells/phenotype-condition-link-cell';
import RelationshipToProbandCell from '@/components/base/data-table/cells/relationship-to-proband-cell';
import TextCell from '@/components/base/data-table/cells/text-cell';
import TextTooltipCell from '@/components/base/data-table/cells/text-tooltip-cell';
import { createColumnSettings, TableColumnDef } from '@/components/base/data-table/data-table';
import TooltipHeader from '@/components/base/data-table/headers/table-tooltip-header';
import PhenotypeConditionLink from '@/components/base/navigation/phenotypes/phenotype-condition-link';
import { Badge } from '@/components/base/shadcn/badge';

import UninterpretedCasePreviewCell from './cells/uninterpreted-case-preview-cell';

const columnHelper = createColumnHelper<VariantUninterpretedCase>();

function getUninterpretedCasesColumns(t: TFunction<string, undefined>) {
  return [
    // Case and Sequencing
    columnHelper.accessor(row => row.case_id, {
      id: 'case_id',
      cell: info => (
        <UninterpretedCasePreviewCell
          caseId={info.row.original.case_id}
          patientId={info.row.original.patient_id}
          seqId={info.row.original.seq_id}
        />
      ),
      header: () => (
        <TooltipHeader tooltip={t('variant_entity.cases.other_table.headers.case_tooltip')}>
          {t('variant_entity.cases.other_table.headers.case')}
        </TooltipHeader>
      ),
      minSize: 80,
      maxSize: 150,
      size: 120,
      enableSorting: true,
    }),
    // Relationship
    columnHelper.accessor(row => row.relationship_to_proband, {
      id: 'relationship_to_proband',
      cell: info => <RelationshipToProbandCell relationship={info.getValue()} />,
      header: t('variant_entity.cases.other_table.headers.relationship_to_proband'),
      minSize: 80,
      maxSize: 150,
      size: 120,
      enableSorting: true,
    }),
    // Affected status
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
    // Phenotypes HPO
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
    // Filter
    columnHelper.accessor(row => row.filter_is_pass, {
      id: 'filter_is_pass',
      cell: info => (
        <BadgeCell variant={info.getValue() ? 'green' : 'red'}>
          {info.getValue()
            ? t('variant_entity.cases.other_table.headers.filter_pass')
            : t('variant_entity.cases.other_table.headers.filter_fail')}
        </BadgeCell>
      ),
      header: t('variant_entity.cases.other_table.headers.filter_is_pass'),
      size: 60,
      minSize: 50,
      maxSize: 100,
      enableSorting: false,
    }),
    // Zygosity
    columnHelper.accessor(row => row.zygosity, {
      id: 'zygosity',
      cell: info => <BadgeCell variant="outline">{info.getValue()}</BadgeCell>,
      header: t('variant_entity.cases.other_table.headers.zygosity'),
      size: 120,
      minSize: 80,
      maxSize: 150,
      enableSorting: false,
    }),
    // Transmission
    columnHelper.accessor(row => row.transmission_mode, {
      id: 'transmission_mode',
      cell: info => (info.getValue() ? <TransmissionModeBadge value={info.getValue()} /> : <EmptyCell />),
      header: t('variant_entity.cases.other_table.headers.transmission_mode'),
      size: 120,
      minSize: 80,
      maxSize: 150,
      enableSorting: false,
    }),
    // Diag. Lab
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
    // Sample
    columnHelper.accessor(row => row.submitter_sample_id, {
      id: 'submitter_sample_id',
      cell: info => <TextCell>{info.getValue()}</TextCell>,
      header: t('variant_entity.cases.other_table.headers.sample'),
      minSize: 80,
      maxSize: 150,
      size: 120,
      enableSorting: false,
    }),
    // Date
    columnHelper.accessor(row => row.updated_on, {
      id: 'updated_on',
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
    // Primary condition
    columnHelper.accessor(row => row.primary_condition_id, {
      id: 'primary_condition_id',
      cell: info => (
        <PhenotypeConditionLinkCell code={info.getValue()} name={info.row.original.primary_condition_name} />
      ),
      header: t('variant_entity.cases.other_table.headers.primary_condition'),
      minSize: 80,
      maxSize: 150,
      size: 120,
      enableSorting: false,
    }),
    // Analysis
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
    // QD
    columnHelper.accessor(row => row.info_qd, {
      id: 'info_qd',
      cell: info => <NumberCell value={info.getValue()} fractionDigits={2} />,
      header: () => (
        <TooltipHeader tooltip={t('variant_entity.cases.other_table.headers.qd_tooltip')}>
          {t('variant_entity.cases.other_table.headers.qd')}
        </TooltipHeader>
      ),
      size: 80,
      minSize: 50,
      maxSize: 100,
      enableSorting: false,
    }),
    // GQ
    columnHelper.accessor(row => row.genotype_quality, {
      id: 'genotype_quality',
      cell: info => <NumberCell value={info.getValue()} fractionDigits={2} />,
      header: () => (
        <TooltipHeader tooltip={t('variant_entity.cases.other_table.headers.gq_tooltip')}>
          {t('variant_entity.cases.other_table.headers.gq')}
        </TooltipHeader>
      ),
      size: 80,
      minSize: 50,
      maxSize: 100,
      enableSorting: false,
    }),
    // ALT
    columnHelper.accessor(row => row.ad_alt, {
      id: 'ad_alt',
      cell: info => <NumberCell value={info.getValue()} fractionDigits={0} />,
      header: () => (
        <TooltipHeader tooltip={t('variant_entity.cases.other_table.headers.ad_alt_tooltip')}>
          {t('variant_entity.cases.other_table.headers.ad_alt')}
        </TooltipHeader>
      ),
      size: 80,
      minSize: 50,
      maxSize: 100,
      enableSorting: false,
    }),
    // ALT + REF
    columnHelper.accessor(row => row.ad_total, {
      id: 'ad_total',
      cell: info => <NumberCell value={info.getValue()} fractionDigits={0} />,
      header: () => (
        <TooltipHeader tooltip={t('variant_entity.cases.other_table.headers.ad_total_tooltip')}>
          {t('variant_entity.cases.other_table.headers.ad_total')}
        </TooltipHeader>
      ),
      size: 100,
      minSize: 60,
      maxSize: 120,
      enableSorting: false,
    }),
    // ALT / (ALT + REF)
    columnHelper.accessor(row => row.ad_ratio, {
      id: 'ad_ratio',
      cell: info => <NumberCell value={info.getValue()} fractionDigits={0} />,
      header: () => (
        <TooltipHeader tooltip={t('variant_entity.cases.other_table.headers.ad_ratio_tooltip')}>
          {t('variant_entity.cases.other_table.headers.ad_ratio')}
        </TooltipHeader>
      ),
      size: 140,
      minSize: 60,
      maxSize: 180,
      enableSorting: false,
    }),
    // Patient
    columnHelper.accessor(row => row.patient_id, {
      id: 'patient_id',
      cell: info => info.getValue(),
      header: t('variant_entity.cases.other_table.headers.patient_id'),
      minSize: 80,
      maxSize: 150,
      size: 120,
      enableSorting: false,
    }),
    // Sex
    columnHelper.accessor(row => row.sex_name, {
      id: 'sex_name',
      cell: info => (
        <Badge variant="secondary" className="self-start">
          {t(`common.sex.${info.getValue().toLowerCase()}`)}
        </Badge>
      ),
      header: t('variant_entity.cases.other_table.headers.sex'),
      minSize: 80,
      maxSize: 150,
      size: 120,
      enableSorting: false,
    }),
  ] as TableColumnDef<VariantUninterpretedCase, any>[]; // todo replace with correct type when api is updated
}

const uninterpretedCasesDefaultSettings = createColumnSettings([
  {
    id: 'case_id',
    visible: true,
    label: 'variant_entity.cases.other_table.headers.case',
  },
  {
    id: 'relationship_to_proband',
    visible: true,
    label: 'variant_entity.cases.other_table.headers.relationship_to_proband',
  },
  {
    id: 'affected_status',
    visible: true,
    label: 'variant_entity.cases.other_table.headers.affected_status',
  },
  {
    id: 'observed_phenotypes',
    visible: true,
    label: 'variant_entity.cases.other_table.headers.phenotypes_hpo',
  },
  {
    id: 'filter_is_pass',
    visible: true,
    label: 'variant_entity.cases.other_table.headers.filter_is_pass',
  },
  {
    id: 'zygosity',
    visible: true,
    label: 'variant_entity.cases.other_table.headers.zygosity',
  },
  {
    id: 'transmission_mode',
    visible: true,
    label: 'variant_entity.cases.other_table.headers.transmission_mode',
  },
  {
    id: 'diagnosis_lab_code',
    visible: true,
    label: 'variant_entity.cases.other_table.headers.institution',
  },
  {
    id: 'submitter_sample_id',
    visible: true,
    label: 'variant_entity.cases.other_table.headers.sample',
  },
  {
    id: 'updated_on',
    visible: true,
    label: 'variant_entity.cases.other_table.headers.date',
  },
  {
    id: 'primary_condition_id',
    visible: false,
    label: 'variant_entity.cases.other_table.headers.primary_condition',
    additionalFields: ['primary_condition_id', 'primary_condition_name'],
  },
  {
    id: 'analysis_catalog_code',
    visible: false,
    label: 'variant_entity.cases.other_table.headers.test',
    additionalFields: ['analysis_catalog_code', 'analysis_catalog_name'],
  },
  {
    id: 'info_qd',
    visible: false,
    label: 'variant_entity.cases.other_table.headers.qd',
    additionalFields: ['info_qd'],
  },
  {
    id: 'genotype_quality',
    visible: false,
    label: 'variant_entity.cases.other_table.headers.gq',
    additionalFields: ['genotype_quality'],
  },
  {
    id: 'ad_alt',
    visible: false,
    label: 'variant_entity.cases.other_table.headers.ad_alt',
    additionalFields: ['ad_alt'],
  },
  {
    id: 'ad_total',
    visible: false,
    label: 'variant_entity.cases.other_table.headers.ad_total',
    additionalFields: ['ad_total'],
  },
  {
    id: 'ad_ratio',
    visible: false,
    label: 'variant_entity.cases.other_table.headers.ad_ratio',
    additionalFields: ['ad_ratio'],
  },
  {
    id: 'patient_id',
    visible: false,
    label: 'variant_entity.cases.other_table.headers.patient_id',
  },
  {
    id: 'sex_name',
    visible: false,
    label: 'variant_entity.cases.other_table.headers.sex',
    additionalFields: ['sex_name'],
  },
]);

export { getUninterpretedCasesColumns, uninterpretedCasesDefaultSettings };
