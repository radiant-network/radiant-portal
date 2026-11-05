import { createMemoryRouter, RouterProvider } from 'react-router';
import type { Meta, StoryObj } from '@storybook/react-vite';

import LibrechatButton from '@/components/base/librechat/librechat-button';

import { StorySection } from '../story-section';

const meta = {
  title: 'Components/Buttons/Librechat Button',
  component: LibrechatButton,
  decorators: [
    Story => {
      const router = createMemoryRouter([
        {
          id: 'root',
          path: '/',
          loader: () => ({ runtimeConfig: { librechatDavidUrl: 'https://example.com/librechat' } }),
          Component: Story,
        },
      ]);
      return <RouterProvider router={router} />;
    },
  ],
} satisfies Meta<typeof LibrechatButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <StorySection title="Default">
      <LibrechatButton demoMode />
    </StorySection>
  ),
};

export const Disabled: Story = {
  render: () => (
    <StorySection title="Disabled">
      <LibrechatButton demoMode disabled />
    </StorySection>
  ),
};

export const Loading: Story = {
  render: () => (
    <StorySection title="Loading">
      <LibrechatButton demoMode loading />
    </StorySection>
  ),
};
