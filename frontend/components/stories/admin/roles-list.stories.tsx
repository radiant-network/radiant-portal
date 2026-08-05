import { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import type { Meta, StoryObj } from '@storybook/react-vite';

import AdminLayout from '@/apps/admin/src/components/admin-layout';
import type { AdminSectionId } from '@/apps/admin/src/components/admin-sidebar';
import OrgsPage from '@/apps/admin/src/features/orgs/orgs-page';
import RolesPage from '@/apps/admin/src/features/roles/roles-page';
import UsersPage from '@/apps/admin/src/features/users/users-page';
import type { UsersFilterState } from '@/apps/admin/src/features/users/users-table-filters';
import { MOCK_TENANT } from '@/apps/admin/src/mock/data';
import { Toaster } from '@/components/base/shadcn/sonner';

/**
 * Full admin screen (shell + sidebar + Roles & Permissions section) on mock data. Mirrors the
 * portal's App wiring, including the role → Members deep-link (a role's "assigned to" count opens
 * the Members section pre-filtered to that role).
 */
function AdminRolesScreen() {
  const [section, setSection] = useState<AdminSectionId>('roles');
  const [usersInitialFilters, setUsersInitialFilters] = useState<UsersFilterState | undefined>();

  const handleSectionChange = (next: AdminSectionId) => {
    setUsersInitialFilters(undefined);
    setSection(next);
  };
  const viewMembersForRole = (roleCode: string) => {
    setUsersInitialFilters({ search: '', roles: [roleCode], orgs: [] });
    setSection('users');
  };

  return (
    <AdminLayout tenantName={MOCK_TENANT.name} activeSection={section} onSectionChange={handleSectionChange}>
      {section === 'users' && <UsersPage initialFilters={usersInitialFilters} />}
      {section === 'organizations' && <OrgsPage />}
      {section === 'roles' && <RolesPage onViewMembers={viewMembersForRole} />}
      {/* Mirrors the portal root, which mounts the Toaster in production — lets stories show toasts. */}
      <Toaster position="top-right" />
    </AdminLayout>
  );
}

const meta = {
  title: 'Features/Admin/Roles',
  component: AdminRolesScreen,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    Story => (
      <BrowserRouter>
        <Story />
      </BrowserRouter>
    ),
  ],
} satisfies Meta<typeof AdminRolesScreen>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Roles list: built-in (locked) roles pinned first with the Administrator + Member baseline on top,
 * then custom roles. Search + Type filter, scope badges, permission counts, and an "assigned to"
 * count that deep-links to Members. Add/Edit custom roles or view a built-in role via the sheet.
 */
export const Default: Story = {};

/**
 * Mobile: the sidebar collapses into a dropdown and the table scrolls horizontally.
 * Uses the viewport toolbar if available; otherwise narrow the preview to see the mobile layout.
 */
export const Mobile: Story = {
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
};
