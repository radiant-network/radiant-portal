import { createColumnHelper, HeaderContext } from '@tanstack/react-table';
import type { Meta, StoryObj } from '@storybook/react';
import RowSelectionHeader from '@/components/base/data-table/headers/table-row-selection-header';
import DataTable, { TableColumnDef, createColumnSettings } from '@/components/base/data-table/data-table';
import { Occurrence, SortBodyOrderEnum } from '@/api/api';
import { ConfigProvider, PortalConfig } from '@/components/model/applications-config';

// Purposely used absolute paths since variant app is not a dependency of the components library
import RowExpandCell from '../../../apps/variant/src/feature/occurrence-table/cells/row-expand-cell';
import GeneCell from '../../../apps/variant/src/feature/occurrence-table/cells/gene-cell';
import LinkCell from '../../../apps/variant/src/feature/occurrence-table/cells/link-cell';
import ManeCell from '../../../apps/variant/src/feature/occurrence-table/cells/mane-cell';
import OmimCell from '../../../apps/variant/src/feature/occurrence-table/cells/omim-cell';
import ClinvarCell from '../../../apps/variant/src/feature/occurrence-table/cells/clinvar-cell';
import NumberCell from '../../../apps/variant/src/feature/occurrence-table/cells/number-cell';
import VariantClassCell from '../../../apps/variant/src/feature/occurrence-table/cells/variant-class-cell';
import ZygosityCell from '../../../apps/variant/src/feature/occurrence-table/cells/zygosity-cell';
import RowSelectionCell from '../../../apps/variant/src/feature/occurrence-table/cells/table-row-selection-cell';

const config: PortalConfig = {
  variant_entity: {
    app_id: 'variant_entity_multi_select_filter',
    aggregations: [],
  },
  portal: {
    name: '',
    navigation: {},
  },
};

const columnHelper = createColumnHelper<Occurrence>();

const data = [
  {
    genotype_quality: 49,
    zygosity: 'HET',
    pf: 0.000353,
    hgvsg: 'chr1:g.169114295T>G',
    omim_inheritance_code: ['Mu'],
    ad_ratio: 0.53571,
    variant_class: 'SNV',
    vep_impact: 'MODIFIER',
    symbol: 'ATP1B1',
    mane_select: true,
  },
  {
    genotype_quality: 54,
    zygosity: 'HET',
    pf: 0.000353,
    gnomad_v3_af: 0.000022,
    hgvsg: 'chr9:g.18180552_18180555dup',
    ad_ratio: 1,
    variant_class: 'insertion',
    vep_impact: 'MODIFIER',
    symbol: 'ADAMTSL1',
  },
  {
    genotype_quality: 38,
    zygosity: 'HET',
    pf: 0.000353,
    hgvsg: 'chr12:g.65113035T>G',
    ad_ratio: 0.69444,
    variant_class: 'SNV',
    vep_impact: 'MODIFIER',
    symbol: 'WIF1',
    mane_select: true,
  },
  {
    genotype_quality: 50,
    zygosity: 'HET',
    pf: 0.000353,
    gnomad_v3_af: 0.000454,
    hgvsg: 'chr1:g.87737552G>A',
    ad_ratio: 0.47059,
    variant_class: 'SNV',
    vep_impact: 'MODIFIER',
    symbol: 'PKN2-AS1',
  },
  {
    genotype_quality: 7,
    zygosity: 'HOM',
    pf: 0.000353,
    hgvsg: 'chr17:g.70647334_70647335insTTTTTTTTTATTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT',
    ad_ratio: 1,
    variant_class: 'insertion',
    vep_impact: 'MODIFIER',
  },
  {
    genotype_quality: 36,
    zygosity: 'HET',
    pf: 0.000353,
    gnomad_v3_af: 0.001928,
    hgvsg: 'chr10:g.20287985A>T',
    ad_ratio: 0.66667,
    variant_class: 'SNV',
    vep_impact: 'MODIFIER',
    symbol: 'PLXDC2',
    mane_select: true,
  },
  {
    genotype_quality: 27,
    zygosity: 'HOM',
    pf: 0.000353,
    gnomad_v3_af: 0.000055,
    hgvsg: 'chr20:g.4203263_4203264insTTTTTTTTTTTTTTTTTTTTTTTTTTT',
    ad_ratio: 1,
    variant_class: 'insertion',
    vep_impact: 'MODIFIER',
  },
  {
    genotype_quality: 50,
    zygosity: 'HET',
    pf: 0.000353,
    hgvsg: 'chr4:g.172858073T>C',
    ad_ratio: 0.525,
    variant_class: 'SNV',
    vep_impact: 'MODIFIER',
    symbol: 'GALNTL6',
    mane_select: true,
  },
  {
    genotype_quality: 50,
    zygosity: 'HET',
    pf: 0.000353,
    hgvsg: 'chr11:g.92239648T>C',
    ad_ratio: 0.475,
    variant_class: 'SNV',
    vep_impact: 'MODIFIER',
    symbol: 'FAT3',
    mane_select: true,
  },
  {
    genotype_quality: 50,
    zygosity: 'HET',
    pf: 0.000353,
    gnomad_v3_af: 0.000007,
    hgvsg: 'chr10:g.129505704A>T',
    ad_ratio: 0.51786,
    variant_class: 'SNV',
    vep_impact: 'MODIFIER',
    symbol: 'MGMT',
    mane_select: true,
  },
];

const columns = [
  {
    id: 'row_expand',
    cell: RowExpandCell,
    size: 48,
    enableResizing: false,
  },
  {
    id: 'row_selection',
    header: (header: HeaderContext<any, Occurrence>) => <RowSelectionHeader table={header.table} />,
    cell: info => <RowSelectionCell row={info.row} />,
    size: 48,
    enableResizing: false,
  },
  columnHelper.accessor(row => row.hgvsg, {
    id: 'hgvsg',
    cell: info => <LinkCell url="#">{info.getValue()}</LinkCell>,
    header: 'Variant',
    size: 150,
    minSize: 100,
  }),
  columnHelper.accessor(row => row.variant_class, {
    id: 'variant_class',
    cell: info => <VariantClassCell value={info.getValue()} />,
    header: 'Type',
  }),
  columnHelper.accessor(row => row.symbol, {
    id: 'symbol',
    cell: info => {
      return <GeneCell symbol={info.getValue()} />;
    },
    header: 'Gene',
  }),
  columnHelper.accessor(row => row.vep_impact, {
    id: 'vep_impact',
    cell: info => <span>{info.getValue()}</span>,
    header: 'VEP',
  }),
  columnHelper.accessor(row => row.mane_select, {
    id: 'mane_select',
    cell: info => {
      return <ManeCell mane_select={info.getValue()} />;
    },
    header: 'MANE',
  }),
  columnHelper.accessor(row => row.omim_inheritance_code, {
    id: 'omim_inheritance_code',
    cell: info => {
      return <OmimCell codes={info.getValue()} />;
    },
    header: 'OMIM',
  }),
  columnHelper.accessor(row => row.clinvar, {
    id: 'clinvar',
    cell: info => <ClinvarCell codes={info.getValue()} />,
    header: 'ClinVar',
  }),
  columnHelper.accessor(row => row.gnomad_v3_af, {
    id: 'gnomad_v3_af',
    cell: info => <NumberCell value={info.getValue()} />,
    header: 'gnomAD',
  }),
  columnHelper.accessor(row => row.pf, {
    id: 'pf',
    cell: info => <NumberCell value={info.getValue()} />,
    header: 'Participant frequency',
  }),
  columnHelper.accessor(row => row.genotype_quality, {
    id: 'genotype_quality',
    cell: info => <NumberCell value={info.getValue()} />,
    header: 'Genotype Quality',
  }),
  columnHelper.accessor(row => row.zygosity, {
    id: 'zygosity',
    cell: info => <ZygosityCell value={info.getValue()} />,
    header: 'Zygosity',
  }),
  columnHelper.accessor(row => row.ad_ratio, {
    id: 'ad_ratio',
    cell: info => <NumberCell value={info.getValue()} />,
    header: 'Ad Ratio',
  }),
] as TableColumnDef<Occurrence, any>[];

const defaultSettings = createColumnSettings([
  {
    id: 'row_expand',
    visible: true,
    fixed: true,
    pinningPosition: 'left',
  },
  {
    id: 'row_selection',
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
    id: 'variant_class',
    visible: true,
  },
  {
    id: 'symbol',
    visible: true,
  },
  {
    id: 'vep_impact',
    visible: true,
  },
  {
    id: 'mane_select',
    visible: true,
  },
  {
    id: 'omim_inheritance_code',
    visible: true,
  },
  {
    id: 'clinvar',
    visible: true,
  },
  {
    id: 'gnomad_v3_af',
    visible: true,
  },
  {
    id: 'pf',
    visible: true,
  },
  {
    id: 'genotype_quality',
    visible: true,
  },
  {
    id: 'zygosity',
    visible: true,
  },
  {
    id: 'ad_ratio',
    visible: true,
  },
]);

const meta = {
  title: 'Data Display/Data Table',
  component: DataTable,
  args: {
    columns: columns as any,
    columnSettings: defaultSettings,
    data,
    defaultColumnSettings: defaultSettings,
    defaultServerSorting: [
      {
        field: 'pf',
        order: SortBodyOrderEnum.Asc,
      },
    ],
    loadingStates: {
      total: false,
      list: false,
    },
    pagination: {
      pageIndex: 0,
      pageSize: 10,
    },
    onPaginationChange: () => {},
    onServerSortingChange: sorting => {},
    subComponent: data => {
      return (
        <pre style={{ fontSize: '10px' }}>
          <code>{JSON.stringify(data, null, 2)}</code>
        </pre>
      );
    },
    total: 10,
  },
  decorators: [
    Story => (
      <ConfigProvider config={config}>
        <Story />
      </ConfigProvider>
    ),
  ],
} satisfies Meta<typeof DataTable>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
  render: args => <DataTable {...args} />,
};

export const Loading: Story = {
  args: {
    loadingStates: {
      list: true,
      total: true,
    },
    data: [],
  },
  render: args => <DataTable {...args} />,
};
