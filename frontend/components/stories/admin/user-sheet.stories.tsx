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

/** Edit the only Tenant Admin — unchecking Admin triggers the last-admin block. */
export const EditTenantAdmin: Story = {
  args: { user: MOCK_USERS.find(u => u.id === 'u-001') }, // Sarah Chen
};
