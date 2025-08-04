import type { Meta, StoryObj } from '@storybook/react';
import { BrowserRouter } from 'react-router-dom';
import AssayStatusBadge, { AssayStatus } from '@/components/base/badges/assay-status-badge';
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
  title: 'Badges/Assay Status Badge',
  component: AssayStatusBadge,
  args: {
    status: 'draft',
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
} satisfies Meta<typeof AssayStatusBadge>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
  render: args => (
    <div className="flex gap-2">
      {['draft', 'on-hold', 'revoke', 'active', 'completed', 'incomplete'].map(status => (
        <AssayStatusBadge status={status as AssayStatus} />
      ))}
    </div>
  ),
};
