import AnchorLink from '@/components/base/navigation/anchor-link';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { anchorLinkSizes, anchorLinkVariants } from './utils';

const meta = {
  title: 'Links/AnchorLink',
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

export const Default: Story = {
  args: {},
  render: args => {
    return <AnchorLink {...args}>Anchor Link</AnchorLink>;
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
  },
  render: args => {
    return <AnchorLink {...args}>Anchor Link</AnchorLink>;
  },
};

export const Mono: Story = {
  args: {
    mono: true,
  },
  render: args => {
    return <AnchorLink {...args}>Anchor Link</AnchorLink>;
  },
};
