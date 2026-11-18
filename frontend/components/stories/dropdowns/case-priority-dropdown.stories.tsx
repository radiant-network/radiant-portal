import type { Meta, StoryObj } from '@storybook/react-vite';
import { http, HttpResponse } from 'msw';

import { PatchCasePriorityCodeEnum } from '@/api/api';
import CasePriorityDropdown from '@/components/base/dropdowns/case-priority-dropdown';
import { Toaster } from '@/components/base/shadcn/sonner';

import { caseEntityApi } from '../api/api-case';
import { StoryLabel, StorySection, StoryShowcase } from '../story-section';

const PRIORITIES = Object.values(PatchCasePriorityCodeEnum);

const okHandler = http.patch(caseEntityApi, () => new HttpResponse(null, { status: 200 }));

const meta = {
  title: 'Components/Dropdowns/Case Priority Dropdown',
  component: CasePriorityDropdown,
  args: {
    caseId: 1,
    priority: PatchCasePriorityCodeEnum.Routine,
  },
  parameters: {
    msw: { handlers: [okHandler] },
  },
} satisfies Meta<typeof CasePriorityDropdown>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: args => (
    <StoryShowcase>
      <StorySection title="Interactive" description="Selecting a priority persists it and updates the button in place.">
        <div className="flex flex-wrap gap-2">
          {PRIORITIES.map(priority => (
            <CasePriorityDropdown {...args} key={priority} priority={priority} />
          ))}
        </div>
      </StorySection>

      <StorySection title="Sizes">
        <StoryLabel>3xs</StoryLabel>
        <CasePriorityDropdown {...args} />
        <StoryLabel>sm</StoryLabel>
        <CasePriorityDropdown {...args} size="sm" />
      </StorySection>
    </StoryShowcase>
  ),
};

export const SaveError: Story = {
  parameters: {
    msw: {
      handlers: [http.patch(caseEntityApi, () => new HttpResponse(null, { status: 500 }))],
    },
  },
  render: args => (
    <StorySection
      title="Failed save"
      description="The button updates optimistically, then rolls back to the previous priority with an error toast."
    >
      <CasePriorityDropdown {...args} />
      <Toaster />
    </StorySection>
  ),
};
