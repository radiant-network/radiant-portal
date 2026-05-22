import type { Meta, StoryObj } from '@storybook/react-vite';
import { BookDown, KeyRound, User } from 'lucide-react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/base/shadcn/tabs';

const meta = {
  title: 'Tabs/Tabs',
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
    <div className="flex flex-row gap-12">
      {tabsVariants.map(variant => (
        <div key={variant} className="flex flex-1 flex-col gap-4">
          <span className="text-muted-foreground text-sm uppercase">{variant}</span>
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
          <span className="text-muted-foreground text-xs">Tabs with icons</span>
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
          <span className="text-muted-foreground text-xs">Orientation vertical</span>
          <Tabs {...args} variant={variant} orientation="vertical">
            <TabsList>
              <TabsTrigger value="account">Account</TabsTrigger>
              <TabsTrigger value="password">Password</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
            </TabsList>
          </Tabs>
          <span className="text-muted-foreground text-xs">Active and inactive disabled</span>
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
      ))}
    </div>
  ),
};
