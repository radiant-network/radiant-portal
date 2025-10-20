import { BrowserRouter } from 'react-router-dom';
import type { Meta, StoryObj } from '@storybook/react';

import { Button } from '@/components/base/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/base/ui/collapsible';
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
  title: 'Collapsibles/Collapsible',
  component: Collapsible,
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
} satisfies Meta<typeof Collapsible>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
  render: args => (
    <Collapsible {...args}>
      <CollapsibleTrigger asChild>
        <Button variant="outline">Trigger</Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="flex flex-col gap-2">Content</CollapsibleContent>
    </Collapsible>
  ),
};
