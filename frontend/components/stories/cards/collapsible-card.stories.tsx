import type { Meta, StoryObj } from '@storybook/react';
import { BrowserRouter } from 'react-router-dom';
import CollapsibleCard from '@/components/base/cards/collapsible-card';
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
  title: 'Cards/CollapsibleCard',
  component: CollapsibleCard,
  args: {
    title: 'Header'
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
} satisfies Meta<typeof CollapsibleCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
  },
  render: args => (
    <CollapsibleCard {...args}>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris egestas ornare diam, sed porttitor augue. Etiam mattis lorem id porta iaculis. Proin ac est sed risus blandit ornare vel in erat. Pellentesque dignissim rhoncus placerat. Fusce vulputate condimentum pretium. In non orci vel turpis facilisis interdum vitae rutrum nulla. Vivamus lacus nulla, consequat tincidunt sapien non, volutpat interdum mi. Duis vestibulum odio in placerat mollis. Aliquam iaculis, ante nec sagittis vestibulum, ipsum est sodales ligula, quis vehicula metus velit a urna. Praesent eget tortor ut nisi tempor blandit a eu est. Sed venenatis risus at odio pharetra, eget tincidunt mauris vulputate. Donec non ante at odio auctor sollicitudin. Phasellus eros est, efficitur quis pharetra id, laoreet ac sem. Aliquam semper rhoncus nisi, at hendrerit elit blandit ut. Maecenas nec suscipit purus, non rhoncus leo. Aliquam bibendum enim sem, sed posuere ipsum porta sed.
    </CollapsibleCard>
  ),
};

