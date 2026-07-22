import type { Meta, StoryObj } from '@storybook/react-vite';
import { FileText, Home, Search, Settings, Users } from 'lucide-react';

import { SidebarGroups } from '@/components/base/query-builder/facets/sidebar-groups';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarSeparator,
} from '@/components/base/shadcn/sidebar';
import { AggregationConfig } from '@/components/cores/applications-config';

import { StorySection, StoryShowcase } from '../story-section';

const items = [
  { title: 'Home', icon: Home, active: true },
  { title: 'Explore', icon: Search },
  { title: 'Cases', icon: FileText },
  { title: 'Community', icon: Users },
];

const aggregationGroups: AggregationConfig = {
  variant: { items: [] },
  gene: { items: [] },
  frequency: { items: [] },
  occurrence: { items: [] },
  metric_qc: { items: [] },
};

function SidebarDemo({ brand = false }: { brand?: boolean }) {
  return (
    <SidebarProvider className="min-h-0 w-48">
      <Sidebar brand={brand} collapsible="none" className="h-full rounded-lg border border-sidebar-border">
        <SidebarHeader>
          <span className="px-2 text-sm font-semibold">Radiant</span>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarMenu>
              {items.map(item => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton isActive={item.active} tooltip={item.title}>
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
          <SidebarSeparator />
          <SidebarGroup>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Settings">
                  <Settings />
                  <span>Settings</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  );
}

const meta = {
  title: 'Layout/Sidebar',
  component: SidebarDemo,
  args: { brand: false },
} satisfies Meta<typeof SidebarDemo>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <StoryShowcase direction="row">
      <StorySection title="Default" description="brand={false}">
        <SidebarDemo brand={false} />
      </StorySection>
      <StorySection title="Brand" description="brand">
        <SidebarDemo brand />
      </StorySection>
    </StoryShowcase>
  ),
};

export const Groups: Story = {
  name: 'Sidebar Groups',
  render: () => (
    <StoryShowcase direction="row">
      <StorySection title="Default" description="brand={false}">
        <SidebarProvider className="w-50">
          <div className="w-50">
            <SidebarGroups aggregationGroups={aggregationGroups} brand={false} />
          </div>
        </SidebarProvider>
      </StorySection>
      <StorySection title="Brand" description="brand">
        <SidebarProvider className="w-50">
          <div className="w-50">
            <SidebarGroups aggregationGroups={aggregationGroups} brand />
          </div>
        </SidebarProvider>
      </StorySection>
    </StoryShowcase>
  ),
};
