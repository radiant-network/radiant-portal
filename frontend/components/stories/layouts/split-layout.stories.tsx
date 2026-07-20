import logoLight from '@assets/logo/header-full.svg';
import logoDark from '@assets/logo/header-full-dark.svg';
import type { Meta, StoryObj } from '@storybook/react-vite';

import SplitLayout from '@/components/base/layouts/split-layout';

import { StorySection } from '../story-section';

import layoutPicture from './layoutPicture.jpeg';
import SignInForm from './sign-in-form';

const logo = (
  <>
    <img src={logoLight} alt="Logo" className="dark:hidden" />
    <img src={logoDark} alt="Logo" className="hidden dark:block" />
  </>
);

const meta = {
  title: 'Layout/Split layout',
  component: SplitLayout,
} satisfies Meta<typeof SplitLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    logo,
    children: <span className="text-muted-foreground">Replace with content</span>,
  },
  render: args => (
    <StorySection title="Default">
      <SplitLayout {...args} />
    </StorySection>
  ),
};

export const WithCustomImage: Story = {
  args: {
    logo,
    background: <img src={layoutPicture} alt="" className="size-full object-cover" />,
    children: <span className="text-muted-foreground">Replace with content</span>,
  },
  render: args => (
    <StorySection title="With custom image">
      <SplitLayout {...args} />
    </StorySection>
  ),
};

export const WithSignInForm: Story = {
  args: {
    logo,
    children: <SignInForm />,
  },
  render: args => (
    <StorySection title="With sign-in form">
      <SplitLayout {...args} />
    </StorySection>
  ),
};
