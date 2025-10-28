import { createColumnHelper } from '@tanstack/react-table';
import { TFunction } from 'i18next';

import { GermlineCNVOccurrence } from '@/api/api';
import DocumentSizeCell from '@/components/base/data-table/cells/document-size-cell';
import GnomadCell from '@/components/base/data-table/cells/gnomad-cell';
import TextCell from '@/components/base/data-table/cells/text-cell';
import { createColumnSettings, TableColumnDef } from '@/components/base/data-table/data-table';
import TooltipHeader from '@/components/base/data-table/headers/table-tooltip-header';

import ClingenCell from './cells/clingen-cell';
import CNVNameCell from './cells/cnv-name-cell';
import OverlappingGeneLinkCell from './cells/overlapping-gene-link-cell';

const columnHelper = createColumnHelper<GermlineCNVOccurrence>();

function getCNVOccurrenceColumns(t: TFunction<string, undefined>) {
  return [
    // Genes
    columnHelper.accessor(row => row.symbol, {
      id: 'symbol',
      cell: info => (
        <OverlappingGeneLinkCell occurrence={info.row.original}>
          {info.getValue() && info.getValue().join(', ')}
        </OverlappingGeneLinkCell>
      ),
      header: () => (
        <TooltipHeader tooltip={t('variant.headers.symbol_tooltip')}>{t('variant.headers.symbol')}</TooltipHeader>
      ),
      size: 124,
      minSize: 40,
      enableSorting: false,
    }),
    // Cytoband
    columnHelper.accessor(row => row.cytoband, {
      id: 'cytoband',
      cell: info => (
        <OverlappingGeneLinkCell occurrence={info.row.original}>
          {info.getValue() && info.getValue().join(', ')}
        </OverlappingGeneLinkCell>
      ),
      header: t('variant.headers.cytoband'),
      size: 124,
      minSize: 40,
      enableSorting: false,
    }),
    // # SNVs
    columnHelper.accessor(row => row.nb_snv, {
      id: 'nb_snv',
      cell: info => <TextCell>{info.getValue()}</TextCell>,
      header: () => (
        <TooltipHeader tooltip={t('variant.headers.nb_snv_tooltip')}>{t('variant.headers.nb_snv')}</TooltipHeader>
      ),
      size: 96,
      minSize: 40,
      enableSorting: true,
    }),
    // Variant
    columnHelper.accessor(row => row, {
      id: 'name',
      cell: info => <CNVNameCell occurrence={info.getValue()} />,
      header: t('variant.headers.name'),
      size: 148,
      minSize: 40,
      enableSorting: true,
    }),
    // ClinGen
    columnHelper.accessor(row => row, {
      id: 'clingen',
      cell: info => <ClingenCell occurrence={info.getValue()} />,
      header: t('variant.headers.clingen'),
      size: 124,
      minSize: 40,
      enableSorting: false,
    }),
    // Chr
    columnHelper.accessor(row => row.chromosome, {
      id: 'chromosome',
      cell: info => <TextCell>{info.getValue()}</TextCell>,
      header: () => (
        <TooltipHeader tooltip={t('variant.headers.chromosome_tooltip')}>
          {t('variant.headers.chromosome')}
        </TooltipHeader>
      ),
      size: 96,
      minSize: 40,
      enableSorting: true,
    }),
    // Start
    columnHelper.accessor(row => row.start, {
      id: 'start',
      cell: info => <TextCell>{info.getValue()}</TextCell>,
      header: t('variant.headers.start'),
      size: 124,
      minSize: 40,
      enableSorting: true,
    }),
    // End
    columnHelper.accessor(row => row.end, {
      id: 'end',
      cell: info => <TextCell>{info.getValue()}</TextCell>,
      header: t('variant.headers.end'),
      size: 124,
      minSize: 40,
      enableSorting: true,
    }),
    // Type
    columnHelper.accessor(row => row.type, {
      id: 'type',
      cell: info => <TextCell>{info.getValue()}</TextCell>,
      header: t('variant.headers.type'),
      size: 124,
      minSize: 40,
      enableSorting: true,
    }),
    // Length
    columnHelper.accessor(row => row.length, {
      id: 'length',
      cell: info => <DocumentSizeCell value={info.getValue()} />,
      header: () => (
        <TooltipHeader tooltip={t('variant.headers.length_tooltip')}>{t('variant.headers.length')}</TooltipHeader>
      ),
      size: 124,
      minSize: 40,
      enableSorting: true,
    }),
    // CN
    columnHelper.accessor(row => row.cn, {
      id: 'cn',
      cell: info => <TextCell>{info.getValue()}</TextCell>,
      header: () => <TooltipHeader tooltip={t('variant.headers.cn_tooltip')}>{t('variant.headers.cn')}</TooltipHeader>,
      size: 96,
      minSize: 40,
      enableSorting: true,
    }),
    // gnomAD
    columnHelper.accessor(row => row.gnomad_sf, {
      id: 'gnomad_sf',
      cell: info => <GnomadCell value={info.getValue()} />,
      header: () => (
        <TooltipHeader tooltip={t('variant.headers.gnomad_sf_tooltip')}>{t('variant.headers.gnomad_sf')}</TooltipHeader>
      ),
      size: 124,
      minSize: 40,
      enableSorting: true,
    }),
    // # Genes
    columnHelper.accessor(row => row.nb_genes, {
      id: 'nb_genes',
      cell: info => <OverlappingGeneLinkCell occurrence={info.row.original}>{info.getValue()}</OverlappingGeneLinkCell>,

      header: () => (
        <TooltipHeader tooltip={t('variant.headers.nb_genes_tooltip')}>{t('variant.headers.nb_genes')}</TooltipHeader>
      ),
      size: 124,
      minSize: 40,
      enableSorting: true,
    }),
    // GT
    columnHelper.accessor(row => row.calls, {
      id: 'calls',
      cell: info => <TextCell>{info.getValue()}</TextCell>,
      header: () => (
        <TooltipHeader tooltip={t('variant.headers.calls_tooltip')}>{t('variant.headers.calls')}</TooltipHeader>
      ),
      size: 124,
      minSize: 40,
      enableSorting: false,
    }),
    // Filter
    columnHelper.accessor(row => row.filter, {
      id: 'filter',
      cell: info => <TextCell>{info.getValue()}</TextCell>,
      header: t('variant.headers.filter'),
      size: 124,
      minSize: 40,
      enableSorting: false,
    }),
    // Qual.
    columnHelper.accessor(row => row.quality, {
      id: 'quality',
      cell: info => <TextCell>{info.getValue()}</TextCell>,
      header: () => (
        <TooltipHeader tooltip={t('variant.headers.quality_tooltip')}>{t('variant.headers.quality')}</TooltipHeader>
      ),
      size: 124,
      minSize: 40,
      enableSorting: false,
    }),
    // BC
    columnHelper.accessor(row => row.bc, {
      id: 'bc',
      cell: info => <TextCell>{info.getValue()}</TextCell>,
      header: () => <TooltipHeader tooltip={t('variant.headers.bc_tooltip')}>{t('variant.headers.bc')}</TooltipHeader>,
      size: 124,
      minSize: 40,
      enableSorting: true,
    }),
    // PE
    columnHelper.accessor(row => row.pe, {
      id: 'pe',
      cell: info => <TextCell>{info.getValue()}</TextCell>,
      header: () => <TooltipHeader tooltip={t('variant.headers.pe_tooltip')}>{t('variant.headers.pe')}</TooltipHeader>,
      size: 124,
      minSize: 40,
      enableSorting: false,
    }),
  ] as TableColumnDef<GermlineCNVOccurrence, any>[];
}

const defaultCNVSettings = createColumnSettings([
  {
    id: 'symbol',
    visible: true,
    label: 'variant.headers.symbol',
  },
  {
    id: 'cytoband',
    visible: true,
    label: 'variant.headers.cytoband',
  },
  {
    id: 'nb_snv',
    visible: true,
    label: 'variant.headers.nb_snv',
  },
  {
    id: 'name',
    visible: true,
    label: 'variant.headers.name',
  },
  {
    id: 'clingen',
    visible: true,
    label: 'variant.headers.clingen',
  },
  {
    id: 'chromosome',
    visible: true,
    label: 'variant.headers.chromosome',
  },
  {
    id: 'start',
    visible: true,
    label: 'variant.headers.start',
  },
  {
    id: 'end',
    visible: true,
    label: 'variant.headers.end',
  },
  {
    id: 'type',
    visible: true,
    label: 'variant.headers.type',
  },
  {
    id: 'length',
    visible: true,
    label: 'variant.headers.length',
  },
  {
    id: 'cn',
    visible: true,
    label: 'variant.headers.cn',
  },
  {
    id: 'gnomad_sf',
    visible: true,
    label: 'variant.headers.gnomad_sf',
  },
  {
    id: 'nb_genes',
    visible: true,
    label: 'variant.headers.nb_genes',
  },
  {
    id: 'calls',
    visible: false,
    label: 'variant.headers.calls',
  },
  {
    id: 'filter',
    visible: false,
    label: 'variant.headers.filter',
  },
  {
    id: 'quality',
    visible: false,
    label: 'variant.headers.quality',
  },
  {
    id: 'bc',
    visible: false,
    label: 'variant.headers.bc',
  },
  {
    id: 'pe',
    visible: false,
    label: 'variant.headers.pe',
  },
]);

export { getCNVOccurrenceColumns, defaultCNVSettings };
