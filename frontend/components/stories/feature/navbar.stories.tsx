import { SidebarProvider } from '@/components/base/ui/sidebar';
import MainNavbar from '@/components/feature/navbar/main-navbar';
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
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

const meta = {
  title: 'Feature/Main Navbar',
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
      },
      {
        title: 'Studies',
        icon: <BookOpenTextIcon />,
      },
      {
        title: 'Data Exploration',
        icon: <TelescopeIcon />,
      },
      {
        title: 'Variants',
        icon: <AudioWaveformIcon />,
      },
      {
        title: 'Analysis',
        icon: <BlendIcon />,
      },
    ],
    actions: [
      {
        title: 'Community',
        icon: <UsersIcon />,
      },
      {
        title: 'Resources',
        icon: <LightbulbIcon />,
        subItems: [
          {
            title: 'Website',
            icon: <ExternalLink />,
          },
          {
            title: 'Documentation',
            icon: <ExternalLink />,
          },
          {
            separator: true,
          },
          {
            title: 'Contact',
            icon: <MailIcon />,
          },
        ],
      },
    ],
    userDetails: {
      name: 'Olivier CP',
      email: 'olivier.castro-perrier@ssss.gouv.qc.ca',
    },
  },
  render: args => {
    return <MainNavbar {...args} />;
  },
};
