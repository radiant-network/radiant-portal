import type { Meta, StoryObj } from '@storybook/react';
import { BrowserRouter } from 'react-router-dom';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/base/ui/collapsible"
import { ConfigProvider, PortalConfig } from '@/components/model/applications-config';
import { Button } from '@/components/base/ui/button';

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
  title: 'Collapsibles/Collapsible',
  component: Collapsible,
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
} satisfies Meta<typeof Collapsible>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
  render: args => (
    <Collapsible {...args}>
      <CollapsibleTrigger asChild>
        <Button variant='outline'>Trigger</Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="flex flex-col gap-2">
        Content
      </CollapsibleContent>
    </Collapsible>
  ),
};

