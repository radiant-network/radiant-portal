import { BrowserRouter } from 'react-router-dom';
import type { Meta, StoryObj } from '@storybook/react';

import UploadIdModal from '@/components/base/modals/upload-id-modal';
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
  title: 'Modals/UploadIdModal',
  component: UploadIdModal,
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
} satisfies Meta<typeof UploadIdModal>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    variant: 'gene',
  },
  render: args => <UploadIdModal {...args} />,
};
