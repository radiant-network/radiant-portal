import { createColumnHelper } from '@tanstack/react-table';
import { TableColumnDef, createColumnSettings } from '@/components/base/data-table/data-table';
import RowExpandCell from '@/components/base/data-table/cells/row-expand-cell';
import DateCell from '@/components/base/data-table/cells/date-cell';
import TooltipsHeader from '@/components/base/data-table/headers/table-tooltips-header';
import { TFunction } from 'i18next';
import { Badge } from '@/components/base/ui/badge';
import { EllipsisVertical } from 'lucide-react';
import { Button } from '@/components/base/ui/button';
import { Term, VariantInterpretedCase, VariantUninterpretedCase } from '@/api/api';
import ConditionTableCell from './condition-table-cell';
import PerformerLabTableCell from './performer-lab-table-cell';
import ClinVarBadge from '@/components/feature/variant/clinvar-badge';
import StatusCodeTableCell from './status-code-table-cell';
import AnalysisTableCell from './analysis-table-cell';
import AnchorLink from '@/components/base/navigation/anchor-link';
import AffectedStatusCell from './affected-status-table-cell';
import RelationCell from './relation-table-cell';
import ExpandableList from '@/components/base/list/expandable-list';
import EmptyCell from '@/components/base/data-table/cells/empty-cell';

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
        <AnchorLink href={`/case/entity/${info.getValue()}`} className="text-foreground text-xs font-mono">
          {info.getValue()}
        </AnchorLink>
      ),
      header: t('variantEntity.cases.interpreted-table.headers.case'),
      size: 120,
      minSize: 80,
      maxSize: 150,
      enableSorting: false,
    }),
    interpretedCasesColumnHelper.accessor(row => row.interpretation_updated_on, {
      id: 'interpretation_updated_on',
      cell: info => <DateCell date={info.getValue()} />,
      header: () => (
        <TooltipsHeader tooltips={t('variantEntity.cases.interpreted-table.headers.date.tooltip')}>
          {t('variantEntity.cases.interpreted-table.headers.date')}
        </TooltipsHeader>
      ),
      size: 120,
      minSize: 80,
      maxSize: 150,
    }),
    interpretedCasesColumnHelper.accessor(row => row.patient_id, {
      id: 'patient_id',
      cell: info => <div>{info.getValue()}</div>,
      header: t('variantEntity.cases.commonHeaders.patient_id'),
      minSize: 80,
      maxSize: 150,
      size: 120,
      enableSorting: false,
    }),
    interpretedCasesColumnHelper.accessor(row => row.relationship_to_proband, {
      id: 'relationship_to_proband',
      cell: info => <RelationCell relationshipToProband={info.getValue()} />,
      header: t('variantEntity.cases.commonHeaders.relationship_to_proband'),
      minSize: 80,
      maxSize: 150,
      size: 120,
      enableSorting: false,
    }),
    interpretedCasesColumnHelper.accessor(row => row.condition_name, {
      id: 'condition_name',
      cell: info => <ConditionTableCell conditionId={info.row.original.condition_id} conditionName={info.getValue()} />,
      header: t('variantEntity.cases.interpreted-table.headers.mondo'),
      minSize: 120,
      maxSize: 350,
      enableSorting: false,
    }),
    interpretedCasesColumnHelper.accessor(row => row.classification, {
      id: 'classification',
      cell: info => <ClinVarBadge value={info.getValue()} />,
      header: t('variantEntity.cases.interpreted-table.headers.classification'),
      minSize: 150,
      maxSize: 250,
    }),
    interpretedCasesColumnHelper.accessor(row => row.zygosity, {
      id: 'zygosity',
      cell: info => <Badge variant="outline">{info.getValue()}</Badge>,
      header: t('variantEntity.cases.interpreted-table.headers.zygosity'),
      size: 120,
      minSize: 80,
      maxSize: 150,
      enableSorting: false,
    }),
    interpretedCasesColumnHelper.accessor(row => row.transcript_id, {
      id: 'inheritance',
      cell: info => <div className="text-muted-foreground">{'-'}</div>,
      header: t('variantEntity.cases.interpreted-table.headers.inheritance'),
      size: 130,
      minSize: 130,
      maxSize: 250,
      enableSorting: false,
    }),
    interpretedCasesColumnHelper.accessor(row => row.performer_lab_code, {
      id: 'performer_lab_code',
      cell: info => (
        <PerformerLabTableCell
          performerLabCode={info.getValue()}
          performerLabName={info.row.original.performer_lab_name}
        />
      ),
      header: t('variantEntity.cases.interpreted-table.headers.institution'),
      minSize: 100,
      maxSize: 150,
      size: 120,
      enableSorting: false,
    }),
    interpretedCasesColumnHelper.accessor(row => row.case_analysis_code, {
      id: 'case_analysis_code',
      cell: info => (
        <AnalysisTableCell analysisCode={info.getValue()} analysisName={info.row.original.case_analysis_name} />
      ),
      header: t('variantEntity.cases.interpreted-table.headers.test'),
      minSize: 80,
      maxSize: 150,
      size: 120,
      enableSorting: false,
    }),
    interpretedCasesColumnHelper.accessor(row => row.status_code, {
      id: 'status_code',
      cell: info => <StatusCodeTableCell statusCode={info.getValue()} />,
      header: t('variantEntity.cases.interpreted-table.headers.status'),
      minSize: 100,
      maxSize: 150,
      size: 120,
    }),
    interpretedCasesColumnHelper.accessor(row => row, {
      id: 'action',
      cell: info => {
        return (
          <Button iconOnly variant="outline" className="size-6">
            <EllipsisVertical />
          </Button>
        );
      },
      header: '',
      size: 50,
      enableSorting: false,
      enablePinning: false,
      enableResizing: false,
    }),
  ] as TableColumnDef<VariantInterpretedCase, any>[]; // todo replace with correct type when api is updated
}

function getOtherCasesColumns(t: TFunction<string, undefined>) {
  return [
    otherCasesColumnHelper.accessor(row => row.case_id, {
      id: 'case_id',
      cell: info => (
        <AnchorLink href={`/case/entity/${info.getValue()}`} className="text-foreground text-xs font-mono">
          {info.getValue()}
        </AnchorLink>
      ),
      header: t('variantEntity.cases.other-table.headers.case'),
      minSize: 80,
      maxSize: 150,
      size: 120,
      enableSorting: false,
    }),
    otherCasesColumnHelper.accessor(row => row.seq_id, {
      id: 'seq_id',
      cell: info => <span>{info.getValue()}</span>,
      header: t('variantEntity.cases.other-table.headers.seq_id'),
      minSize: 80,
      maxSize: 150,
      size: 120,
      enableSorting: false,
    }),
    otherCasesColumnHelper.accessor(row => row.patient_id, {
      id: 'patient_id',
      cell: info => <span>{info.getValue()}</span>,
      header: t('variantEntity.cases.commonHeaders.patient_id'),
      minSize: 80,
      maxSize: 150,
      size: 120,
      enableSorting: false,
    }),
    otherCasesColumnHelper.accessor(row => row.relationship_to_proband, {
      id: 'relationship_to_proband',
      cell: info => <RelationCell relationshipToProband={info.getValue()} />,
      header: t('variantEntity.cases.commonHeaders.relationship_to_proband'),
      minSize: 80,
      maxSize: 150,
      size: 120,
      enableSorting: false,
    }),
    otherCasesColumnHelper.accessor(row => row.affected_status, {
      id: 'affected_status',
      cell: info => <AffectedStatusCell affectedStatus={info.getValue()} />,
      header: t('variantEntity.cases.other-table.headers.affected_status'),
      minSize: 80,
      maxSize: 150,
      size: 120,
      enableSorting: false,
    }),
    otherCasesColumnHelper.accessor(row => row.submitter_sample_id, {
      id: 'submitter_sample_id',
      cell: info => <span>{info.getValue()}</span>,
      header: t('variantEntity.cases.other-table.headers.submitter_sample_id'),
      minSize: 80,
      maxSize: 150,
      size: 120,
      enableSorting: false,
    }),
    otherCasesColumnHelper.accessor(row => row.created_on, {
      id: 'created_on',
      cell: info => <DateCell date={info.getValue()} />,
      header: () => (
        <TooltipsHeader tooltips={t('variantEntity.cases.other-table.headers.date.tooltip')}>
          {t('variantEntity.cases.other-table.headers.date')}
        </TooltipsHeader>
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

        if (items.length === 0) {
          return <EmptyCell />;
        }

        return (
          <ExpandableList
            items={items}
            renderItem={item => <div className="font-medium">{item.name}</div>}
            visibleCount={1}
          />
        );
      },
      header: t('variantEntity.cases.other-table.headers.phenotypesHpo'),
      minSize: 120,
      maxSize: 350,
      enableSorting: false,
    }),
    otherCasesColumnHelper.accessor(row => row.zygosity, {
      id: 'zygosity',
      cell: info => <Badge variant="outline">{info.getValue()}</Badge>,
      header: t('variantEntity.cases.other-table.headers.zygosity'),
      size: 120,
      minSize: 80,
      maxSize: 150,
      enableSorting: false,
    }),
    otherCasesColumnHelper.accessor(row => row, {
      id: 'inheritance',
      cell: info => <EmptyCell />,
      header: t('variantEntity.cases.other-table.headers.inheritance'),
      size: 130,
      minSize: 130,
      maxSize: 250,
      enableSorting: false,
    }),
    otherCasesColumnHelper.accessor(row => row.performer_lab_code, {
      id: 'performer_lab_code',
      cell: info => (
        <PerformerLabTableCell
          performerLabCode={info.getValue()}
          performerLabName={info.row.original.performer_lab_name}
        />
      ),
      header: t('variantEntity.cases.other-table.headers.institution'),
      minSize: 100,
      maxSize: 150,
      size: 120,
      enableSorting: false,
    }),
    otherCasesColumnHelper.accessor(row => row.case_analysis_code, {
      id: 'case_analysis_code',
      cell: info => (
        <AnalysisTableCell analysisCode={info.getValue()} analysisName={info.row.original.case_analysis_name} />
      ),
      header: t('variantEntity.cases.other-table.headers.test'),
      minSize: 80,
      maxSize: 150,
      size: 120,
      enableSorting: false,
    }),
    otherCasesColumnHelper.accessor(row => row.status_code, {
      id: 'status_code',
      cell: info => <StatusCodeTableCell statusCode={info.getValue()} />,
      header: t('variantEntity.cases.other-table.headers.status'),
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
    id: 'relationship_to_proband',
    visible: true,
    label: 'variant.headers.relationship_to_proband',
  },
  {
    id: 'affected_status',
    visible: true,
    label: 'variant.headers.affected_status',
  },
  {
    id: 'submitter_sample_id',
    visible: true,
    label: 'variant.headers.submitter_sample_id',
  },
  {
    id: 'created_on',
    visible: true,
    label: 'variant.headers.date',
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
]);

export { getInterpretedCasesColumns, getOtherCasesColumns, interpretedCasesDefaultSettings, otherCasesDefaultSettings };
