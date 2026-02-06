import { createColumnHelper } from '@tanstack/react-table';
import { TFunction } from 'i18next';

import { ClinvarRCV, GenePanelCondition, GetGermlineVariantConditionsPanelTypeEnum } from '@/api/api';
import BadgeCell from '@/components/base/data-table/cells/badge-cell';
import DateCell from '@/components/base/data-table/cells/date-cell';
import NumberCell from '@/components/base/data-table/cells/number-cell';
import { createColumnSettings, TableColumnDef } from '@/components/base/data-table/data-table';
import TooltipHeader from '@/components/base/data-table/headers/table-tooltip-header';
import { Badge } from '@/components/base/shadcn/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/base/shadcn/tooltip';
import AnchorLinkCell from 'components/base/data-table/cells/anchor-link-cell';
import ClassificationCell from 'components/base/data-table/cells/classification-cell';
import RatingCell from 'components/base/data-table/cells/rating-cell';

const pathogenicEvidenceColumnHelper = createColumnHelper<ClinvarRCV>();
const conditionPhenotypeColumnHelper = createColumnHelper<any>(); // todo replace with correct type when api is updated

function getPathogenicEvidenceColumns(t: TFunction<string, undefined>) {
  return [
    pathogenicEvidenceColumnHelper.accessor(row => row.date_last_evaluated, {
      id: 'date_last_evaluated',
      cell: info => <DateCell date={info.getValue()} />,
      header: () => (
        <TooltipHeader tooltip={t('variant_entity.evidence.clin_var.table.headers.evaluated.tooltip')}>
          {t('variant_entity.evidence.clin_var.table.headers.evaluated')}
        </TooltipHeader>
      ),
      minSize: 60,
      maxSize: 150,
      size: 100,
      enableSorting: false,
    }),
    pathogenicEvidenceColumnHelper.accessor(row => row.traits, {
      id: 'traits',
      cell: info => <div className="font-medium capitalize">{info.getValue()?.[0]}</div>,
      header: t('variant_entity.evidence.clin_var.table.headers.condition'),
      minSize: 85,
      maxSize: 150,
      size: 120,
    }),
    pathogenicEvidenceColumnHelper.accessor(row => row.clinical_significance, {
      id: 'clinical_significance',
      cell: info => <ClassificationCell codes={[info.getValue()?.[0]?.replace(/\s+/g, '_')]} />,
      header: t('variant_entity.evidence.clin_var.table.headers.classification'),
      minSize: 75,
      maxSize: 150,
      size: 120,
    }),
    pathogenicEvidenceColumnHelper.accessor(row => row.submission_count, {
      id: 'submission_count',
      cell: info => <NumberCell value={info.getValue()} fractionDigits={0} />,
      header: () => (
        <TooltipHeader tooltip={t('variant_entity.evidence.clin_var.table.headers.submission_count.tooltip')}>
          {t('variant_entity.evidence.clin_var.table.headers.submission_count')}
        </TooltipHeader>
      ),
      size: 80,
    }),
    pathogenicEvidenceColumnHelper.accessor(row => row.review_status_stars, {
      id: 'review_status_stars',
      cell: info => <RatingCell rating={info.getValue()} tooltip={info.row.original.review_status} />,
      header: () => t('variant_entity.evidence.clin_var.table.headers.status'),
      minSize: 60,
      maxSize: 150,
      size: 120,
    }),
    pathogenicEvidenceColumnHelper.accessor(row => row.origins, {
      id: 'origins',
      cell: info => (
        <BadgeCell variant="outline">{t(`variant_entity.evidence.clin_var.origin.${info.getValue()?.[0]}`)}</BadgeCell>
      ),
      header: t('variant_entity.evidence.clin_var.table.headers.origin'),
      minSize: 60,
      maxSize: 150,
      size: 120,
      enableSorting: false,
    }),
    pathogenicEvidenceColumnHelper.accessor(row => row.accession, {
      id: 'accession',
      cell: info => (
        <div className="flex justify-end items-center">
          <AnchorLinkCell
            variant="primary"
            href={`https://www.ncbi.nlm.nih.gov/clinvar/${info.getValue()}.${info.row.original.version}`}
            size="xs"
            target="_blank"
            rel="noopener noreferrer"
            external
            mono
          >
            {info.getValue()}
          </AnchorLinkCell>
        </div>
      ),
      header: '',
      minSize: 75,
      maxSize: 150,
      size: 120,
      enableSorting: false,
      enablePinning: false,
    }),
  ] as TableColumnDef<ClinvarRCV, any>[]; // todo replace with correct type when api is updated
}

function getConditionPhenotypeColumns(
  t: TFunction<string, undefined>,
  panelType: GetGermlineVariantConditionsPanelTypeEnum,
) {
  return [
    conditionPhenotypeColumnHelper.accessor(row => row.panel_name, {
      id: 'panel_name',
      cell: info => <div className="text-sm font-medium">{info.getValue()}</div>,
      header: t('variant_entity.evidence.gene.table.headers.condition'),
      enableSorting: true,
    }),
    conditionPhenotypeColumnHelper.accessor(row => row.inheritance_code, {
      id: 'inheritance_code',
      cell: info => {
        const codes = info.getValue() || [];

        if (codes.length === 0) {
          return <div className="text-muted-foreground text-xs">{t('common.unspecified')}</div>;
        }

        return codes.map((code: any, index: number) => (
          <Tooltip key={`${code}-${index}`}>
            <TooltipTrigger>
              <Badge key={code} variant="outline">
                {code}
              </Badge>
            </TooltipTrigger>
            <TooltipContent>{t(`variant.omim.${code}`)}</TooltipContent>
          </Tooltip>
        ));
      },
      header: t('variant_entity.evidence.gene.table.headers.inheritance'),
      enableSorting: false,
    }),
    conditionPhenotypeColumnHelper.accessor(row => row.panel_id, {
      id: 'panel_id',
      header: '',
      cell: info => {
        let href: string = '';

        if (panelType === GetGermlineVariantConditionsPanelTypeEnum.Omim) {
          href = `https://omim.org/entry/${info.getValue()}`;
        } else if (panelType === GetGermlineVariantConditionsPanelTypeEnum.Orphanet) {
          href = `https://www.orpha.net/en/disease/detail/${info.getValue()}`;
        } else if (panelType === GetGermlineVariantConditionsPanelTypeEnum.Hpo) {
          href = `https://hpo.jax.org/app/browse/term/${info.getValue()}`;
        }

        return (
          <div className="flex justify-end">
            <AnchorLinkCell href={href} size="xs" target="_blank" rel="noopener noreferrer" external mono>
              {info.getValue()}
            </AnchorLinkCell>
          </div>
        );
      },
      enableSorting: false,
    }),
  ] as TableColumnDef<GenePanelCondition, any>[]; // todo replace with correct type when api is updated
}

const pathogenicEvidenceDefaultSettings = createColumnSettings([
  {
    id: 'date_last_evaluated',
    visible: true,
    label: 'variant.headers.evaluated',
  },
  {
    id: 'traits',
    visible: true,
    label: 'variant.headers.condition',
  },
  {
    id: 'clinical_significance',
    visible: true,
    label: 'variant.headers.classification',
  },
  {
    id: 'submission_count',
    visible: true,
    label: 'variant.headers.submission_count',
  },
  {
    id: 'review_status_stars',
    visible: true,
    label: 'variant.headers.status',
  },
  {
    id: 'origins',
    visible: true,
    label: 'variant.headers.origin',
  },
  {
    id: 'accession',
    visible: true,
    label: 'variant.headers.action',
  },
]);

const conditionPhenotypeDefaultSettings = createColumnSettings([
  {
    id: 'panel_name',
    visible: true,
    label: 'variant.headers.condition',
  },
  {
    id: 'inheritance_code',
    visible: true,
    label: 'variant.headers.inheritance',
  },
  {
    id: 'panel_id',
    visible: true,
    label: 'variant.headers.action',
  },
]);

export {
  getPathogenicEvidenceColumns,
  getConditionPhenotypeColumns,
  pathogenicEvidenceDefaultSettings,
  conditionPhenotypeDefaultSettings,
};
