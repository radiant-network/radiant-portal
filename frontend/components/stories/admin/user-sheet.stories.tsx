import { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import type { Meta, StoryObj } from '@storybook/react-vite';

import UserSheet from '@/apps/admin/src/features/users/user-sheet';
import { MOCK_USERS } from '@/apps/admin/src/mock/data';
import type { AdminUser } from '@/apps/admin/src/mock/types';

/** Renders the Add/Edit user sheet open on a neutral canvas. */
function UserSheetHarness({ user }: { user?: AdminUser | null }) {
  const [open, setOpen] = useState(true);
  return (
    <BrowserRouter>
      <div className="bg-muted p-4">
        {!open && (
          <button type="button" className="text-sm underline" onClick={() => setOpen(true)}>
            Reopen sheet
          </button>
        )}
        <UserSheet
          open={open}
          onOpenChange={setOpen}
          user={user}
          users={MOCK_USERS}
          onSave={() => setOpen(false)}
          onDelete={() => setOpen(false)}
        />
      </div>
    </BrowserRouter>
  );
}

const meta = {
  title: 'Features/Admin/User Sheet',
  component: UserSheetHarness,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof UserSheetHarness>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Add flow: editable identity fields + role assignment. */
export const AddUser: Story = {
  args: { user: null },
};

/** Edit flow: read-only identity header; org-scoped roles show their org chips; footer Delete. */
export const EditUser: Story = {
  args: { user: MOCK_USERS.find(u => u.id === 'u-002') }, // Michael Rodriguez — Data Manager + Clinical Reviewer (CHOP)
};

/**
 * The signed-in user (Sarah Chen) editing her own account while she's the only Administrator.
 * Self-guard: Delete is disabled with a tooltip (can't delete your own account). She still holds
 * Administrator, so that box stays toggleable — unchecking it triggers the last-admin veto dialog.
 */
export const EditTenantAdmin: Story = {
  args: { user: MOCK_USERS.find(u => u.id === 'u-001') }, // Sarah Chen (isCurrentUser)
};

/**
 * The signed-in user (Sarah Chen) editing her own account in a scenario where she does NOT hold
 * Administrator — shows both self-action guards together: the Administrator box is locked with a
 * "can't grant yourself" tooltip (no self-escalation), and Delete is disabled with a tooltip.
 * Other roles stay editable. Same person = "you" as the other self story, just without admin here.
 */
export const EditOwnAccount: Story = {
  args: {
    user: {
      ...MOCK_USERS.find(u => u.id === 'u-001')!,
      roles: [{ roleCode: 'clinical_reviewer', orgCodes: ['chop'] }],
    },
  },
};
