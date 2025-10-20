import { BrowserRouter } from 'react-router-dom';
import type { Meta, StoryObj } from '@storybook/react';

import InformationField from '@/components/base/information/information-field';
import { ApplicationId, ConfigProvider, PortalConfig } from '@/components/model/applications-config';

const config: PortalConfig = {
  variant_entity: {
    app_id: ApplicationId.variant_entity,
  },
  snv_occurrence: {
    app_id: ApplicationId.snv_occurrence,
    aggregations: [] as any,
  },
  cnv_occurrence: {
    app_id: ApplicationId.cnv_occurrence,
    aggregations: [] as any,
  },
  admin: {
    admin_code: 'admin',
    app_id: ApplicationId.admin,
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
