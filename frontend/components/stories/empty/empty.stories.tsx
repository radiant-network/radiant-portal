import type { Meta, StoryObj } from '@storybook/react-vite';
import { Dna } from 'lucide-react';

import Empty from '@/components/base/empties/empty';
import FacetFavoritesEmptyImage from '@/components/base/icons/facet-favorites-empty-image';
import { Button } from '@/components/base/shadcn/button';

import { StorySection } from '../story-section';

const meta = {
  title: 'Components/Empty State',
  component: Empty,
  args: {
    showIcon: true,
    bordered: false,
  },
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['mini', 'default', 'inline'],
    },
    iconType: {
      control: { type: 'select' },
      options: ['chartRow', 'chartGrid', 'custom'],
    },
  },
} satisfies Meta<typeof Empty>;

export default meta;

type Story = StoryObj<typeof meta>;

export const ChartRow: Story = {
  args: {
    title: 'Optional Header',
    description: 'No data message',
    size: 'default',
    iconType: 'chartRow',
  },
  render: args => (
    <StorySection title="Chart row">
      <div className="w-full">
        <Empty {...args} />
      </div>
    </StorySection>
  ),
};

export const ChartGrid: Story = {
  args: {
    title: 'Optional Header',
    description: 'No data message',
    size: 'default',
    iconType: 'chartGrid',
  },
  render: args => (
    <StorySection title="Chart grid">
      <div className="w-full">
        <Empty {...args} />
      </div>
    </StorySection>
  ),
};

export const CustomIcon: Story = {
  args: {
    title: 'Optional Header',
    description: 'No data message',
    size: 'default',
    iconType: 'custom',
    icon: Dna,
  },
  render: args => (
    <StorySection title="Custom icon">
      <div className="w-full">
        <Empty {...args} />
      </div>
    </StorySection>
  ),
};

export const WithBorder: Story = {
  args: {
    title: 'Optional Header',
    description: 'No data message',
    size: 'default',
    iconType: 'custom',
    icon: Dna,
    bordered: true,
  },
  render: args => (
    <StorySection title="With border">
      <div className="w-full">
        <Empty {...args} />
      </div>
    </StorySection>
  ),
};

export const Inline: Story = {
  args: {
    description: 'No data message',
    size: 'inline',
    showIcon: false,
  },
  render: args => (
    <StorySection title="Inline">
      <div className="w-full">
        <Empty {...args} />
      </div>
    </StorySection>
  ),
};

export const WithAction: Story = {
  args: {
    title: 'Optional Header',
    description: 'No data message',
    size: 'default',
    iconType: 'custom',
    icon: Dna,
  },
  render: args => (
    <StorySection title="With action">
      <div className="w-full">
        <Empty {...args}>
          <Button size="sm" variant="outline">
            Action
          </Button>
        </Empty>
      </div>
    </StorySection>
  ),
};

export const WithContentTop: Story = {
  args: {
    title: 'Optional Header',
    description: 'No data message',
    size: 'mini',
    showIcon: false,
    contentTop: <FacetFavoritesEmptyImage />,
    classNames: { title: 'text-sm text-sidebar-foreground', description: 'text-sidebar-foreground' },
  },
  render: args => (
    <StorySection title="With content top">
      <div className="w-[280px]">
        <Empty {...args} />
      </div>
    </StorySection>
  ),
};
