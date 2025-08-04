import type { Meta, StoryObj } from '@storybook/react';
import Empty from '@/components/base/empty';
import { Dna } from 'lucide-react';

const meta = {
  title: 'Empty/Default',
  component: Empty,
  args: {
    showIcon: true,
    bordered: false,
  },
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['mini', 'default'],
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
  render: args => {
    return <Empty {...args} />;
  },
};

export const ChartGrid: Story = {
  args: {
    title: 'Optional Header',
    description: 'No data message',
    size: 'default',
    iconType: 'chartGrid',
  },
  render: args => {
    return <Empty {...args} />;
  },
};

export const CustomIcon: Story = {
  args: {
    title: 'Optional Header',
    description: 'No data message',
    size: 'default',
    iconType: 'custom',
    icon: Dna,
  },
  render: args => {
    return <Empty {...args} />;
  },
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
  render: args => {
    return <Empty {...args} />;
  },
};
