import { BrowserRouter } from 'react-router-dom';
import type { Meta, StoryObj } from '@storybook/react';

import ToggleButtonGroup from '@/components/base/toggle-button-group/toggle-button-group';
import { ApplicationId, ConfigProvider, PortalConfig } from '@/components/cores/applications-config';

import { buttonSizes } from './utils';

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
  title: 'Buttons/ToggleButtonGroup',
  component: ToggleButtonGroup,
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
} satisfies Meta<typeof ToggleButtonGroup>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    defaultValue: 'Button 1',
    onValueChange: (_value: String) => {},
  },
  render: args => (
    <div className="flex flex-col gap-2">
      {buttonSizes.map(size => (
        <ToggleButtonGroup
          key={size}
          size={size}
          {...args}
          items={[
            {
              label: 'Button 1',
              value: 'Button 1',
            },
            {
              label: 'Button 2',
              value: 'Button 2',
            },
          ]}
        />
      ))}
    </div>
  ),
};
