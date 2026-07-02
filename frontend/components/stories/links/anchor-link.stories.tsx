import type { Meta, StoryObj } from '@storybook/react-vite';

import AnchorLink from '@/components/base/navigation/anchor-link';

import { StorySection, StoryShowcase } from '../story-section';

import { anchorLinkSizes, anchorLinkVariants } from './utils';

const meta = {
  title: 'Components/Links/Anchor Link',
  component: AnchorLink,
  argTypes: {
    size: {
      options: anchorLinkSizes,
      control: {
        type: 'select',
      },
    },
    variant: {
      options: anchorLinkVariants,
      control: {
        type: 'select',
      },
    },
  },
  args: {
    external: true,
    size: 'default',
    variant: 'primary',
    mono: false,
  },
} satisfies Meta<typeof AnchorLink>;

export default meta;

type Story = StoryObj<typeof meta>;

export const AllVariants: Story = {
  render: () => (
    <StoryShowcase>
      <StorySection title="Default">
        <AnchorLink external>Anchor Link</AnchorLink>
      </StorySection>

      <StorySection title="Secondary">
        <AnchorLink external variant="secondary">
          Anchor Link
        </AnchorLink>
      </StorySection>

      <StorySection title="White (on a dark surface)">
        <div className="rounded-md bg-slate-900 p-4">
          <AnchorLink external variant="white">
            Anchor Link
          </AnchorLink>
        </div>
      </StorySection>

      <StorySection title="Mono">
        <AnchorLink external mono>
          Anchor Link
        </AnchorLink>
      </StorySection>
    </StoryShowcase>
  ),
};
