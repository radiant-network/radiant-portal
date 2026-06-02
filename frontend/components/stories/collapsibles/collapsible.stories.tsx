import { BrowserRouter } from 'react-router-dom';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { SavedFilterType } from '@/api/api';
import { Button } from '@/components/base/shadcn/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/base/shadcn/collapsible';
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
  title: 'Components/Collapsibles/Collapsible',
  component: Collapsible,
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
} satisfies Meta<typeof Collapsible>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
  render: args => (
    <Collapsible {...args}>
      <CollapsibleTrigger asChild>
        <Button variant="outline">Trigger</Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="flex flex-col gap-2">Content</CollapsibleContent>
    </Collapsible>
  ),
};
