import TabsNav, { TabsContent, TabsList, TabsListItem } from '@/components/base/navigation/tabs-nav/tabs-nav';
import type { Meta, StoryObj } from '@storybook/react';
import { User } from 'lucide-react';
import { useState } from 'react';

const meta = {
  title: 'Navigation/TabsNav',
  component: TabsNav,
  args: {},
} satisfies Meta<typeof TabsNav>;

export default meta;

type Story = StoryObj<typeof meta>;

enum Tabs {
  Tab1 = 'Tab1',
  Tab2 = 'Tab2',
  Tab3 = 'Tab3',
}

export const Default: Story = {
  args: {},
  render: () => {
    const [value, setValue] = useState<Tabs>(Tabs.Tab1);

    return (
      <TabsNav value={value} onValueChange={setValue}>
        <TabsList>
          <TabsListItem value={Tabs.Tab1}>
            <User /> Tab 1
          </TabsListItem>
          <TabsListItem value={Tabs.Tab2}>Tab 2</TabsListItem>
          <TabsListItem value={Tabs.Tab3}>Tab 3</TabsListItem>
        </TabsList>
        <TabsContent value={Tabs.Tab1}>
          <p>Content for Tab 1</p>
        </TabsContent>
        <TabsContent value={Tabs.Tab2}>
          <p>Content for Tab 2</p>
        </TabsContent>
        <TabsContent value={Tabs.Tab3}>
          <p>Content for Tab 3</p>
        </TabsContent>
      </TabsNav>
    );
  },
};

export const Disabled: Story = {
  args: {},
  render: () => {
    const [value, setValue] = useState<Tabs>(Tabs.Tab1);

    return (
      <TabsNav value={value} onValueChange={setValue}>
        <TabsList>
          <TabsListItem value={Tabs.Tab1}>Tab 1</TabsListItem>
          <TabsListItem value={Tabs.Tab2} disabled>
            Tab 2
          </TabsListItem>
          <TabsListItem value={Tabs.Tab3} disabled>
            Tab 3
          </TabsListItem>
        </TabsList>
        <TabsContent value={Tabs.Tab1}>
          <p>Content for Tab 1</p>
        </TabsContent>
        <TabsContent value={Tabs.Tab2}>
          <p>Content for Tab 2</p>
        </TabsContent>
        <TabsContent value={Tabs.Tab3}>
          <p>Content for Tab 3</p>
        </TabsContent>
      </TabsNav>
    );
  },
};
