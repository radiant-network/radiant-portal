import { BrowserRouter } from 'react-router';
import type { Meta, StoryObj } from '@storybook/react-vite';

import LibreChatDavid from '@/components/base/librechat-david/librechat-david';

import { StorySection } from '../story-section';

const meta = {
  title: 'Components/Buttons/LibreChat David',
  component: LibreChatDavid,
  decorators: [
    Story => (
      <BrowserRouter>
        <Story />
      </BrowserRouter>
    ),
  ],
} satisfies Meta<typeof LibreChatDavid>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <StorySection title="Default">
      <LibreChatDavid demoMode />
    </StorySection>
  ),
};

export const Disabled: Story = {
  render: () => (
    <StorySection title="Disabled">
      <LibreChatDavid demoMode disabled />
    </StorySection>
  ),
};

export const Loading: Story = {
  render: () => (
    <StorySection title="Loading">
      <LibreChatDavid demoMode loading />
    </StorySection>
  ),
};
