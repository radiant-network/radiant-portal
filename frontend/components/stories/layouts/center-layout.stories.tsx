import logoLight from '@assets/logo/header-full.svg';
import logoDark from '@assets/logo/header-full-dark.svg';
import type { Meta, StoryObj } from '@storybook/react-vite';

import CenterLayout from '@/components/base/layouts/center-layout';
import RadiantBackground from '@/components/base/layouts/radiant-background';

import { StorySection } from '../story-section';

import SignInForm from './sign-in-form';

const logo = (
  <>
    <img src={logoLight} alt="Logo" className="dark:hidden" />
    <img src={logoDark} alt="Logo" className="hidden dark:block" />
  </>
);

const logoWhite = <img src={logoLight} alt="Logo" className="brightness-0 invert" />;

const meta = {
  title: 'Layout/Center layout',
  component: CenterLayout,
} satisfies Meta<typeof CenterLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    logo,
    children: <span className="text-muted-foreground">Replace with content</span>,
  },
  render: args => (
    <StorySection title="Default">
      <CenterLayout {...args} />
    </StorySection>
  ),
};

export const WithBackground: Story = {
  args: {
    logo: logoWhite,
    background: <RadiantBackground />,
    children: <span className="text-muted-foreground">Replace with content</span>,
  },
  render: args => (
    <StorySection title="With background">
      <CenterLayout {...args} />
    </StorySection>
  ),
};

export const WithSignInForm: Story = {
  args: {
    logo: logoWhite,
    background: <RadiantBackground />,
    children: <SignInForm className="rounded-xl border bg-background p-6" />,
  },
  render: args => (
    <StorySection title="With sign-in form">
      <CenterLayout {...args} />
    </StorySection>
  ),
};
