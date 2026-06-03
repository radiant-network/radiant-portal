import { BrowserRouter } from 'react-router-dom';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Users } from 'lucide-react';

import PageHeader from '@/components/base/page/page-header';

import { StorySection } from '../story-section';

const meta = {
  title: 'Layout/Page Header',
  component: PageHeader,
  args: {},
} satisfies Meta<typeof PageHeader>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Loading: Story = {
  args: {},
  render: () => (
    <StorySection title="Loading">
      <div className="w-full">
        <PageHeader />
      </div>
    </StorySection>
  ),
};

export const Default: Story = {
  args: {
    isLoading: false,
    title: 'Title',
    badges: [
      {
        variant: 'secondary',
        children: (
          <>
            <Users />
            Icon
          </>
        ),
      },
      {
        variant: 'outline',
        children: <>outline</>,
      },
    ],
    buttons: [
      {
        children: 'primary',
      },
      {
        variant: 'secondary',
        children: 'Secondary',
      },
    ],
    description: 'Optional description text…',
  },
  render: args => (
    <StorySection title="Default">
      <BrowserRouter>
        <div className="w-full">
          <PageHeader {...args} />
        </div>
      </BrowserRouter>
    </StorySection>
  ),
};
