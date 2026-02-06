import { BrowserRouter } from 'react-router-dom';
import type { Meta, StoryObj } from '@storybook/react-vite';

import RelationshipToProbandField from '@/components/base/information/relationship-to-proband-field';
import { ApplicationId, ConfigProvider, PortalConfig } from '@/components/cores/applications-config';

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
  title: 'Informations/RelationshipToProbandField',
  component: RelationshipToProbandField,
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
} satisfies Meta<typeof RelationshipToProbandField>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      {['proband', 'mother', 'father', 'sister', 'brother', 'sibling'].map(relationship => (
        <RelationshipToProbandField key={relationship} relationship={relationship} />
      ))}
    </div>
  ),
};
