import { BrowserRouter } from 'react-router-dom'
import type { Meta, StoryObj } from '@storybook/react';
import PageHeader from '@/components/base/headers/page-header';
import { Users } from 'lucide-react';

const meta = {
  title: 'data-display/Page-Header',
  component: PageHeader,
  args: {},
} satisfies Meta<typeof PageHeader>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Loading: Story = {
  args: {},
  render: () => {
    return (
      <PageHeader />
    );
  },
};


export const Default: Story = {
  args: {
    isLoading: false,
    breadcrumbs: [
      { to: '#', text: 'Level 1' },
    ],
    title: 'Title',
    badges: [
      {
        variant: "secondary",
        children: <><Users />Icon</>
      }, {
        variant: "outline",
        children: <>outline</>
      }
    ],
    buttons: [
      {
        children: 'primary',
      },
      {
        variant: 'secondary',
        children: 'Secondary',
      }
    ],
    description: 'Optional description text…'
  },
  render: (args) => {
    return (
      <BrowserRouter>
        <PageHeader {...args} />
      </BrowserRouter>
    );
  },
};

