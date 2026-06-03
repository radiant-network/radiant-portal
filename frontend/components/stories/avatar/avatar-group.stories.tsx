import type { Meta, StoryObj } from '@storybook/react-vite';
import { UserIcon } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarGroup, AvatarGroupCount, AvatarImage } from '@/components/base/shadcn/avatar';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/base/shadcn/hover-card';

import { StoryLabel, StorySection } from '../story-section';

import { avatarSizes } from './utils';

const meta = {
  title: 'Components/Avatars/Avatar Group',
  component: AvatarGroup,
  argTypes: {
    size: {
      options: avatarSizes,
      control: { type: 'select' },
    },
  },
} satisfies Meta<typeof AvatarGroup>;

export default meta;

type Story = StoryObj<typeof meta>;

const IMAGE_SRC = 'https://github.com/shadcn.png';

// Sample members to populate the groups.
const people = [
  { name: 'Charles Nelson', initials: 'CN', color: 'violet' as const },
  { name: 'Alex Bernard', initials: 'AB', color: 'emerald' as const },
  { name: 'Julie Martin', initials: 'JM', color: 'blue' as const },
  { name: 'Sarah Wilson', initials: 'SW', color: 'rose' as const },
  { name: 'David Brown', initials: 'DB', color: 'amber' as const },
];

// Composition examples grouped together — each section keeps its former story title as a label.
export const Variants: Story = {
  render: () => (
    <StorySection title="Variants">
      <div className="space-y-2">
        <StoryLabel>Two avatars</StoryLabel>
        <AvatarGroup size="md">
          {people.slice(0, 2).map(p => (
            <Avatar key={p.initials}>
              <AvatarFallback color={p.color}>{p.initials}</AvatarFallback>
            </Avatar>
          ))}
        </AvatarGroup>
      </div>

      <div className="space-y-2">
        <StoryLabel>With overflow</StoryLabel>
        <AvatarGroup size="md">
          {people.slice(0, 3).map(p => (
            <Avatar key={p.initials}>
              <AvatarFallback color={p.color}>{p.initials}</AvatarFallback>
            </Avatar>
          ))}
          <AvatarGroupCount>+{people.length - 3}</AvatarGroupCount>
        </AvatarGroup>
      </div>

      <div className="space-y-2">
        <StoryLabel>Mixed fallback types</StoryLabel>
        <AvatarGroup size="md">
          <Avatar>
            <AvatarImage src={IMAGE_SRC} alt="@shadcn" />
            <AvatarFallback color="violet">CN</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback color="emerald">AB</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback color="blue">
              <UserIcon className="size-1/2" />
            </AvatarFallback>
          </Avatar>
        </AvatarGroup>
      </div>

      <div className="space-y-2">
        <StoryLabel>Mixed colors</StoryLabel>
        <AvatarGroup size="md">
          {people.map(p => (
            <Avatar key={p.initials}>
              <AvatarFallback color={p.color}>{p.initials}</AvatarFallback>
            </Avatar>
          ))}
        </AvatarGroup>
      </div>
    </StorySection>
  ),
};

// All 7 sizes — one row per size. The group propagates size to its avatars and the count.
export const Sizes: Story = {
  render: () => (
    <StorySection title="Sizes">
      {avatarSizes.map(size => (
        <div key={size} className="flex items-center gap-4">
          <div className="w-10">
            <StoryLabel>{size}</StoryLabel>
          </div>
          <AvatarGroup size={size}>
            {people.slice(0, 3).map(p => (
              <Avatar key={p.initials}>
                <AvatarFallback color={p.color}>{p.initials}</AvatarFallback>
              </Avatar>
            ))}
            <AvatarGroupCount>+{people.length - 3}</AvatarGroupCount>
          </AvatarGroup>
        </div>
      ))}
    </StorySection>
  ),
};

// Hover composition: at the group level, and on an individual avatar inside a group.
export const WithHoverCard: Story = {
  render: () => (
    <StorySection title="With hover card">
      <div className="flex items-start gap-10">
        {/* Group-level */}
        <div className="space-y-2">
          <StoryLabel>Hover card on group level</StoryLabel>
          <HoverCard>
            <HoverCardTrigger asChild>
              <AvatarGroup size="md">
                {people.slice(0, 3).map(p => (
                  <Avatar key={p.initials}>
                    <AvatarFallback color={p.color}>{p.initials}</AvatarFallback>
                  </Avatar>
                ))}
                <AvatarGroupCount>+{people.length - 3}</AvatarGroupCount>
              </AvatarGroup>
            </HoverCardTrigger>
            <HoverCardContent className="w-64">
              <div className="flex flex-col gap-2">
                <span className="text-sm font-semibold">{people.length} members</span>
                {people.map(p => (
                  <div key={p.initials} className="flex items-center gap-2">
                    <Avatar size="2xs">
                      <AvatarFallback color={p.color}>{p.initials}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{p.name}</span>
                  </div>
                ))}
              </div>
            </HoverCardContent>
          </HoverCard>
        </div>

        {/* Per-child */}
        <div className="space-y-2">
          <StoryLabel>Hover card per child</StoryLabel>
          <AvatarGroup size="md">
            {people.slice(0, 3).map(p => (
              <HoverCard key={p.initials}>
                <HoverCardTrigger asChild>
                  <Avatar>
                    <AvatarFallback color={p.color}>{p.initials}</AvatarFallback>
                  </Avatar>
                </HoverCardTrigger>
                <HoverCardContent className="w-48">
                  <span className="text-sm font-semibold">{p.name}</span>
                </HoverCardContent>
              </HoverCard>
            ))}
          </AvatarGroup>
        </div>
      </div>
    </StorySection>
  ),
};
