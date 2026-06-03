// @ts-nocheck
import { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { TestTubeDiagonalIcon } from 'lucide-react';

import ChecboxFilter from '@/components/base/checkboxes/checkbox-filter';
import { ApplicationId, ConfigProvider, PortalConfig } from '@/components/cores/applications-config';

import { StoryLabel, StorySection } from '../story-section';

const config: PortalConfig = {
  variant_entity: {
    app_id: ApplicationId.variant_entity,
  },
  germline_snv_occurrence: {
    app_id: ApplicationId.germline_snv_occurrence,
    aggregations: [] as any,
  },
  germline_cnv_occurrence: {
    app_id: ApplicationId.germline_cnv_occurrence,
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
  title: 'Components/Inputs/Checkbox Filter',
  component: ChecboxFilter,
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
} satisfies Meta<typeof ChecboxFilter>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Sizes: Story = {
  args: {
    label: 'Loremp ipsum',
  },
  render: args => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [checked, setChecked] = useState<string[]>([]);
    const handleOnCheckedChange = (id: string) => (value: boolean) => {
      if (value) {
        setChecked([...checked, id]);
        return;
      }
      setChecked(checked.filter(c => c !== id));
    };

    return (
      <StorySection title="Sizes">
        {['default', 'xs', 'sm', 'md', 'lg'].map(size => (
          <div key={size} className="flex flex-col gap-3">
            <StoryLabel>{size}</StoryLabel>
            <ChecboxFilter
              {...args}
              size={size}
              checked={checked.includes(`${size}-ck1`)}
              onCheckedChange={handleOnCheckedChange(`${size}-ck1`)}
            />
            <ChecboxFilter
              {...args}
              size={size}
              count={100}
              checked={checked.includes(`${size}-ck2`)}
              onCheckedChange={handleOnCheckedChange(`${size}-ck2`)}
            />
            <ChecboxFilter
              {...args}
              size={size}
              count={100}
              description="Loremp ipsum"
              checked={checked.includes(`${size}-ck3`)}
              onCheckedChange={handleOnCheckedChange(`${size}-ck3`)}
            />
            <ChecboxFilter
              {...args}
              size={size}
              count={100}
              description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. "
              checked={checked.includes(`${size}-ck4`)}
              onCheckedChange={handleOnCheckedChange(`${size}-ck4`)}
            />
            <ChecboxFilter
              {...args}
              size={size}
              icon={<TestTubeDiagonalIcon />}
              checked={checked.includes(`${size}-ck5`)}
              onCheckedChange={handleOnCheckedChange(`${size}-ck5`)}
            />
            <ChecboxFilter
              {...args}
              size={size}
              icon={<TestTubeDiagonalIcon />}
              count={100}
              checked={checked.includes(`${size}-ck6`)}
              onCheckedChange={handleOnCheckedChange(`${size}-ck6`)}
            />
            <ChecboxFilter
              {...args}
              size={size}
              icon={<TestTubeDiagonalIcon />}
              count={100}
              description="Loremp ipsum"
              checked={checked.includes(`${size}-ck7`)}
              onCheckedChange={handleOnCheckedChange(`${size}-ck7`)}
            />
            <ChecboxFilter
              {...args}
              size={size}
              icon={<TestTubeDiagonalIcon />}
              count={100}
              description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. "
              checked={checked.includes(`${size}-ck8`)}
              onCheckedChange={handleOnCheckedChange(`${size}-ck8`)}
            />
            <ChecboxFilter
              {...args}
              label="Lorem ipsum dolor sit amet, consectetur adipiscing elit. "
              size={size}
              icon={<TestTubeDiagonalIcon />}
              count={100}
              description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. "
              checked={checked.includes(`${size}-ck9`)}
              onCheckedChange={handleOnCheckedChange(`${size}-ck9`)}
            />
          </div>
        ))}
      </StorySection>
    );
  },
};

export const Fluid: Story = {
  args: {
    label: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor',
  },
  render: args => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [checked, setChecked] = useState<string[]>([]);
    const handleOnCheckedChange = (id: string) => (value: boolean) => {
      if (value) {
        setChecked([...checked, id]);
        return;
      }
      setChecked(checked.filter(c => c !== id));
    };

    return (
      <StorySection title="Fluid">
        <div className="flex w-[480px] flex-col gap-6 rounded-md border p-4">
          <div className="flex flex-col gap-3">
            <StoryLabel>Default (width capped at 228px)</StoryLabel>
            <ChecboxFilter
              {...args}
              size="sm"
              count={1234}
              description="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
              checked={checked.includes('capped')}
              onCheckedChange={handleOnCheckedChange('capped')}
            />
          </div>
          <div className="flex flex-col gap-3">
            <StoryLabel>Fluid (fills the container)</StoryLabel>
            <ChecboxFilter
              {...args}
              fluid
              size="sm"
              count={1234}
              description="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
              checked={checked.includes('fluid')}
              onCheckedChange={handleOnCheckedChange('fluid')}
            />
          </div>
        </div>
      </StorySection>
    );
  },
};
