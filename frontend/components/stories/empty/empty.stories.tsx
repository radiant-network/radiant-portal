import type { Meta, StoryObj } from '@storybook/react-vite';
import { Dna } from 'lucide-react';

import Empty from '@/components/base/empty';

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
  render: args => <Empty {...args} />,
};

export const ChartGrid: Story = {
  args: {
    title: 'Optional Header',
    description: 'No data message',
    size: 'default',
    iconType: 'chartGrid',
  },
  render: args => <Empty {...args} />,
};

export const CustomIcon: Story = {
  args: {
    title: 'Optional Header',
    description: 'No data message',
    size: 'default',
    iconType: 'custom',
    icon: Dna,
  },
  render: args => <Empty {...args} />,
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
  render: args => <Empty {...args} />,
};
