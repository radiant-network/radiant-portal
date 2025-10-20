import { BrowserRouter } from 'react-router-dom';
import type { Meta, StoryObj } from '@storybook/react';

import AnalysisTypeCodeBadge, { AnalysisTypeCode } from '@/components/base/badges/analysis-type-code-badge';
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
  title: 'Badges/Analysis Type Code Badge',
  component: AnalysisTypeCodeBadge,
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
} satisfies Meta<typeof AnalysisTypeCodeBadge>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
  render: args => (
    <div className="flex gap-2">
      {['somatic', 'germline', 'germline_family'].map(code => (
        <AnalysisTypeCodeBadge code={code as AnalysisTypeCode} />
      ))}
    </div>
  ),
};
