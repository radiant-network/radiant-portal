import { BrowserRouter } from 'react-router';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';

import { SavedFilterType } from '@/api/api';
import AnalysisTypeCodeBadge, { type AnalysisTypeCode } from '@/components/base/badges/analysis-type-code-badge';
import { ApplicationId, ConfigProvider, type PortalConfig } from '@/components/cores/applications-config';

import { StoryLabel, StorySection } from '../story-section';

const CODES: AnalysisTypeCode[] = ['somatic', 'germline_family', 'germline'];
const ICON_CLASSES: Record<AnalysisTypeCode, string> = {
  somatic: 'lucide-biohazard',
  germline_family: 'lucide-users',
  germline: 'lucide-user',
};

const getRowIcons = (canvasElement: HTMLElement, rowLabel: string) => {
  const row = within(canvasElement).getByText(rowLabel).parentElement!;
  return Array.from(row.querySelectorAll('svg'));
};

const expectBadges = async (canvasElement: HTMLElement, labels: string[]) => {
  const iconOnly = getRowIcons(canvasElement, 'iconOnly: true');
  const full = getRowIcons(canvasElement, 'iconOnly: false');
  await expect(iconOnly).toHaveLength(CODES.length);
  await expect(full).toHaveLength(CODES.length);

  for (const [index, code] of CODES.entries()) {
    const label = labels[index];

    const iconOnlyBadge = iconOnly[index].parentElement!;
    await expect(iconOnly[index]).toHaveClass(ICON_CLASSES[code]);
    await expect(iconOnlyBadge.querySelector('.sr-only')).toHaveTextContent(label);
    await expect(iconOnlyBadge).toHaveTextContent(label, { normalizeWhitespace: true });
    await expect(iconOnlyBadge.querySelector('[title]')).toBeNull();

    const fullBadge = full[index].parentElement!;
    await expect(full[index]).toHaveClass(ICON_CLASSES[code]);
    const text = within(fullBadge).getByTitle(label);
    await expect(text).toHaveTextContent(label);
    await expect(text).toBeVisible();
  }
};

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
  title: 'Components/Badges/Analysis Type Code Badge',
  component: AnalysisTypeCodeBadge,
  tags: ['vitest'],
  args: {},
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/M3a1OAyS6U9dcPIIRROOqN/Cases-List?node-id=546-98256',
    },
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
} satisfies Meta<typeof AnalysisTypeCodeBadge>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { code: 'somatic' as AnalysisTypeCode },
  render: _args => (
    <StorySection title="Default">
      <div className="space-y-2">
        <StoryLabel>iconOnly: true</StoryLabel>
        <div className="flex gap-2">
          {CODES.map(code => (
            <AnalysisTypeCodeBadge key={code} code={code} iconOnly />
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <StoryLabel>iconOnly: false</StoryLabel>
        <div className="flex gap-2">
          {CODES.map(code => (
            <AnalysisTypeCodeBadge key={code} code={code} />
          ))}
        </div>
      </div>
    </StorySection>
  ),
  play: async ({ canvasElement }) => {
    await expectBadges(canvasElement, ['Somatic', 'Family germline', 'Solo germline']);
  },
};

export const French: Story = {
  ...Default,
  globals: { locale: 'fr' },
  play: async ({ canvasElement }) => {
    await expectBadges(canvasElement, ['Somatique', 'Germinal familial', 'Germinal solo']);
  },
};

export const IconOnlyTooltip: Story = {
  args: { code: 'germline_family', iconOnly: true },
  parameters: { screenshot: false },
  render: args => (
    <StorySection title="Icon only tooltip">
      <AnalysisTypeCodeBadge {...args} />
    </StorySection>
  ),
  play: async ({ canvasElement }) => {
    await userEvent.hover(canvasElement.querySelector('svg')!.parentElement!);
    await expect(await within(document.body).findByRole('tooltip')).toHaveTextContent('Family germline');
  },
};

export const Truncated: Story = {
  args: { code: 'germline_family' },
  render: args => (
    <StorySection title="Truncated">
      <div className="w-20">
        <AnalysisTypeCodeBadge {...args} />
      </div>
    </StorySection>
  ),
  play: async ({ canvas }) => {
    const text = await canvas.findByTitle('Family germline');
    await expect(text.scrollWidth).toBeGreaterThan(text.clientWidth);
  },
};

export const IconOnlyTooltipFrench: Story = {
  ...IconOnlyTooltip,
  globals: { locale: 'fr' },
  play: async ({ canvasElement }) => {
    await userEvent.hover(canvasElement.querySelector('svg')!.parentElement!);
    const tooltip = await within(document.body).findByRole('tooltip');
    await waitFor(() => expect(tooltip).toHaveTextContent('Germinal familial'));
  },
};

export const TruncatedFrench: Story = {
  ...Truncated,
  globals: { locale: 'fr' },
  play: async ({ canvas }) => {
    const text = await canvas.findByTitle('Germinal familial');
    await expect(text.scrollWidth).toBeGreaterThan(text.clientWidth);
  },
};
