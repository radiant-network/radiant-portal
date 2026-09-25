import type { Meta, StoryObj } from '@storybook/react-vite';
import { http, HttpResponse } from 'msw';

import { CaseStatus, PatchCaseStatusCodeEnum } from '@/api/api';
import CaseStatusDropdown from '@/components/base/dropdowns/case-status-dropdown';
import { Toaster } from '@/components/base/shadcn/sonner';

import { caseEntityApi } from '../api/api-case';
import { StoryLabel, StorySection, StoryShowcase } from '../story-section';

const USER_APPLIED = Object.values(PatchCaseStatusCodeEnum);

const SYSTEM_APPLIED: CaseStatus[] = [
  CaseStatus.CaseStatusDraft,
  CaseStatus.CaseStatusSubmitted,
  CaseStatus.CaseStatusProcessing,
];

const okHandler = http.patch(caseEntityApi, () => new HttpResponse(null, { status: 200 }));

const meta = {
  title: 'Components/Dropdowns/Case Status Dropdown',
  component: CaseStatusDropdown,
  args: {
    caseId: 1,
    status: 'in_progress',
  },
  parameters: {
    msw: { handlers: [okHandler] },
  },
} satisfies Meta<typeof CaseStatusDropdown>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: args => (
    <StoryShowcase>
      <StorySection
        title="Interactive"
        description="User-applied statuses. Selecting one persists it and updates the badge in place."
      >
        <div className="flex flex-wrap gap-2">
          {USER_APPLIED.map(status => (
            <CaseStatusDropdown {...args} key={status} status={status} />
          ))}
        </div>
      </StorySection>

      <StorySection title="Sizes">
        <StoryLabel>default</StoryLabel>
        <CaseStatusDropdown {...args} />
        <StoryLabel>lg</StoryLabel>
        <CaseStatusDropdown {...args} size="lg" />
      </StorySection>
    </StoryShowcase>
  ),
};

export const ReadOnly: Story = {
  render: args => (
    <StoryShowcase>
      <StorySection
        title="System-applied statuses"
        description="Draft, Pending and Processing are set by the backend — the badge never opens a menu."
      >
        <div className="flex flex-wrap gap-2">
          {SYSTEM_APPLIED.map(status => (
            <CaseStatusDropdown {...args} key={status} status={status} />
          ))}
        </div>
      </StorySection>

      <StorySection
        title="Without can_edit_case"
        description="A user-applied status stays visible, but the dropdown is gone. Hover for the tooltip."
      >
        <CaseStatusDropdown {...args} canEdit={false} readOnlyTooltip="Status" />
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
      description="The badge updates optimistically, then rolls back to the previous status with an error toast."
    >
      <CaseStatusDropdown {...args} />
      <Toaster />
    </StorySection>
  ),
};
