import { BrowserRouter } from 'react-router-dom';
import type { Meta, StoryObj } from '@storybook/react';

import { VepImpact } from '@/api/api';
import ConsequenceIndicator from '@/components/base/indicators/consequence-indicator';
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
  title: 'Indicators/ConsequenceIndicator',
  component: ConsequenceIndicator,
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
} satisfies Meta<typeof ConsequenceIndicator>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      {Object.keys(VepImpact).map(impact => (
        <>
          <ConsequenceIndicator size="sm" vepImpact={impact as VepImpact} consequence={`consequence-${impact}`} />
          <ConsequenceIndicator size="lg" vepImpact={impact as VepImpact} consequence={`consequence-${impact}`} />
        </>
      ))}
    </div>
  ),
};
