import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
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

import MainNavbar from '@/components/base/navbar/main-navbar';
import { SidebarProvider } from '@/components/base/shadcn/sidebar';

const meta = {
  title: 'Navbar/Main Navbar',
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

export const Default: Story = {
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
      name: 'Olivier CP',
      email: 'olivier.castro-perrier@ssss.gouv.qc.ca',
    },
  },
  render: args => <MainNavbar {...args} />,
};
