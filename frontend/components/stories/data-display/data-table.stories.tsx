import type { Meta, StoryObj } from '@storybook/react';
import { BrowserRouter } from 'react-router-dom';
import DataTable from '@/components/base/data-table/data-table';
import { Occurrence, SortBodyOrderEnum } from '@/api/api';
import { ConfigProvider, PortalConfig } from '@/components/model/applications-config';

import {
  getVariantColumns,
  defaultSettings,
} from '../../../apps/variant-exploration/src/feature/occurrence-table/table-settings';
import OccurrenceExpend from '../../../apps/variant-exploration/src/feature/occurrence-table/occurrence-expend';

// Purposely used absolute paths since variant app is not a dependency of the components library
import { useI18n } from '@/components/hooks/i18n';

const config: PortalConfig = {
  variant_exploration: {
    app_id: 'variant_exploration_multi_select_filter',
    aggregations: [],
  },
  portal: {
    name: '',
    navigation: {},
  },
};

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
    is_mane_select: true,
    seq_id: 1,
    locus_id: 1,
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
    seq_id: 2,
    locus_id: 2,
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
    is_mane_select: true,
    seq_id: 3,
    locus_id: 3,
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
    seq_id: 4,
    locus_id: 4,
  },
  {
    genotype_quality: 7,
    zygosity: 'HOM',
    pf: 0.000353,
    hgvsg: 'chr17:g.70647334_70647335insTTTTTTTTTATTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT',
    ad_ratio: 1,
    variant_class: 'insertion',
    vep_impact: 'MODIFIER',
    seq_id: 5,
    locus_id: 5,
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
    is_mane_select: true,
    seq_id: 6,
    locus_id: 6,
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
    seq_id: 7,
    locus_id: 7,
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
    is_mane_select: true,
    seq_id: 8,
    locus_id: 8,
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
    is_mane_select: true,
    seq_id: 9,
    locus_id: 9,
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
    is_mane_select: true,
    seq_id: 10,
    locus_id: 10,
  },
] as Occurrence[];

const meta = {
  title: 'Data Display/Data Table',
  component: DataTable,
  args: {
    id: 'variant',
    columns: [],
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
    total: 10,
  },
  decorators: [
    Story => (
      <BrowserRouter>
        <ConfigProvider config={config}>
          <Story />
        </ConfigProvider>
      </BrowserRouter>
    ),
  ],
} satisfies Meta<typeof DataTable>;

export default meta;

type Story = StoryObj<typeof meta>;

export const VariantOccurrence: Story = {
  render: args => {
    const { t } = useI18n();

    return (
      <DataTable
        {...args}
        pagination={{
          pageIndex: 0,
          pageSize: 50,
        }}
        data={data}
        columns={getVariantColumns(t)}
        subComponent={occurrence => <OccurrenceExpend occurrence={occurrence} />}
      />
    );
  },
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
