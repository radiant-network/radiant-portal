import logoLight from '@assets/logo/header-full.svg';
import logoDark from '@assets/logo/header-full-dark.svg';
import logoWhiteUrl from '@assets/logo/header-full-white.svg';
import type { Meta, StoryObj } from '@storybook/react-vite';

import CenterLayout from '@/components/base/layouts/center-layout';
import RadiantBackground from '@/components/base/layouts/radiant-background';
import NavbarLangSwitcher from '@/components/base/navbar/main-navbar-lang-switcher';

import { StorySection } from '../story-section';

import SignInForm from './sign-in-form';

const logo = (
  <>
    <img src={logoLight} alt="Logo" className="dark:hidden" />
    <img src={logoDark} alt="Logo" className="hidden dark:block" />
  </>
);

const logoWhite = <img src={logoWhiteUrl} alt="Logo" />;

const meta = {
  title: 'Layout/Center layout',
  component: CenterLayout,
} satisfies Meta<typeof CenterLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    logo,
    langSwitcher: <NavbarLangSwitcher />,
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
    langSwitcher: <NavbarLangSwitcher className="text-white hover:bg-white/10 hover:text-white" />,
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
    langSwitcher: <NavbarLangSwitcher className="text-white hover:bg-white/10 hover:text-white" />,
    background: <RadiantBackground />,
    children: <SignInForm className="rounded-xl border bg-background p-6" />,
  },
  render: args => (
    <StorySection title="With sign-in form" description="Sign in form is mocked without translation.">
      <CenterLayout {...args} />
    </StorySection>
  ),
};

export const WithoutLogoAndSwitcher: Story = {
  args: {
    children: <span className="text-muted-foreground">Replace with content</span>,
  },
  render: args => (
    <StorySection title="Without logo and switcher">
      <CenterLayout {...args} />
    </StorySection>
  ),
};
