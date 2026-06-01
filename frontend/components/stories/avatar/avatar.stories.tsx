import type { Meta, StoryObj } from '@storybook/react-vite';
import { UserIcon } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/base/shadcn/avatar';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/base/shadcn/hover-card';

import { avatarColors, avatarSizes } from './utils';

const meta = {
  title: 'Avatars/Avatar',
  component: Avatar,
  argTypes: {
    size: {
      options: avatarSizes,
      control: { type: 'select' },
    },
  },
} satisfies Meta<typeof Avatar>;

export default meta;

type Story = StoryObj<typeof meta>;

const IMAGE_SRC = 'https://github.com/shadcn.png';

// The three render types a fallback can resolve to: an image, initials, or an icon.
export const RenderTypes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <div className="flex flex-col items-center gap-2">
        <Avatar size="md">
          <AvatarImage src={IMAGE_SRC} alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <span className="text-sm text-muted-foreground">Image</span>
      </div>

      <div className="flex flex-col items-center gap-2">
        <Avatar size="md">
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <span className="text-sm text-muted-foreground">Initials</span>
      </div>

      <div className="flex flex-col items-center gap-2">
        <Avatar size="md">
          <AvatarFallback color="neutral">
            <UserIcon className="size-4" />
          </AvatarFallback>
        </Avatar>
        <span className="text-sm text-muted-foreground">Icon</span>
      </div>
    </div>
  ),
};

// All 7 sizes, for both initials and icon render types.
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="flex items-end gap-4">
        <div className="flex flex-col items-center gap-2">
          <Avatar>
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <span className="text-xs text-muted-foreground">default (xs)</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <Avatar>
            <AvatarFallback>
              <UserIcon className="size-1/2" />
            </AvatarFallback>
          </Avatar>
          <span className="text-xs text-muted-foreground">default (xs)</span>
        </div>
      </div>

      <div className="flex items-end gap-4">
        {avatarSizes.map(size => (
          <div key={size} className="flex flex-col items-center gap-2">
            <Avatar size={size}>
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground">{size}</span>
          </div>
        ))}
      </div>

      <div className="flex items-end gap-4">
        {avatarSizes.map(size => (
          <div key={size} className="flex flex-col items-center gap-2">
            <Avatar size={size}>
              <AvatarFallback>
                <UserIcon className="size-1/2" />
              </AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground">{size}</span>
          </div>
        ))}
      </div>
    </div>
  ),
};

// All 18 colors, for both initials and icon render types.
export const Colors: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-3">
        <div className="flex flex-col items-center gap-2">
          <Avatar size="md">
            <AvatarFallback>AB</AvatarFallback>
          </Avatar>
          <span className="text-xs text-muted-foreground">default (cyan)</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <Avatar size="md">
            <AvatarFallback>
              <UserIcon className="size-4" />
            </AvatarFallback>
          </Avatar>
          <span className="text-xs text-muted-foreground">default (cyan)</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        {avatarColors.map(color => (
          <div key={color} className="flex flex-col items-center gap-2">
            <Avatar size="md">
              <AvatarFallback color={color}>AB</AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground">{color}</span>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        {avatarColors.map(color => (
          <div key={color} className="flex flex-col items-center gap-2">
            <Avatar size="md">
              <AvatarFallback color={color}>
                <UserIcon className="size-4" />
              </AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground">{color}</span>
          </div>
        ))}
      </div>
    </div>
  ),
};

// The primitive stays purely visual; hover behaviour is composed with shadcn's HoverCard.
export const WithHoverCard: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      {/* Image */}
      <HoverCard>
        <HoverCardTrigger asChild>
          <Avatar size="lg">
            <AvatarImage src={IMAGE_SRC} alt="@shadcn" />
            <AvatarFallback color="violet">CN</AvatarFallback>
          </Avatar>
        </HoverCardTrigger>
        <HoverCardContent className="w-64">
          <div className="flex items-center gap-3">
            <Avatar size="md">
              <AvatarImage src={IMAGE_SRC} alt="@shadcn" />
              <AvatarFallback color="violet">CN</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-semibold">shadcn</span>
              <span className="text-xs text-muted-foreground">Image avatar</span>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>

      {/* Initials */}
      <HoverCard>
        <HoverCardTrigger asChild>
          <Avatar size="lg">
            <AvatarFallback color="emerald">AB</AvatarFallback>
          </Avatar>
        </HoverCardTrigger>
        <HoverCardContent className="w-64">
          <div className="flex items-center gap-3">
            <Avatar size="md">
              <AvatarFallback color="emerald">AB</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-semibold">Alex Bernard</span>
              <span className="text-xs text-muted-foreground">Initials avatar</span>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>

      {/* Icon */}
      <HoverCard>
        <HoverCardTrigger asChild>
          <Avatar size="lg">
            <AvatarFallback color="blue">
              <UserIcon className="size-1/2" />
            </AvatarFallback>
          </Avatar>
        </HoverCardTrigger>
        <HoverCardContent className="w-64">
          <div className="flex items-center gap-3">
            <Avatar size="md">
              <AvatarFallback color="blue">
                <UserIcon className="size-1/2" />
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-semibold">Unknown user</span>
              <span className="text-xs text-muted-foreground">Icon avatar</span>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  ),
};
