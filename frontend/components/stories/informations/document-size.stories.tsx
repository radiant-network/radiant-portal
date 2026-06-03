import { BrowserRouter } from 'react-router-dom';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { SavedFilterType } from '@/api/api';
import DocumentSize from '@/components/base/information/document-size';
import { ApplicationId, ConfigProvider, PortalConfig } from '@/components/cores/applications-config';

import { StorySection } from '../story-section';

const config: PortalConfig = {
  variant_entity: {
    app_id: ApplicationId.variant_entity,
  },
  germline_snv_occurrence: {
    app_id: ApplicationId.germline_snv_occurrence,
    aggregations: [] as any,
    saved_filter_type: SavedFilterType.GERMLINE_SNV_OCCURRENCE,
  },
  germline_cnv_occurrence: {
    app_id: ApplicationId.germline_cnv_occurrence,
    aggregations: [] as any,
    saved_filter_type: SavedFilterType.GERMLINE_CNV_OCCURRENCE,
  },
  somatic_snv_to_occurrence: {
    app_id: ApplicationId.somatic_snv_to_occurrence,
    aggregations: [] as any,
    saved_filter_type: SavedFilterType.SOMATIC_SNV_OCCURRENCE,
  },
  somatic_snv_tn_occurrence: {
    app_id: ApplicationId.somatic_snv_tn_occurrence,
    aggregations: [] as any,
    saved_filter_type: SavedFilterType.SOMATIC_SNV_OCCURRENCE,
  },
  somatic_cnv_to_occurrence: {
    app_id: ApplicationId.somatic_cnv_to_occurrence,
    aggregations: [] as any,
    saved_filter_type: SavedFilterType.SOMATIC_CNV_OCCURRENCE,
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
  title: 'Features/Informations/Document Size Field',
  component: DocumentSize,
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
} satisfies Meta<typeof DocumentSize>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <StorySection title="Document size">
      <div>
        {[1, 10, 1000000, 10000000, 1000000000, 10000000000, 1000000000000, 10000000000000].map(value => (
          <DocumentSize key={value} value={value} />
        ))}
        <DocumentSize value={undefined} />
      </div>
    </StorySection>
  ),
};
