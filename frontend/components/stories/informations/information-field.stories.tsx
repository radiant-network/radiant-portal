import { BrowserRouter } from 'react-router-dom';
import type { Meta, StoryObj } from '@storybook/react';

import InformationField from '@/components/base/information/information-field';
import { ConfigProvider, PortalConfig } from '@/components/model/applications-config';

const config: PortalConfig = {
  variant_entity: {
    app_id: 'variant_entity',
  },
  variant_exploration: {
    app_id: 'variant_exploration_multi_select_filter',
    aggregations: [] as any,
  },
  admin: {
    admin_code: 'admin',
    app_id: 'admin',
  },
  portal: {
    name: '',
    navigation: {},
  },
};

const meta = {
  title: 'Informations/InformationField',
  component: InformationField,
  args: {},
  decorators: [
    Story => (
      <BrowserRouter>
        <ConfigProvider config={config}>
          <Story />
        </ConfigProvider>
      </BrowserRouter>
    ),
  ],
} satisfies Meta<typeof InformationField>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Label',
  },
  render: args => <InformationField {...args}>InformationField</InformationField>,
};

export const WithLabelTooltip: Story = {
  args: {
    label: 'Label',
    labelTooltipText: 'Label Tooltip',
  },
  render: args => <InformationField {...args}>InformationField</InformationField>,
};

export const WithTooltipText: Story = {
  args: {
    label: 'Label',
    tooltipText: 'Tooltip Text',
  },
  render: args => <InformationField {...args}>InformationField</InformationField>,
};

export const WithLabelAndTooltipText: Story = {
  args: {
    label: 'Label',
    labelTooltipText: 'Label Tooltip',
    tooltipText: 'Tooltip Text',
  },
  render: args => <InformationField {...args}>InformationField</InformationField>,
};

export const Empty: Story = {
  args: {
    label: 'Label',
  },
  render: args => <InformationField {...args}>{undefined}</InformationField>,
};
