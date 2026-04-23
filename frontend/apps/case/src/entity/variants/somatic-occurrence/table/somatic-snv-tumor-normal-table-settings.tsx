import { createColumnHelper } from '@tanstack/react-table';
import { TFunction } from 'i18next';

import { GermlineSNVOccurrence, SomaticSNVOccurrence } from '@/api/api';
import AnchorLinkCell from '@/components/base/data-table/cells/anchor-link-cell';
import ClinvarCell from '@/components/base/data-table/cells/clinvar-cell';
import GeneCell from '@/components/base/data-table/cells/gene-cell';
import GermlineGenomeFrequencyCell from '@/components/base/data-table/cells/germline-genome-frequency-cell';
import GnomadCell from '@/components/base/data-table/cells/gnomad-cell';
import ManeCell from '@/components/base/data-table/cells/mane-cell';
import MostDeleteriousConsequenceCell from '@/components/base/data-table/cells/most-deleterious-consequence-cell';
import NumberCell from '@/components/base/data-table/cells/number-cell';
import OmimCell from '@/components/base/data-table/cells/omim-cell';
import TextCell from '@/components/base/data-table/cells/text-cell';
import TextTooltipCell from '@/components/base/data-table/cells/text-tooltip-cell';
import TumorNormalFrequencyCell from '@/components/base/data-table/cells/tumor-normal-frequency-cell';
import { createColumnSettings, TableColumnDef } from '@/components/base/data-table/data-table';
import TooltipHeader from '@/components/base/data-table/headers/table-tooltip-header';
import { Badge } from '@/components/base/shadcn/badge';

import HgvsgCell from '../../table/cells/hgvsg-cell';
import VariantNoteCell from '../../table/cells/variant-note-cell';

import SomaticActionsCell from './cells/somatic-actions-cell';
import SomaticHotspotCell from './cells/somatic-hotspot-cell';
import SomaticInterpretationCell from './cells/somatic-interpretation-cell';

const columnHelper = createColumnHelper<SomaticSNVOccurrence>();

function getSomaticSNVTumorNormalColumns(t: TFunction<string, undefined>) {
  return [
    // interpretation and note cell
    columnHelper.accessor(row => row, {
      id: 'row-info',
      cell: info => (
        <div className="flex items-center gap-1">
          <SomaticInterpretationCell occurrence={info.getValue()} />
          <VariantNoteCell occurrence={info.getValue()} />
        </div>
      ),
      header: () => null,
      size: 68,
      enablePinning: false,
      enableResizing: false,
      enableSorting: false,
    }),
    // Variant
    columnHelper.accessor(row => row.hgvsg, {
      id: 'hgvsg',
      cell: info => <HgvsgCell locusId={info.row.original.locus_id} hgvsg={info.getValue()} />,
      header: t('variant.headers.hgvsg'),
      size: 70,
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
      cell: info => <TextCell>{info.getValue()}</TextCell>,
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
          <Badge variant="outline">{t(`variant.classes.${info.getValue()?.toLowerCase()}`)}</Badge>
        </TextTooltipCell>
      ),
      header: t('variant.headers.variant_class'),
      size: 96,
      minSize: 40,
    }),
    // Consequence
    columnHelper.accessor(row => row, {
      id: 'max_impact_score',
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
          {info.getValue() && <span className="overflow-hidden text-ellipsis">{info.getValue()}</span>}
        </AnchorLinkCell>
      ),
      header: t('variant.headers.dbSNP'),
      size: 96,
      minSize: 40,
      enableSorting: false,
    }),
    // OMIM
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
    // Hotspot
    columnHelper.accessor(row => row.hotspot, {
      id: 'hotspot',
      cell: info => <SomaticHotspotCell value={info.getValue()} />,
      header: () => (
        <TooltipHeader tooltip={t('variant.headers.hotspot_tooltip')}>{t('variant.headers.hotspot')}</TooltipHeader>
      ),
      size: 124,
      minSize: 40,
      enableSorting: true,
    }),
    // @TODO: Tier is missing in somatic api
    // @TODO: CMC is missing in somatic api
    // ClinVar
    columnHelper.accessor(row => row.clinvar, {
      id: 'clinvar',
      cell: info => <ClinvarCell codes={info.getValue()} />,
      header: t('variant.headers.clinvar'),
      size: 124,
      minSize: 40,
      enableSorting: false,
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
    // Freq. TN
    columnHelper.accessor(row => row, {
      id: 'freq_tn',
      cell: info => (
        <TumorNormalFrequencyCell
          locusId={info.row.original.locus_id}
          pc={info.row.original.somatic_pc_tn_wgs}
          pf={info.row.original.somatic_pf_tn_wgs}
        />
      ),
      header: () => (
        <TooltipHeader tooltip={t('variant.headers.freq_tn_tooltip')}>{t('variant.headers.freq_tn')}</TooltipHeader>
      ),
      size: 124,
      minSize: 40,
    }),
    // Freq. G
    columnHelper.accessor(row => row, {
      id: 'freq_g',
      cell: info => (
        <GermlineGenomeFrequencyCell
          locusId={info.row.original.locus_id}
          pc={info.row.original.germline_pc_wgs}
          pf={info.row.original.germline_pf_wgs}
        />
      ),
      header: () => (
        <TooltipHeader tooltip={t('variant.headers.freq_g_tooltip')}>{t('variant.headers.freq_g')}</TooltipHeader>
      ),
      size: 124,
      minSize: 40,
    }),
    // @TODO: SQ. (Somatic Quality) is missing in somatic api
    // @TODO: Zyg. is missing in somatic api
    // Ratio AD
    columnHelper.accessor(row => row.ad_ratio, {
      id: 'ad_ratio',
      cell: info => <NumberCell value={info.getValue()} />,
      header: () => (
        <TooltipHeader tooltip={t('variant.headers.ad_ratio_tooltip')}>{t('variant.headers.ad_ratio')}</TooltipHeader>
      ),
      size: 124,
      minSize: 40,
    }),
    // Actions Buttons
    {
      id: 'actions',
      cell: info => <SomaticActionsCell row={info.row} />,
      size: 86,
      enableResizing: false,
      enablePinning: true,
    },
  ] as TableColumnDef<GermlineSNVOccurrence, any>[];
}

const defaultSomaticSNVSettings = createColumnSettings([
  // TODO: To be enabled when row selection function are implemented
  // {
  //   id: 'row_selection',
  //   visible: true,
  //   fixed: true,
  //   pinningPosition: 'left',
  // },
  {
    id: 'row-info',
    visible: true,
    fixed: true,
    pinningPosition: 'left',
    additionalFields: ['transcript_id', 'has_interpretation'],
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
    additionalFields: ['symbol'],
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
    id: 'max_impact_score',
    visible: true,
    label: 'variant.headers.picked_consequences',
    additionalFields: ['vep_impact'],
  },
  {
    id: 'is_mane_select',
    visible: true,
    label: 'variant.headers.is_mane_select',
    additionalFields: ['is_mane_select', 'is_canonical'],
  },
  {
    id: 'dbSNP',
    visible: true,
    label: 'variant.headers.dbSNP',
    additionalFields: ['rsnumber'],
  },
  {
    id: 'omim_inheritance_code',
    visible: true,
    label: 'variant.headers.omim_inheritance_code',
    additionalFields: ['omim_inheritance_code'],
  },
  {
    id: 'hotspot',
    visible: true,
    label: 'variant.headers.hotspot',
    additionalFields: ['hotspot'],
  },
  {
    id: 'clinvar',
    visible: true,
    label: 'variant.headers.clinvar',
    additionalFields: ['clinvar'],
  },
  {
    id: 'gnomad_v3_af',
    visible: true,
    label: 'variant.headers.gnomad_v3_af',
  },
  {
    id: 'freq_tn',
    visible: true,
    label: 'variant.headers.freq_tn',
  },
  {
    id: 'freq_g',
    visible: true,
    label: 'variant.headers.freq_g',
    additionalFields: ['germline_pf_wgs'],
  },
  {
    id: 'ad_ratio',
    visible: true,
    label: 'variant.headers.ad_ratio',
  },
  {
    id: 'actions',
    visible: true,
    fixed: true,
    pinningPosition: 'right',
  },
]);

export { defaultSomaticSNVSettings, getSomaticSNVTumorNormalColumns };
