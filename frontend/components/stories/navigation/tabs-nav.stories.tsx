import TabsNav, { TabsNavItem } from '@/components/base/navigation/tabs-nav/tabs-nav';
import type { Meta, StoryObj } from '@storybook/react';
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
        <TabsNavItem value={Tabs.Tab1}>Tab 1</TabsNavItem>
        <TabsNavItem value={Tabs.Tab2}>Tab 2</TabsNavItem>
        <TabsNavItem value={Tabs.Tab3}>Tab 3</TabsNavItem>
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
        <TabsNavItem value={Tabs.Tab1}>Tab 1</TabsNavItem>
        <TabsNavItem value={Tabs.Tab2} disabled>
          Tab 2
        </TabsNavItem>
        <TabsNavItem value={Tabs.Tab3} disabled>
          Tab 3
        </TabsNavItem>
      </TabsNav>
    );
  },
};
