import { createColumnHelper } from '@tanstack/react-table';
import { TFunction } from 'i18next';

import { CNVGeneOverlap } from '@/api/api';
import AnchorLinkCell from '@/components/base/data-table/cells/anchor-link-cell';
import DocumentSizeCell from '@/components/base/data-table/cells/document-size-cell';
import { createColumnSettings, TableColumnDef } from '@/components/base/data-table/data-table';
import TooltipHeader from '@/components/base/data-table/headers/table-tooltip-header';

import OverlapTypeGeneCell from './cells/overlap-type-gene-cell';

const columnHelper = createColumnHelper<CNVGeneOverlap>();

function getCNVOverlappingGenesColumns(t: TFunction<string, undefined>) {
  return [
    columnHelper.group({
      id: 'unamed',
      columns: [
        // Genes
        columnHelper.accessor(row => row.symbol, {
          id: 'symbol',
          cell: info => (
            <AnchorLinkCell
              href={`https://www.omim.org/search?index=entry&start=1&limit=10&sort=score+desc%2C+prefix_sort+desc&search=${info.getValue()}`}
              external
              target="_blank"
            >
              {info.getValue()}
            </AnchorLinkCell>
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
          header: t('variant.headers.cytoband'),
          size: 124,
          minSize: 40,
          enableSorting: false,
        }),
        // ClinGen
        columnHelper.accessor(row => row.symbol, {
          id: 'clingen',
          cell: info => (
            <AnchorLinkCell
              href={`https://search.clinicalgenome.org/kb/genes?search=${info.getValue()}`}
              target="_blank"
              external
            />
          ),
          header: t('variant.headers.clingen'),
          size: 124,
          minSize: 40,
          enableSorting: false,
        }),
        // Length
        columnHelper.accessor(row => row.gene_length, {
          id: 'gene_length',
          cell: info => <DocumentSizeCell value={info.getValue()} />,
          header: t('variant.headers.length'),
          size: 124,
          minSize: 40,
          enableSorting: true,
        }),
      ],
    }),
    // Panel
    columnHelper.group({
      id: 'panels',
      header: t('variant.headers.panels'),
      columns: [
        // # Bases
        columnHelper.accessor(row => row.nb_overlap_bases, {
          id: 'nb_overlap_bases',
          header: () => (
            <TooltipHeader tooltip={t('variant.headers.nb_overlap_bases_tooltip')}>
              {t('variant.headers.nb_overlap_bases')}
            </TooltipHeader>
          ),
          size: 124,
          minSize: 40,
          enableSorting: true,
        }),
        // # Exons
        columnHelper.accessor(row => row.nb_exons, {
          id: 'nb_exons',
          header: () => (
            <TooltipHeader tooltip={t('variant.headers.nb_exons_tooltip')}>
              {t('variant.headers.nb_exons')}
            </TooltipHeader>
          ),
          size: 124,
          minSize: 40,
          enableSorting: true,
        }),
        // % Gene
        columnHelper.accessor(row => row.overlapping_gene_percent, {
          id: 'overlapping_gene_percent',
          header: () => (
            <TooltipHeader tooltip={t('variant.headers.overlapping_gene_percent_tooltip')}>
              {t('variant.headers.overlapping_gene_percent')}
            </TooltipHeader>
          ),
          size: 124,
          minSize: 40,
          enableSorting: true,
        }),
        // % CNV
        columnHelper.accessor(row => row.overlapping_cnv_percent, {
          id: 'overlapping_cnv_percent',
          header: () => (
            <TooltipHeader tooltip={t('variant.headers.overlapping_cnv_percent_tooltip')}>
              {t('variant.headers.overlapping_cnv_percent')}
            </TooltipHeader>
          ),
          size: 124,
          minSize: 40,
          enableSorting: true,
        }),
        // Type
        columnHelper.accessor(row => row.overlap_type, {
          id: 'overlap_type',
          cell: info => <OverlapTypeGeneCell type={info.getValue()} />,
          header: () => (
            <TooltipHeader tooltip={t('variant.headers.overlap_type_tooltip')}>
              {t('variant.headers.overlap_type')}
            </TooltipHeader>
          ),
          size: 124,
          minSize: 40,
          enableSorting: true,
        }),
      ],
    }),
  ] as TableColumnDef<CNVGeneOverlap, any>[];
}

const defaultCNVOverlappingGenesSettings = createColumnSettings([
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
    id: 'clingen',
    visible: true,
    label: 'variant.headers.clingen',
  },
  {
    id: 'gene_length',
    visible: true,
    label: 'variant.headers.length',
  },
  {
    id: 'nb_overlap_bases',
    visible: true,
    label: 'variant.headers.nb_overlap_bases',
  },
  {
    id: 'nb_exons',
    visible: true,
    label: 'variant.headers.nb_exons',
  },
  {
    id: 'overlapping_gene_percent',
    visible: true,
    label: 'variant.headers.overlapping_gene_percent',
  },
  {
    id: 'overlapping_cnv_percent',
    visible: true,
    label: 'variant.headers.overlapping_cnv_percent',
  },
  {
    id: 'overlap_type',
    visible: true,
    label: 'variant.headers.overlap_type',
  },
]);

export { getCNVOverlappingGenesColumns, defaultCNVOverlappingGenesSettings };
