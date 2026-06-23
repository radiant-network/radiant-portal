import { useState } from 'react';
import type { Decorator, Meta, StoryObj } from '@storybook/react-vite';
import {
  AudioWaveformIcon,
  BlendIcon,
  BookOpenTextIcon,
  ExternalLink,
  HazeIcon,
  LayoutDashboardIcon,
  LightbulbIcon,
  MailIcon,
  TelescopeIcon,
  UsersIcon,
} from 'lucide-react';
import { fn } from 'storybook/test';

import type { TenantMembership } from '@/api/api';
import EmptyTenant from '@/components/base/empties/empty_tenant';
import MainNavbar from '@/components/base/navbar/main-navbar';
import { SidebarProvider } from '@/components/base/shadcn/sidebar';
import { TenantContext } from '@/components/hooks/use-tenant';

import { StorySection } from '../story-section';

const MOCK_TENANTS: TenantMembership[] = [
  { code: 'CBTN', name: "Children's Brain Tumor Network" },
  { code: 'UDN', name: 'Undiagnosed Diseases Network' },
];

/** Provides a mocked tenant context so the navbar's tenant switcher renders without network calls. */
const withTenants =
  (tenants: TenantMembership[], initialTenant: string): Decorator =>
  Story => {
    const [tenant, setTenant] = useState(initialTenant);
    return (
      <TenantContext.Provider value={{ tenant, tenants, setTenant: async code => setTenant(code) }}>
        <Story />
      </TenantContext.Provider>
    );
  };

const meta = {
  title: 'Layout/Main Navbar',
  component: MainNavbar,
  args: {},
  decorators: [
    Story => (
      <SidebarProvider className="m-[-16px] w-screen">
        <div className="w-screen">
          <Story />
        </div>
      </SidebarProvider>
    ),
  ],
} satisfies Meta<typeof MainNavbar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const MultiTenant: Story = {
  args: {
    placement: 'top',
    onLogoutClick: fn(),
    logo: <HazeIcon size={36} className="max-w-full text-primary" />,
    className: 'w-full',
    links: [
      {
        title: 'Dashboard',
        icon: <LayoutDashboardIcon />,
        as: 'button',
      },
      {
        title: 'Studies',
        icon: <BookOpenTextIcon />,
        as: 'a',
        href: 'https://google.com',
      },
      {
        title: 'Data Exploration',
        icon: <TelescopeIcon />,
        as: 'a',
        href: 'https://google.com',
      },
      {
        title: 'Variants',
        icon: <AudioWaveformIcon />,
        as: 'a',
        href: 'https://google.com',
      },
      {
        title: 'Analysis',
        icon: <BlendIcon />,
        as: 'a',
        href: 'https://google.com',
      },
    ],
    actions: [
      {
        title: 'Community',
        icon: <UsersIcon />,
        as: 'button',
      },
      {
        title: 'Resources',
        icon: <LightbulbIcon />,
        as: 'button',
        subItems: [
          {
            title: 'Website',
            icon: <ExternalLink />,
            as: 'a',
            href: 'https://google.com',
          },
          {
            title: 'Documentation',
            icon: <ExternalLink />,
            as: 'a',
            href: 'https://google.com',
          },
          {
            separator: true,
          },
          {
            title: 'Contact',
            icon: <MailIcon />,
            as: 'button',
          },
        ],
      },
    ],
    userDetails: {
      id: 'olivier-cp',
      name: 'Olivier CP',
      email: 'olivier.castro-perrier@ssss.gouv.qc.ca',
    },
  },
  decorators: [withTenants(MOCK_TENANTS, 'CBTN')],
  render: args => (
    <StorySection
      title="Main navbar (multi-tenant)"
      description="Resize the window below 768px (or use the Viewport toolbar) to see the mobile navbar."
    >
      <MainNavbar {...args} />
    </StorySection>
  ),
};

export const SingleTenant: Story = {
  args: MultiTenant.args,
  decorators: [withTenants([MOCK_TENANTS[0]], 'CBTN')],
  render: args => (
    <StorySection
      title="Main navbar (single tenant)"
      description="Resize the window below 768px (or use the Viewport toolbar) to see the mobile navbar."
    >
      <MainNavbar {...args} />
    </StorySection>
  ),
};

export const WithoutTenant: Story = {
  args: MultiTenant.args,
  parameters: { layout: 'fullscreen' },
  render: () => <EmptyTenant />,
};
