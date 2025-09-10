import { BrowserRouter } from 'react-router-dom';
import type { Meta, StoryObj } from '@storybook/react';

import ConditionalField from '@/components/base/information/conditional-field';
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
  title: 'Informations/ConditionalField',
  component: ConditionalField,
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
} satisfies Meta<typeof ConditionalField>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    condition: true,
    children: <>This Condition is True</>,
  },
  render: args => (
    <div className="flex flex-col gap-6">
      <ConditionalField condition={args.condition}>{args.children}</ConditionalField>
      <ConditionalField condition={false}>{args.children}</ConditionalField>
    </div>
  ),
};
