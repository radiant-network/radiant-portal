import { BrowserRouter } from 'react-router-dom';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { SavedFilterType } from '@/api/api';
import InformationField from '@/components/base/information/information-field';
import { ApplicationId, ConfigProvider, PortalConfig } from '@/components/cores/applications-config';

import { StorySection, StoryShowcase } from '../story-section';

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
  title: 'Features/Informations/Information Field',
  component: InformationField,
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
} satisfies Meta<typeof InformationField>;

export default meta;

type Story = StoryObj<typeof meta>;

export const AllVariants: Story = {
  args: { label: 'Label' },
  render: () => (
    <StoryShowcase>
      <StorySection title="Default">
        <InformationField label="Label">InformationField</InformationField>
      </StorySection>

      <StorySection title="With label tooltip">
        <InformationField label="Label" labelTooltipText="Label Tooltip">
          InformationField
        </InformationField>
      </StorySection>

      <StorySection title="With tooltip text">
        <InformationField label="Label" tooltipText="Tooltip Text">
          InformationField
        </InformationField>
      </StorySection>

      <StorySection title="With label & tooltip text">
        <InformationField label="Label" labelTooltipText="Label Tooltip" tooltipText="Tooltip Text">
          InformationField
        </InformationField>
      </StorySection>

      <StorySection title="Empty">
        <InformationField label="Label">{undefined}</InformationField>
      </StorySection>
    </StoryShowcase>
  ),
};
