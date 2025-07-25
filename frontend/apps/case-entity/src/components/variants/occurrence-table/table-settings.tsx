import { createColumnHelper } from '@tanstack/react-table';
import { TableColumnDef, createColumnSettings } from '@/components/base/data-table/data-table';
import RowExpandCell from '@/components/base/data-table/cells/row-expand-cell';
import TooltipsHeader from '@/components/base/data-table/headers/table-tooltips-header';
import AnchorLinkWithTooltipsCell from '@/components/base/data-table/cells/anchor-link-with-tooltips-cell';
import { Occurrence } from '@/api/api';
import { TFunction } from 'i18next';
import { ZapIcon } from 'lucide-react';
import InterpretationCell from './cells/interpretation-cell';
import VariantClassCell from './cells/variant-class-cell';
import GeneCell from './cells/gene-cell';
import MostDeleteriousConsequenceCell from './cells/most-deleterious-consequence-cell';
import ManeCell from './cells/mane-cell';
import OmimCell from './cells/omim-cell';
import ClinvarCell from './cells/clinvar-cell';
import GnomadCell from './cells/gnomad-cell';
import ParticipantFrequencyCell from './cells/participant-frequency-cell';
import NumberCell from './cells/number-cell';
import ZygosityCell from './cells/zygosity-cell';
import ExomiserAcmgCell from './cells/exomiser-acmg-cell';
import DbSNPCell from './cells/dbsnp-cell';

const columnHelper = createColumnHelper<Occurrence>();

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
          <TooltipsHeader tooltips={t('variant.headers.clinical_interpretation')} iconOnly>
            <ZapIcon size={16} />
          </TooltipsHeader>
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
        <AnchorLinkWithTooltipsCell
          href={`/variants/entity/${info.row.original.locus_id}`}
          className="overflow-hidden text-ellipsis block"
          target="_blank"
        >
          {info.getValue()}
        </AnchorLinkWithTooltipsCell>
      ),
      header: t('variant.headers.hgvsg'),
      size: 150,
      minSize: 120,
    }),
    // Type
    columnHelper.accessor(row => row.variant_class, {
      id: 'variant_class',
      cell: info => <VariantClassCell value={info.getValue()} />,
      header: t('variant.headers.variant_class'),
      minSize: 120,
    }),
    // dbSNP
    columnHelper.accessor(row => row.rsnumber, {
      id: 'dbSNP',
      cell: info => <DbSNPCell rsnumber={info.getValue()} />,
      header: t('variant.headers.dbSNP'),
      size: 100,
      minSize: 100,
      enableSorting: false
    }),
    // Gene
    columnHelper.accessor(row => row.symbol, {
      id: 'symbol',
      cell: info => <GeneCell symbol={info.getValue()} />,
      header: t('variant.headers.symbol'),
      minSize: 120,
      enableSorting: false,
    }),
    // Consequence
    columnHelper.accessor(row => row, {
      id: 'picked_consequences',
      cell: info => (
        <MostDeleteriousConsequenceCell
          vepImpact={info.getValue().vep_impact}
          consequences={info.getValue().picked_consequences}
          aaChange={info.getValue().aa_change}
        />
      ),
      header: () => (
        <TooltipsHeader tooltips={t('variant.headers.picked_consequences_tooltips')}>
          {t('variant.headers.picked_consequences')}
        </TooltipsHeader>
      ),
      size: 225,
      enableSorting: false,
      minSize: 160,
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
      minSize: 120,
    }),
    // OMIM
    columnHelper.accessor(row => row.omim_inheritance_code, {
      id: 'omim_inheritance_code',
      cell: info => <OmimCell codes={info.getValue()} />,
      header: () => (
        <TooltipsHeader tooltips={t('variant.headers.omim_inheritance_code_tooltips')}>
          {t('variant.headers.omim_inheritance_code')}
        </TooltipsHeader>
      ),
      minSize: 120,
      enableSorting: false,
    }),
    // ClinVar
    columnHelper.accessor(row => row.clinvar, {
      id: 'clinvar',
      cell: info => <ClinvarCell codes={info.getValue()} />,
      header: t('variant.headers.clinvar'),
      minSize: 120,
      enableSorting: false,
    }),
    //Exo.
    columnHelper.accessor(row => row.exomiser_gene_combined_score, {
      id: 'exomiser_gene_combined_score',
      cell: info => <NumberCell value={info.getValue()} fractionDigits={4} />,
      header: () => (
        <TooltipsHeader tooltips={t('variant.headers.exomiser_gene_combined_score_tooltips')}>
          {t('variant.headers.exomiser_gene_combined_score')}
        </TooltipsHeader>
      ),
      minSize: 100,
    }),
    //ACMG. Exo.
    columnHelper.accessor(row => row.exomiser_acmg_classification, {
      id: 'exomiser_acmg_classification',
      cell: info => <ExomiserAcmgCell code={info.getValue()} />,
      header: () => (
        <TooltipsHeader tooltips={t('variant.headers.exomiser_acmg_classification_tooltips')}>
          {t('variant.headers.exomiser_acmg_classification')}
        </TooltipsHeader>
      ),
      minSize: 100,
    }),
    // gnomAD
    columnHelper.accessor(row => row.gnomad_v3_af, {
      id: 'gnomad_v3_af',
      cell: info => <GnomadCell value={info.getValue()} />,
      header: () => (
        <TooltipsHeader tooltips={t('variant.headers.gnomad_v3_af_tooltips')}>
          {t('variant.headers.gnomad_v3_af')}
        </TooltipsHeader>
      ),
      minSize: 120,
    }),
    // Freq.
    columnHelper.accessor(row => row.pf_wgs, {
      id: 'pf_wgs',
      cell: info => (
        <ParticipantFrequencyCell
          locusId={info.row.original.locus_id}
          value={info.getValue()}
        />
      ),
      header: () => (
        <TooltipsHeader tooltips={t('variant.headers.pf_wgs_tooltips')}>
          {t('variant.headers.pf_wgs')}
        </TooltipsHeader>
      ),
      minSize: 120,
    }),
    // GQ.
    columnHelper.accessor(row => row.genotype_quality, {
      id: 'genotype_quality',
      cell: info => <NumberCell value={info.getValue()} />,
      header: () => (
        <TooltipsHeader tooltips={t('variant.headers.genotype_quality_tooltips')}>
          {t('variant.headers.genotype_quality')}
        </TooltipsHeader>
      ),
      minSize: 120,
    }),
    // Zyg.
    columnHelper.accessor(row => row.zygosity, {
      id: 'zygosity',
      cell: info => <ZygosityCell value={info.getValue()} />,
      header: () => (
        <TooltipsHeader tooltips={t('variant.headers.zygosity_tooltips')}>
          {t('variant.headers.zygosity')}
        </TooltipsHeader>
      ),
      minSize: 120,
      enableSorting: false,
    }),
    columnHelper.accessor(row => row.ad_ratio, {
      id: 'ad_ratio',
      cell: info => <NumberCell value={info.getValue()} />,
      header: t('variant.headers.ad_ratio'),
      minSize: 120,
    }),
  ] as TableColumnDef<Occurrence, any>[];
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
    id: 'variant_class',
    visible: true,
    label: 'variant.headers.variant_class',
  },
  {
    id: 'dbSNP',
    visible: true,
    label: 'variant.headers.dbSNP',
  },
  {
    id: 'symbol',
    visible: true,
    label: 'variant.headers.symbol',
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
