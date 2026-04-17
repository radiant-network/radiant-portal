import { BrowserRouter } from 'react-router-dom';
import type { Meta, StoryObj } from '@storybook/react';
import { mocked } from 'storybook/test';

import SliderSomaticOccurrenceSheet from '@/apps/case/src/entity/variants/somatic-occurrence/sliders/slider-somatic-occurrence-sheet';
import { ApplicationId, ConfigProvider, PortalConfig } from '@/components/cores/applications-config';
import { useCaseIdFromParam, useSeqIdFromSearchParam } from '@/utils/helper';

const config: PortalConfig = {
  variant_entity: {
    app_id: ApplicationId.variant_entity,
  },
  germline_snv_occurrence: {
    app_id: ApplicationId.germline_snv_occurrence,
    saved_filter_type: 'germline_snv_occurrence',
    aggregations: {},
  },
  germline_cnv_occurrence: {
    app_id: ApplicationId.germline_cnv_occurrence,
    saved_filter_type: 'germline_cnv_occurrence',
    aggregations: {},
  },
  somatic_snv_to_occurrence: {
    app_id: ApplicationId.somatic_snv_to_occurrence,
    saved_filter_type: 'somatic_snv_occurrence',
    aggregations: {},
  },
  somatic_snv_tn_occurrence: {
    app_id: ApplicationId.somatic_snv_tn_occurrence,
    saved_filter_type: 'somatic_snv_occurrence',
    aggregations: {},
  },
  somatic_cnv_to_occurrence: {
    app_id: ApplicationId.somatic_cnv_to_occurrence,
    saved_filter_type: 'somatic_cnv_occurrence',
    aggregations: {},
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
  title: 'Sliders/Occurrences/Somatic',
  component: SliderSomaticOccurrenceSheet,
  beforeEach: async () => {
    mocked(useCaseIdFromParam).mockReturnValue(1);
    mocked(useSeqIdFromSearchParam).mockReturnValue(1);
  },
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
} satisfies Meta<typeof SliderSomaticOccurrenceSheet>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
  render: args => <SliderSomaticOccurrenceSheet {...args} />,
};
