import type { Meta, StoryObj } from '@storybook/react';
import { BrowserRouter } from 'react-router-dom';
import AnalysisTypeCodeBadge, { AnalysisTypeCode } from '@/components/base/badges/analysis-type-code-badge';
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
  title: 'Data-Display/Badge/AnalysisTypeCodeBadge',
  component: AnalysisTypeCodeBadge,
  args: {
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
} satisfies Meta<typeof AnalysisTypeCodeBadge>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
  render: args => (
    <div className='flex gap-2'>
      {['somatic', 'germline', 'germline_family'].map((code) => (
        <AnalysisTypeCodeBadge code={code as AnalysisTypeCode} />
      ))}
    </div>
  ),
};

