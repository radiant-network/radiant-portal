import type { Meta, StoryObj } from '@storybook/react';

import { SidebarProvider } from '@/components/base/ui/sidebar';
import { SidebarGroups } from '@/components/feature/query-filters/sidebar-groups';
import { RangeOperators } from '@/components/model/sqon';

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
            type: 'multiple',
          },
          {
            key: 'cn',
            translation_key: 'cn',
            type: 'numerical',
            defaults: {
              min: 0,
              max: 100,
              defaultOperator: RangeOperators.GreaterThan,
            },
          },
          {
            key: 'length',
            translation_key: 'cnv_length',
            type: 'numerical',
            defaults: {
              min: 0,
              max: 100,
              defaultOperator: RangeOperators.GreaterThan,
            },
          },
          {
            key: 'chromosome',
            translation_key: 'chromosome',
            type: 'multiple',
          },
          {
            key: 'start',
            translation_key: 'cnv_start',
            type: 'numerical',
            defaults: {
              min: 0,
              max: 100,
              defaultOperator: RangeOperators.Between,
            },
          },
          {
            key: 'end',
            translation_key: 'cnv_end',
            type: 'numerical',
            defaults: {
              min: 0,
              max: 100,
              defaultOperator: RangeOperators.LessThan,
            },
          },
          {
            key: 'nb_snv',
            translation_key: 'nb_snv',
            type: 'numerical',
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
            type: 'multiple',
          },
          {
            key: 'gene_divider',
            translation_key: 'gene_divider',
            type: 'divider',
          },
          {
            key: 'hpo_gene_panel',
            translation_key: 'hpo_gene_panel',
            type: 'multiple',
          },
          {
            key: 'orphanet_gene_panel',
            translation_key: 'orphanet_gene_panel',
            type: 'multiple',
          },
          {
            key: 'omim_gene_panel',
            translation_key: 'omim_gene_panel',
            type: 'multiple',
          },
          {
            key: 'ddd_gene_panel',
            translation_key: 'ddd_gene_panel',
            type: 'multiple',
          },
          {
            key: 'cosmic_gene_panel',
            translation_key: 'cosmic_gene_panel',
            type: 'multiple',
          },
        ],
      },
      frequency: {
        items: [
          {
            key: 'frequency_divider_pulic_cohorts',
            translation_key: 'frequency_divider_pulic_cohorts',
            type: 'divider',
          },
          {
            key: 'gnomad_sf',
            translation_key: 'gnomad_sf',
            type: 'numerical',
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
            type: 'numerical',
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
            type: 'multiple',
          },
          {
            key: 'quality',
            translation_key: 'cnv_quality',
            type: 'numerical',
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
            type: 'numerical',
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
            type: 'numerical',
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
