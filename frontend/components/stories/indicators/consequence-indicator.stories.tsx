import { BrowserRouter } from 'react-router-dom';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { SavedFilterType, VepImpact } from '@/api/api';
import ConsequenceIndicator from '@/components/base/indicators/consequence-indicator';
import { ApplicationId, ConfigProvider, PortalConfig } from '@/components/cores/applications-config';

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
  title: 'Indicators/ConsequenceIndicator',
  component: ConsequenceIndicator,
  args: { consequence: 'missense_variant', vepImpact: VepImpact.MODERATE },
  decorators: [
    Story => (
      <BrowserRouter>
        <ConfigProvider config={config}>
          <Story />
        </ConfigProvider>
      </BrowserRouter>
    ),
  ],
} satisfies Meta<typeof ConsequenceIndicator>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      {Object.keys(VepImpact).map(impact => (
        <>
          <ConsequenceIndicator size="sm" vepImpact={impact as VepImpact} consequence={`consequence-${impact}`} />
          <ConsequenceIndicator size="lg" vepImpact={impact as VepImpact} consequence={`consequence-${impact}`} />
        </>
      ))}
    </div>
  ),
};
