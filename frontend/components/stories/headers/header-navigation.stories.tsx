import { BrowserRouter } from 'react-router';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Users } from 'lucide-react';

import HeaderNavigation from '@/components/base/navigation/header-navigation';

import { StorySection } from '../story-section';

const meta = {
  title: 'Layout/Header navigation',
  component: HeaderNavigation,
  args: {},
} satisfies Meta<typeof HeaderNavigation>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Loading: Story = {
  args: {},
  render: () => (
    <StorySection title="Loading">
      <div className="w-full">
        <HeaderNavigation />
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
          <HeaderNavigation {...args} />
        </div>
      </BrowserRouter>
    </StorySection>
  ),
};

export const WithBackLink: Story = {
  args: {
    isLoading: false,
    title: 'ID: C8832261',
    backLink: { label: 'Patients', to: '/patient' },
    badges: [
      { variant: 'secondary', children: 'ATRT-SHH' },
      { variant: 'green', children: 'Alive' },
    ],
    description: 'Born 2020 · Male · Children’s Hospital Los Angeles',
  },
  render: args => (
    <StorySection
      title="With back link"
      description="Back link, separator and title on desktop; below the md breakpoint, only the chevron. Resize the window to see the mobile version."
    >
      <BrowserRouter>
        <div className="w-full">
          <HeaderNavigation {...args} />
        </div>
      </BrowserRouter>
    </StorySection>
  ),
};
