import type { Meta, StoryObj } from '@storybook/react-vite';

import { SidebarGroups } from '@/components/base/query-filters/sidebar-groups';
import { SidebarProvider } from '@/components/base/shadcn/sidebar';
import { FilterTypes } from '@/components/cores/applications-config';
import { RangeOperators } from '@/components/cores/sqon';

const meta = {
  title: 'Sidebar/Sidebar Brand',
  component: SidebarGroups,
  args: {},
  decorators: [
    Story => (
      <SidebarProvider className="m-[-16px] w-50">
        <div className="w-50">
          <Story />
        </div>
      </SidebarProvider>
    ),
  ],
} satisfies Meta<typeof SidebarGroups>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    aggregationGroups: {
      variant: {
        items: [
          {
            key: 'type',
            translation_key: 'variant_type',
            type: FilterTypes.MULTIPLE,
          },
          {
            key: 'cn',
            translation_key: 'cn',
            type: FilterTypes.NUMERICAL,
            defaults: {
              min: 0,
              max: 100,
              defaultOperator: RangeOperators.GreaterThan,
            },
          },
          {
            key: 'length',
            translation_key: 'cnv_length',
            type: FilterTypes.NUMERICAL,
            defaults: {
              min: 0,
              max: 100,
              defaultOperator: RangeOperators.GreaterThan,
            },
          },
          {
            key: 'chromosome',
            translation_key: 'chromosome',
            type: FilterTypes.MULTIPLE,
          },
          {
            key: 'start',
            translation_key: 'cnv_start',
            type: FilterTypes.NUMERICAL,
            defaults: {
              min: 0,
              max: 100,
              defaultOperator: RangeOperators.Between,
            },
          },
          {
            key: 'end',
            translation_key: 'cnv_end',
            type: FilterTypes.NUMERICAL,
            defaults: {
              min: 0,
              max: 100,
              defaultOperator: RangeOperators.LessThan,
            },
          },
          {
            key: 'nb_snv',
            translation_key: 'nb_snv',
            type: FilterTypes.NUMERICAL,
            defaults: {
              min: 0,
              max: 100,
              defaultOperator: RangeOperators.GreaterThan,
            },
          },
        ],
      },
      gene: {
        items: [
          {
            key: 'cytoband',
            translation_key: 'cytoband',
            type: FilterTypes.MULTIPLE,
          },
          {
            key: 'gene_divider',
            translation_key: 'gene_divider',
            type: FilterTypes.DIVIDER,
          },
          {
            key: 'hpo_gene_panel',
            translation_key: 'hpo_gene_panel',
            type: FilterTypes.MULTIPLE,
          },
          {
            key: 'orphanet_gene_panel',
            translation_key: 'orphanet_gene_panel',
            type: FilterTypes.MULTIPLE,
          },
          {
            key: 'omim_gene_panel',
            translation_key: 'omim_gene_panel',
            type: FilterTypes.MULTIPLE,
          },
          {
            key: 'ddd_gene_panel',
            translation_key: 'ddd_gene_panel',
            type: FilterTypes.MULTIPLE,
          },
          {
            key: 'cosmic_gene_panel',
            translation_key: 'cosmic_gene_panel',
            type: FilterTypes.MULTIPLE,
          },
        ],
      },
      frequency: {
        items: [
          {
            key: 'frequency_divider_pulic_cohorts',
            translation_key: 'frequency_divider_pulic_cohorts',
            type: FilterTypes.DIVIDER,
          },
          {
            key: 'gnomad_sf',
            translation_key: 'gnomad_sf',
            type: FilterTypes.NUMERICAL,
            defaults: {
              min: 0,
              max: 100,
              defaultOperator: RangeOperators.LessThan,
              defaultMin: 0,
              defaultMax: 100,
            },
          },
          {
            key: 'gnomad_sc',
            translation_key: 'gnomad_sc',
            type: FilterTypes.NUMERICAL,
            defaults: {
              min: 0,
              max: 100,
              defaultOperator: RangeOperators.LessThan,
              defaultMin: 0,
              defaultMax: 100,
            },
          },
        ],
      },
      metric_qc: {
        items: [
          {
            key: 'filter',
            translation_key: 'filter',
            type: FilterTypes.MULTIPLE,
          },
          {
            key: 'quality',
            translation_key: 'cnv_quality',
            type: FilterTypes.NUMERICAL,
            defaults: {
              min: 0,
              max: 100,
              defaultOperator: RangeOperators.GreaterThan,
              defaultMin: 0,
              defaultMax: 100,
            },
          },
          {
            key: 'pe',
            translation_key: 'pe',
            type: FilterTypes.NUMERICAL,
            defaults: {
              min: 0,
              max: 100,
              defaultOperator: RangeOperators.LessThan,
              defaultMin: 0,
              defaultMax: 100,
            },
          },
          {
            key: 'sm',
            translation_key: 'sm',
            type: FilterTypes.NUMERICAL,
            defaults: {
              min: 0,
              max: 100,
              defaultOperator: RangeOperators.LessThan,
              defaultMin: 0,
              defaultMax: 100,
            },
          },
        ],
      },
    },
  },
  render: args => <SidebarGroups {...args} />,
};
