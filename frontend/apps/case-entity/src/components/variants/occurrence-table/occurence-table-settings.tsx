import { createColumnHelper } from '@tanstack/react-table';
import { TFunction } from 'i18next';
import { ZapIcon } from 'lucide-react';

import { GermlineSNVOccurrence } from '@/api/api';
import AnchorLinkCell from '@/components/base/data-table/cells/anchor-link-cell';
import ClassificationCell from '@/components/base/data-table/cells/classification-cell';
import GeneCell from '@/components/base/data-table/cells/gene-cell';
import GnomadCell from '@/components/base/data-table/cells/gnomad-cell';
import ManeCell from '@/components/base/data-table/cells/mane-cell';
import MostDeleteriousConsequenceCell from '@/components/base/data-table/cells/most-deleterious-consequence-cell';
import NumberCell from '@/components/base/data-table/cells/number-cell';
import OmimCell from '@/components/base/data-table/cells/omim-cell';
import ParticipantFrequencyCell from '@/components/base/data-table/cells/participant-frequency-cell';
import RowExpandCell from '@/components/base/data-table/cells/row-expand-cell';
import TextTooltipCell from '@/components/base/data-table/cells/text-tooltip-cell';
import ZygosityCell from '@/components/base/data-table/cells/zygosity-cell';
import { createColumnSettings, TableColumnDef } from '@/components/base/data-table/data-table';
import TooltipHeader from '@/components/base/data-table/headers/table-tooltip-header';

import InterpretationCell from './cells/interpretation-cell';

const columnHelper = createColumnHelper<GermlineSNVOccurrence>();

function getVariantColumns(t: TFunction<string, undefined>) {
  return [
    {
      id: 'row_expand',
      cell: RowExpandCell,
      size: 40,
      enableResizing: false,
      enablePinning: false,
    },
    // TODO: To be enabled when row selection function are implemented
    // {
    //   id: 'row_selection',
    //   header: (header: HeaderContext<any, Occurrence>) => <RowSelectionHeader table={header.table} />,
    //   cell: info => <RowSelectionCell row={info.row} />,
    //   size: 40,
    //   enablePinning: false,
    //   enableResizing: false,
    // },
    // lightning icon
    columnHelper.accessor(row => row, {
      id: 'clinical_interpretation',
      cell: info => <InterpretationCell occurrence={info.getValue()} />,
      header: () => (
        <div className="flex justify-center">
          <TooltipHeader tooltip={t('variant.headers.clinical_interpretation')} iconOnly>
            <ZapIcon size={16} />
          </TooltipHeader>
        </div>
      ),
      size: 40,
      enablePinning: false,
      enableResizing: false,
      enableSorting: false,
    }),
    // Variant
    columnHelper.accessor(row => row.hgvsg, {
      id: 'hgvsg',
      cell: info => (
        <AnchorLinkCell
          href={`/variants/entity/${info.row.original.locus_id}`}
          className="overflow-hidden text-ellipsis block"
          target="_blank"
          tooltip={info.getValue()}
        >
          {info.getValue()}
        </AnchorLinkCell>
      ),
      header: t('variant.headers.hgvsg'),
      size: 148,
      minSize: 40,
    }),
    // Gene
    columnHelper.accessor(row => row.symbol, {
      id: 'symbol',
      cell: info => <GeneCell symbol={info.getValue()} />,
      header: t('variant.headers.symbol'),
      size: 124,
      minSize: 40,
      enableSorting: false,
    }),
    // AA Change
    columnHelper.accessor(row => row.aa_change, {
      id: 'aa_change',
      header: () => (
        <TooltipHeader tooltip={t('variant.headers.aa_change_tooltip')}>{t('variant.headers.aa_change')}</TooltipHeader>
      ),
      size: 124,
      minSize: 40,
      enableSorting: false,
    }),
    // Type
    columnHelper.accessor(row => row.variant_class, {
      id: 'variant_class',
      cell: info => (
        <TextTooltipCell tooltipText={info.getValue()}>
          {t(`variant.classes.${info.getValue().toLowerCase()}`)}
        </TextTooltipCell>
      ),
      header: t('variant.headers.variant_class'),
      size: 96,
      minSize: 40,
    }),
    // Consequence
    columnHelper.accessor(row => row, {
      id: 'picked_consequences',
      cell: info => (
        <MostDeleteriousConsequenceCell
          vepImpact={info.getValue().vep_impact}
          consequences={info.getValue().picked_consequences}
        />
      ),
      header: () => (
        <TooltipHeader tooltip={t('variant.headers.picked_consequences_tooltip')}>
          {t('variant.headers.picked_consequences')}
        </TooltipHeader>
      ),
      size: 225,
      enableSorting: false,
      minSize: 40,
    }),
    // Mane
    columnHelper.accessor(row => row, {
      id: 'is_mane_select',
      cell: info => (
        <ManeCell
          isManePlus={info.getValue().is_mane_plus}
          isManeSelect={info.getValue().is_mane_select}
          isCanonical={info.getValue().is_canonical}
        />
      ),
      header: t('variant.headers.is_mane_select'),
      enableSorting: false,
      size: 124,
      minSize: 40,
    }),
    // dbSNP
    columnHelper.accessor(row => row.rsnumber, {
      id: 'dbSNP',
      cell: info => (
        <AnchorLinkCell
          href={info.getValue() ? `https://www.ncbi.nlm.nih.gov/snp/${info.getValue()}` : undefined}
          target="_blank"
          external
        >
          {info.getValue()}
        </AnchorLinkCell>
      ),
      header: t('variant.headers.dbSNP'),
      size: 96,
      minSize: 40,
      enableSorting: false,
    }),
    // omim
    columnHelper.accessor(row => row.omim_inheritance_code, {
      id: 'omim_inheritance_code',
      cell: info => <OmimCell codes={info.getValue()} />,
      header: () => (
        <TooltipHeader tooltip={t('variant.headers.omim_inheritance_code_tooltip')}>
          {t('variant.headers.omim_inheritance_code')}
        </TooltipHeader>
      ),
      size: 124,
      minSize: 40,
      enableSorting: false,
    }),
    // ClinVar
    columnHelper.accessor(row => row.clinvar, {
      id: 'clinvar',
      cell: info => <ClassificationCell codes={info.getValue()} />,
      header: t('variant.headers.clinvar'),
      size: 124,
      minSize: 40,
      enableSorting: false,
    }),
    //Exo.
    columnHelper.accessor(row => row.exomiser_gene_combined_score, {
      id: 'exomiser_gene_combined_score',
      cell: info => <NumberCell value={info.getValue()} fractionDigits={3} />,
      header: () => (
        <TooltipHeader tooltip={t('variant.headers.exomiser_gene_combined_score_tooltip')}>
          {t('variant.headers.exomiser_gene_combined_score')}
        </TooltipHeader>
      ),
      size: 96,
      minSize: 40,
    }),
    //ACMG. Exo.
    columnHelper.accessor(row => row.exomiser_acmg_classification, {
      id: 'exomiser_acmg_classification',
      cell: info => <ClassificationCell codes={[info.getValue()]} />,
      header: () => (
        <TooltipHeader tooltip={t('variant.headers.exomiser_acmg_classification_tooltip')}>
          {t('variant.headers.exomiser_acmg_classification')}
        </TooltipHeader>
      ),
      size: 96,
      minSize: 40,
    }),
    // gnomAD
    columnHelper.accessor(row => row.gnomad_v3_af, {
      id: 'gnomad_v3_af',
      cell: info => <GnomadCell value={info.getValue()} />,
      header: () => (
        <TooltipHeader tooltip={t('variant.headers.gnomad_v3_af_tooltip')}>
          {t('variant.headers.gnomad_v3_af')}
        </TooltipHeader>
      ),
      size: 124,
      minSize: 40,
    }),
    // Freq.
    columnHelper.accessor(row => row.pf_wgs, {
      id: 'pf_wgs',
      cell: info => <ParticipantFrequencyCell locusId={info.row.original.locus_id} value={info.getValue()} />,
      header: () => (
        <TooltipHeader tooltip={t('variant.headers.pf_wgs_tooltip')}>{t('variant.headers.pf_wgs')}</TooltipHeader>
      ),
      size: 124,
      minSize: 40,
    }),
    // GQ.
    columnHelper.accessor(row => row.genotype_quality, {
      id: 'genotype_quality',
      cell: info => <NumberCell value={info.getValue()} />,
      header: () => (
        <TooltipHeader tooltip={t('variant.headers.genotype_quality_tooltip')}>
          {t('variant.headers.genotype_quality')}
        </TooltipHeader>
      ),
      size: 124,
      minSize: 40,
    }),
    // Zyg.
    columnHelper.accessor(row => row.zygosity, {
      id: 'zygosity',
      cell: info => <ZygosityCell value={info.getValue()} />,
      header: () => (
        <TooltipHeader tooltip={t('variant.headers.zygosity_tooltip')}>{t('variant.headers.zygosity')}</TooltipHeader>
      ),
      size: 124,
      minSize: 40,
      enableSorting: false,
    }),
    columnHelper.accessor(row => row.ad_ratio, {
      id: 'ad_ratio',
      cell: info => <NumberCell value={info.getValue()} />,
      header: t('variant.headers.ad_ratio'),
      size: 124,
      minSize: 40,
    }),
  ] as TableColumnDef<GermlineSNVOccurrence, any>[];
}

const defaultSettings = createColumnSettings([
  {
    id: 'row_expand',
    visible: true,
    fixed: true,
    pinningPosition: 'left',
  },
  // TODO: To be enabled when row selection function are implemented
  // {
  //   id: 'row_selection',
  //   visible: true,
  //   fixed: true,
  //   pinningPosition: 'left',
  // },
  {
    id: 'clinical_interpretation',
    visible: true,
    fixed: true,
    pinningPosition: 'left',
    label: 'variant.headers.clinical_interpretation',
  },
  {
    id: 'hgvsg',
    visible: true,
    pinningPosition: 'left',
    label: 'variant.headers.hgvsg',
  },
  {
    id: 'symbol',
    visible: true,
    label: 'variant.headers.symbol',
  },
  {
    id: 'aa_change',
    visible: true,
    label: 'variant.headers.aa_change',
  },
  {
    id: 'variant_class',
    visible: true,
    label: 'variant.headers.variant_class',
  },
  {
    id: 'picked_consequences',
    visible: true,
    label: 'variant.headers.picked_consequences',
  },
  {
    id: 'is_mane_select',
    visible: true,
    label: 'variant.headers.is_mane_select',
  },
  {
    id: 'dbSNP',
    visible: true,
    label: 'variant.headers.dbSNP',
  },
  {
    id: 'omim_inheritance_code',
    visible: true,
    label: 'variant.headers.omim_inheritance_code',
  },
  {
    id: 'clinvar',
    visible: true,
    label: 'variant.headers.clinvar',
  },
  {
    id: 'exomiser_gene_combined_score',
    visible: true,
    label: 'variant.headers.exomiser_gene_combined_score',
  },
  {
    id: 'exomiser_acmg_classification',
    visible: true,
    label: 'variant.headers.exomiser_acmg_classification',
  },
  {
    id: 'gnomad_v3_af',
    visible: true,
    label: 'variant.headers.gnomad_v3_af',
  },
  {
    id: 'pf_wgs',
    visible: true,
    label: 'variant.headers.pf_wgs',
  },
  {
    id: 'genotype_quality',
    visible: true,
    label: 'variant.headers.genotype_quality',
  },
  {
    id: 'zygosity',
    visible: true,
    label: 'variant.headers.zygosity',
  },
  {
    id: 'ad_ratio',
    visible: true,
    label: 'variant.headers.ad_ratio',
  },
]);

export { getVariantColumns, defaultSettings };
