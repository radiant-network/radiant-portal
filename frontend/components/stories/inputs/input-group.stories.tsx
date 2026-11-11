/* eslint-disable react-hooks/rules-of-hooks */
import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  CheckIcon,
  ChevronDownIcon,
  CircleArrowLeftIcon,
  CopyIcon,
  CreditCardIcon,
  EyeIcon,
  EyeOffIcon,
  FileCodeIcon,
  InfoIcon,
  MailIcon,
  RefreshCwIcon,
  SearchIcon,
  StarIcon,
} from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/base/shadcn/dropdown-menu';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from '@/components/base/shadcn/input-group';
import { Kbd } from '@/components/base/shadcn/kbd';
import { Spinner } from '@/components/base/shadcn/spinner';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/base/shadcn/tooltip';

import { StoryLabel, StorySection, StoryShowcase } from '../story-section';

const meta = {
  title: 'Components/Inputs/Input Group',
  component: InputGroup,
} satisfies Meta<typeof InputGroup>;

export default meta;

type Story = StoryObj<typeof meta>;

const WIDTH = 320;
const MAX_CHARACTERS = 280;

function CheckCircle() {
  return (
    <span className="flex size-4 items-center justify-center rounded-full bg-foreground text-background">
      <CheckIcon className="size-3" />
    </span>
  );
}

function SearchInputGroup({ disabled, invalid, value }: { disabled?: boolean; invalid?: boolean; value?: string }) {
  return (
    <InputGroup data-disabled={disabled}>
      <InputGroupInput placeholder="Placeholder" defaultValue={value} disabled={disabled} aria-invalid={invalid} />
      <InputGroupAddon>
        <SearchIcon />
      </InputGroupAddon>
      <InputGroupAddon align="inline-end">
        <Kbd>⌘F</Kbd>
      </InputGroupAddon>
    </InputGroup>
  );
}

function CounterTextareaGroup({ disabled, invalid, value }: { disabled?: boolean; invalid?: boolean; value?: string }) {
  return (
    <InputGroup data-disabled={disabled}>
      <InputGroupTextarea placeholder="Placeholder" defaultValue={value} disabled={disabled} aria-invalid={invalid} />
      <InputGroupAddon align="block-end">
        <InputGroupText>0/{MAX_CHARACTERS} characters</InputGroupText>
        <InputGroupText className="ml-auto">52% used</InputGroupText>
        <InputGroupButton variant="default" size="sm" disabled={disabled}>
          Post
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  );
}

export const States: Story = {
  render: () => (
    <StorySection title="States" description="Click a field to see the focus state.">
      <div className="flex flex-wrap gap-8">
        {[
          { label: 'Default' },
          { label: 'Filled', value: 'Placeholder' },
          { label: 'Disabled', disabled: true },
          { label: 'Invalid', invalid: true },
        ].map(({ label, ...state }) => (
          <div key={label} className="flex flex-col gap-4" style={{ width: WIDTH }}>
            <StoryLabel>{label}</StoryLabel>
            <SearchInputGroup {...state} />
            <CounterTextareaGroup {...state} />
          </div>
        ))}
      </div>
    </StorySection>
  ),
};

export const Addons: Story = {
  render: () => (
    <StorySection title="Addons">
      <div className="flex flex-col gap-4" style={{ width: WIDTH }}>
        <StoryLabel>Check circle</StoryLabel>
        <InputGroup>
          <InputGroupInput placeholder="@shadcn" />
          <InputGroupAddon align="inline-end">
            <CheckCircle />
          </InputGroupAddon>
        </InputGroup>

        <StoryLabel>Icon</StoryLabel>
        <InputGroup>
          <InputGroupInput placeholder="Search" />
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
        </InputGroup>

        <StoryLabel>Text</StoryLabel>
        <InputGroup>
          <InputGroupInput placeholder="Enter your website" />
          <InputGroupAddon>
            <InputGroupText>https://</InputGroupText>
          </InputGroupAddon>
        </InputGroup>

        <StoryLabel>Kbd</StoryLabel>
        <InputGroup>
          <InputGroupInput placeholder="Search" />
          <InputGroupAddon align="inline-end">
            <Kbd>⌘</Kbd>
          </InputGroupAddon>
        </InputGroup>

        <StoryLabel>Spinner</StoryLabel>
        <InputGroup>
          <InputGroupInput placeholder="Searching..." />
          <InputGroupAddon align="inline-end">
            <Spinner />
          </InputGroupAddon>
        </InputGroup>

        <StoryLabel>Button</StoryLabel>
        <InputGroup>
          <InputGroupInput placeholder="Placeholder" />
          <InputGroupAddon align="inline-end">
            <InputGroupButton variant="outline" size="icon-xs" aria-label="Back">
              <CircleArrowLeftIcon />
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>

        <StoryLabel>Tooltip</StoryLabel>
        <InputGroup>
          <InputGroupInput placeholder="Placeholder" />
          <InputGroupAddon align="inline-end">
            <Tooltip>
              <TooltipTrigger asChild>
                <InputGroupButton size="icon-xs" aria-label="Info">
                  <InfoIcon />
                </InputGroupButton>
              </TooltipTrigger>
              <TooltipContent>This is a tooltip</TooltipContent>
            </Tooltip>
          </InputGroupAddon>
        </InputGroup>

        <StoryLabel>Dropdown</StoryLabel>
        <InputGroup>
          <InputGroupInput placeholder="Placeholder" />
          <InputGroupAddon align="inline-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <InputGroupButton>
                  Button
                  <ChevronDownIcon />
                </InputGroupButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Option 1</DropdownMenuItem>
                <DropdownMenuItem>Option 2</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </InputGroupAddon>
        </InputGroup>
      </div>
    </StorySection>
  ),
};

export const AddonBlock: Story = {
  render: () => (
    <StoryShowcase direction="row">
      <StorySection title="Block start">
        <div style={{ width: WIDTH }}>
          <InputGroup>
            <InputGroupTextarea placeholder="Placeholder" />
            <InputGroupAddon align="block-start">
              <InputGroupText>0/{MAX_CHARACTERS} characters</InputGroupText>
              <InputGroupText className="ml-auto">52% used</InputGroupText>
              <InputGroupButton variant="default" size="sm">
                Post
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </div>
      </StorySection>
      <StorySection title="Block end">
        <div style={{ width: WIDTH }}>
          <CounterTextareaGroup />
        </div>
      </StorySection>
    </StoryShowcase>
  ),
};

export const Examples: Story = {
  render: () => {
    const [showPassword, setShowPassword] = useState(false);
    const [comment, setComment] = useState('');
    const [message, setMessage] = useState('');

    return (
      <StoryShowcase direction="row">
        <StorySection title="Icons and text">
          <div className="flex flex-col gap-4" style={{ width: WIDTH }}>
            <InputGroup>
              <InputGroupInput placeholder="Search" />
              <InputGroupAddon>
                <SearchIcon />
              </InputGroupAddon>
              <InputGroupAddon align="inline-end">12 results</InputGroupAddon>
            </InputGroup>

            <InputGroup>
              <InputGroupInput placeholder="Enter your email" type="email" />
              <InputGroupAddon>
                <MailIcon />
              </InputGroupAddon>
            </InputGroup>

            <InputGroup>
              <InputGroupInput placeholder="Card number" />
              <InputGroupAddon>
                <CreditCardIcon />
              </InputGroupAddon>
              <InputGroupAddon align="inline-end">
                <CheckIcon />
              </InputGroupAddon>
            </InputGroup>

            <InputGroup>
              <InputGroupInput placeholder="Card number" />
              <InputGroupAddon align="inline-end">
                <StarIcon />
                <InfoIcon />
              </InputGroupAddon>
            </InputGroup>

            <InputGroup>
              <InputGroupInput placeholder="Enter password" type={showPassword ? 'text' : 'password'} />
              <InputGroupAddon align="inline-end">
                <InputGroupButton
                  size="icon-xs"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeIcon /> : <EyeOffIcon />}
                </InputGroupButton>
              </InputGroupAddon>
            </InputGroup>
          </div>
        </StorySection>

        <StorySection title="Prefix and suffix">
          <div className="flex flex-col gap-4" style={{ width: WIDTH }}>
            <InputGroup>
              <InputGroupInput placeholder="0.00" />
              <InputGroupAddon>
                <InputGroupText>$</InputGroupText>
              </InputGroupAddon>
              <InputGroupAddon align="inline-end">
                <InputGroupText>USD</InputGroupText>
              </InputGroupAddon>
            </InputGroup>

            <InputGroup>
              <InputGroupInput placeholder="Enter your website" />
              <InputGroupAddon>
                <InputGroupText>https://</InputGroupText>
              </InputGroupAddon>
              <InputGroupAddon align="inline-end">
                <InputGroupText>.com</InputGroupText>
              </InputGroupAddon>
            </InputGroup>

            <InputGroup>
              <InputGroupInput placeholder="Enter your username" />
              <InputGroupAddon align="inline-end">
                <InputGroupText>@company.com</InputGroupText>
              </InputGroupAddon>
            </InputGroup>
          </div>
        </StorySection>

        <StorySection title="Loading">
          <div className="flex flex-col gap-4" style={{ width: WIDTH }}>
            <InputGroup data-disabled>
              <InputGroupInput placeholder="Searching..." disabled />
              <InputGroupAddon align="inline-end">
                <Spinner />
              </InputGroupAddon>
            </InputGroup>

            <InputGroup data-disabled>
              <InputGroupInput placeholder="Processing..." disabled />
              <InputGroupAddon>
                <Spinner />
              </InputGroupAddon>
            </InputGroup>

            <InputGroup data-disabled>
              <InputGroupInput placeholder="Refreshing data..." disabled />
              <InputGroupAddon>
                <Spinner />
              </InputGroupAddon>
              <InputGroupAddon align="inline-end">
                <InputGroupText>Please wait...</InputGroupText>
              </InputGroupAddon>
            </InputGroup>
          </div>
        </StorySection>

        <StorySection title="Textarea">
          <div className="flex flex-col gap-4" style={{ width: WIDTH }}>
            <InputGroup>
              <InputGroupTextarea
                placeholder="Write a comment"
                maxLength={MAX_CHARACTERS}
                value={comment}
                onChange={e => setComment(e.target.value)}
              />
              <InputGroupAddon align="block-end">
                <InputGroupText>
                  {comment.length}/{MAX_CHARACTERS}
                </InputGroupText>
                <InputGroupButton variant="default" size="sm" className="ml-auto">
                  Post
                </InputGroupButton>
              </InputGroupAddon>
            </InputGroup>

            <InputGroup>
              <InputGroupTextarea
                placeholder="Enter your message"
                maxLength={120}
                value={message}
                onChange={e => setMessage(e.target.value)}
              />
              <InputGroupAddon align="block-end">
                <InputGroupText>{120 - message.length} characters left</InputGroupText>
              </InputGroupAddon>
            </InputGroup>

            <InputGroup>
              <InputGroupTextarea placeholder="Autoresize textarea..." style={{ fieldSizing: 'content' }} />
              <InputGroupAddon align="block-end">
                <InputGroupButton variant="default" size="sm" className="ml-auto">
                  Submit
                </InputGroupButton>
              </InputGroupAddon>
            </InputGroup>
          </div>
        </StorySection>

        <StorySection title="Code editor">
          <div style={{ width: 400 }}>
            <InputGroup>
              <InputGroupTextarea defaultValue="console.log('Hello, world!');" style={{ minHeight: 200 }} />
              <InputGroupAddon align="block-start" className="border-b">
                <InputGroupText className="font-mono">
                  <FileCodeIcon />
                  script.js
                </InputGroupText>
                <InputGroupButton size="icon-xs" className="ml-auto" aria-label="Refresh">
                  <RefreshCwIcon />
                </InputGroupButton>
                <InputGroupButton size="icon-xs" aria-label="Copy">
                  <CopyIcon />
                </InputGroupButton>
              </InputGroupAddon>
              <InputGroupAddon align="block-end" className="border-t">
                <InputGroupText>Line 1, Column 1</InputGroupText>
                <InputGroupButton variant="default" size="sm" className="ml-auto">
                  Post
                </InputGroupButton>
              </InputGroupAddon>
            </InputGroup>
          </div>
        </StorySection>
      </StoryShowcase>
    );
  },
};
