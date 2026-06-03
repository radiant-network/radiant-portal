import { BrowserRouter } from 'react-router-dom';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { SavedFilterType } from '@/api/api';
import ConditionalField from '@/components/base/information/conditional-field';
import { ApplicationId, ConfigProvider, PortalConfig } from '@/components/cores/applications-config';

import { StoryLabel, StorySection } from '../story-section';

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
  title: 'Features/Informations/Conditional Field',
  component: ConditionalField,
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
} satisfies Meta<typeof ConditionalField>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    condition: true,
    children: <>This Condition is True</>,
  },
  render: args => (
    <StorySection
      title="Conditional field"
      description="Renders its children only when the condition is true; otherwise it shows a placeholder dash."
    >
      <div className="flex gap-4">
        <StoryLabel>condition = {String(args.condition)}</StoryLabel>
        <ConditionalField condition={args.condition}>{args.children}</ConditionalField>
      </div>

      <div className="flex  gap-4">
        <StoryLabel>condition = false</StoryLabel>
        <ConditionalField condition={false}>{args.children}</ConditionalField>
      </div>
    </StorySection>
  ),
};
