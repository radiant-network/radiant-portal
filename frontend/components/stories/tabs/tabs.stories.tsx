import type { Meta, StoryObj } from '@storybook/react-vite';
import { BookDown, KeyRound, User } from 'lucide-react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/base/shadcn/tabs';

import { StoryLabel, StorySection, StoryShowcase } from '../story-section';

const meta = {
  title: 'Components/Tabs/Tabs',
  component: Tabs,
  args: {
    defaultValue: 'account',
  },
} satisfies Meta<typeof Tabs>;

export default meta;

type Story = StoryObj<typeof meta>;

const tabsVariants = ['default', 'primary'] as const;

export const Variants: Story = {
  render: args => (
    <StoryShowcase direction="row">
      {tabsVariants.map(variant => (
        <StorySection key={variant} title={variant === 'default' ? 'Default' : 'Primary'} className="flex-1">
          <div className="flex flex-col gap-2 w-full">
            <StoryLabel>Basic</StoryLabel>
            <Tabs {...args} variant={variant}>
              <TabsList>
                <TabsTrigger value="account">Account</TabsTrigger>
                <TabsTrigger value="password">Password</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
              </TabsList>
              <TabsContent value="account" className="bg-muted px-3 py-2 rounded-md">
                Account settings content.
              </TabsContent>
              <TabsContent value="password" className="bg-muted px-3 py-2 rounded-md">
                Password settings content.
              </TabsContent>
              <TabsContent value="notifications" className="bg-muted px-3 py-2 rounded-md">
                Notifications settings content.
              </TabsContent>
            </Tabs>
          </div>

          <div className="flex flex-col gap-2">
            <StoryLabel>With icons</StoryLabel>
            <Tabs {...args} variant={variant}>
              <TabsList>
                <TabsTrigger value="account">
                  <User />
                  Account
                </TabsTrigger>
                <TabsTrigger value="password">
                  <KeyRound />
                  Password
                </TabsTrigger>
                <TabsTrigger value="notifications">
                  <BookDown />
                  Notifications
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="flex flex-col gap-2">
            <StoryLabel>Vertical orientation</StoryLabel>
            <Tabs {...args} variant={variant} orientation="vertical">
              <TabsList>
                <TabsTrigger value="account">Account</TabsTrigger>
                <TabsTrigger value="password">Password</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="flex flex-col gap-2">
            <StoryLabel>Active and inactive disabled</StoryLabel>
            <Tabs {...args} variant={variant}>
              <TabsList>
                <TabsTrigger value="account" disabled>
                  Account
                </TabsTrigger>
                <TabsTrigger value="password" disabled>
                  Password
                </TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </StorySection>
      ))}
    </StoryShowcase>
  ),
};
