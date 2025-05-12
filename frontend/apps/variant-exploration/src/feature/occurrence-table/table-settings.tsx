import { createColumnHelper, HeaderContext } from '@tanstack/react-table';
import { TableColumnDef, createColumnSettings } from '@/components/base/data-table/data-table';
import RowExpandCell from '@/components/base/data-table/cells/row-expand-cell';
import RowSelectionCell from '@/components/base/data-table/cells/row-selection-cell';
import RowSelectionHeader from '@/components/base/data-table/headers/table-row-selection-header';
import TooltipsHeader from '@/components/base/data-table/headers/table-tooltips-header';
import GeneCell from '@/feature/occurrence-table/cells/gene-cell';
import LinkCell from '@/feature/occurrence-table/cells/link-cell';
import ManeCell from '@/feature/occurrence-table/cells/mane-cell';
import ClinvarCell from '@/feature/occurrence-table/cells/clinvar-cell';
import ParticipantFrequencyCell from '@/feature/occurrence-table/cells/participant-frequency-cell';
import MostDeleteriousConsequenceCell from '@/feature/occurrence-table/cells/most-deleterious-consequence-cell';
import OmimCell from '@/feature/occurrence-table/cells/omim-cell';
import GnomadCell from '@/feature/occurrence-table/cells/gnomad-cell';
import NumberCell from '@/feature/occurrence-table/cells/number-cell';
import VariantClassCell from '@/feature/occurrence-table/cells/variant-class-cell';
import ZygosityCell from '@/feature/occurrence-table/cells/zygosity-cell';
import { Occurrence } from '@/api/api';
import { TFunction } from 'i18next';
import InterpretationCell from '@/feature/occurrence-table/cells/interpretation-cell';
import { ZapIcon } from 'lucide-react';

const columnHelper = createColumnHelper<Occurrence>();

function getVariantColumns(t: TFunction<string, undefined>) {
  return [
    {
      id: 'rowExpand',
      cell: RowExpandCell,
      size: 40,
      enableResizing: false,
      enablePinning: false,
    },
    {
      id: 'rowSelection',
      header: (header: HeaderContext<any, Occurrence>) => <RowSelectionHeader table={header.table} />,
      cell: info => <RowSelectionCell row={info.row} />,
      size: 40,
      enablePinning: false,
      enableResizing: false,
    },
    columnHelper.accessor(row => row, {
      id: 'clinicalInterpretation',
      cell: info => <InterpretationCell occurrence={info.getValue()} />,
      header: () => (
        <TooltipsHeader tooltips={t('variant.headers.clinicalInterpretation')} iconOnly>
          <ZapIcon size={16} />
        </TooltipsHeader>
      ),
      size: 40,
      enablePinning: false,
      enableResizing: false,
      enableSorting: false,
    }),
    columnHelper.accessor(row => row.hgvsg, {
      id: 'hgvsg',
      cell: info => <LinkCell url={`/variants/entity/${info.row.original.locus_id}`}>{info.getValue()}</LinkCell>,
      header: t('variant.headers.hgvsg'),
      size: 150,
      minSize: 120,
    }),
    columnHelper.accessor(row => row.variant_class, {
      id: 'variantClass',
      cell: info => <VariantClassCell value={info.getValue()} />,
      header: t('variant.headers.variantClass'),
      minSize: 120,
    }),
    columnHelper.accessor(row => row.symbol, {
      id: 'symbol',
      cell: info => <GeneCell symbol={info.getValue()} />,
      header: t('variant.headers.symbol'),
      minSize: 120,
    }),
    columnHelper.accessor(row => row, {
      id: 'mostDeleteriousConsequence',
      cell: info => (
        <MostDeleteriousConsequenceCell
          vepImpact={info.getValue().vep_impact}
          consequences={info.getValue().picked_consequences}
          aaChange={info.getValue().aa_change}
        />
      ),
      header: () => (
        <TooltipsHeader tooltips={t('variant.headers.mostDeleteriousConsequenceTooltips')}>
          {t('variant.headers.mostDeleteriousConsequence')}
        </TooltipsHeader>
      ),
      size: 225,
      minSize: 160,
    }),
    columnHelper.accessor(row => row, {
      id: 'maneSelect',
      cell: info => (
        <ManeCell isManeSelect={info.getValue().is_mane_select} isCanonical={info.getValue().is_canonical} />
      ),
      header: t('variant.headers.maneSelect'),
      minSize: 120,
    }),
    columnHelper.accessor(row => row.omim_inheritance_code, {
      id: 'omimInheritanceCode',
      cell: info => <OmimCell codes={info.getValue()} />,
      header: () => (
        <TooltipsHeader tooltips={t('variant.headers.omimInheritanceCodeTooltips')}>
          {t('variant.headers.omimInheritanceCode')}
        </TooltipsHeader>
      ),
      minSize: 120,
    }),
    columnHelper.accessor(row => row.clinvar, {
      id: 'clinVar',
      cell: info => <ClinvarCell codes={info.getValue()} />,
      header: t('variant.headers.clinVar'),
      minSize: 120,
    }),
    columnHelper.accessor(row => row.gnomad_v3_af, {
      id: 'gnomadv3AF',
      cell: info => <GnomadCell value={info.getValue()} />,
      header: () => (
        <TooltipsHeader tooltips={t('variant.headers.gnomadv3AFTooltips')}>
          {t('variant.headers.gnomadv3AF')}
        </TooltipsHeader>
      ),
      minSize: 120,
    }),
    columnHelper.accessor(row => row.pf, {
      id: 'pf',
      cell: info => <ParticipantFrequencyCell value={info.getValue()} />,
      header: t('variant.headers.pf'),
      minSize: 120,
    }),
    columnHelper.accessor(row => row.genotype_quality, {
      id: 'genotypeQuality',
      cell: info => <NumberCell value={info.getValue()} />,
      header: t('variant.headers.genotypeQuality'),
      minSize: 120,
    }),
    columnHelper.accessor(row => row.zygosity, {
      id: 'zygosity',
      cell: info => <ZygosityCell value={info.getValue()} />,
      header: t('variant.headers.zygosity'),
      minSize: 120,
    }),
    columnHelper.accessor(row => row.ad_ratio, {
      id: 'adRatio',
      cell: info => <NumberCell value={info.getValue()} />,
      header: t('variant.headers.adRatio'),
      minSize: 120,
    }),
  ] as TableColumnDef<Occurrence, any>[];
}

const defaultSettings = createColumnSettings([
  {
    id: 'rowExpand',
    visible: true,
    fixed: true,
    pinningPosition: 'left',
  },
  {
    id: 'rowSelection',
    visible: true,
    fixed: true,
    pinningPosition: 'left',
  },
  {
    id: 'clinicalInterpretation',
    visible: true,
    fixed: true,
    pinningPosition: 'left',
  },
  {
    id: 'hgvsg',
    visible: true,
    pinningPosition: 'left',
  },
  {
    id: 'variantClass',
    visible: true,
  },
  {
    id: 'symbol',
    visible: true,
  },
  {
    id: 'mostDeleteriousConsequence',
    visible: true,
  },
  {
    id: 'maneSelect',
    visible: true,
  },
  {
    id: 'omimInheritanceCode',
    visible: true,
  },
  {
    id: 'clinVar',
    visible: true,
  },
  {
    id: 'gnomadv3AF',
    visible: true,
  },
  {
    id: 'pf',
    visible: true,
  },
  {
    id: 'genotypeQuality',
    visible: true,
  },
  {
    id: 'zygosity',
    visible: true,
  },
  {
    id: 'adRatio',
    visible: true,
  },
]);

export { getVariantColumns, defaultSettings };
