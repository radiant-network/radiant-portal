import { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import type { Meta, StoryObj } from '@storybook/react-vite';

import AdminLayout from '@/apps/admin/src/components/admin-layout';
import { AdminSectionId } from '@/apps/admin/src/components/admin-sidebar';
import UsersPage from '@/apps/admin/src/features/users/users-page';
import { MOCK_TENANT } from '@/apps/admin/src/mock/data';
import type { UserStatus } from '@/apps/admin/src/mock/types';

/** Full admin screen (shell + sidebar + Users section) on mock data. */
function AdminUsersScreen({ defaultTab }: { defaultTab?: UserStatus }) {
  const [section, setSection] = useState<AdminSectionId>('users');
  return (
    <AdminLayout tenantName={MOCK_TENANT.name} activeSection={section} onSectionChange={setSection}>
      {section === 'users' && <UsersPage defaultTab={defaultTab} />}
    </AdminLayout>
  );
}

const meta = {
  title: 'Features/Admin/Users',
  component: AdminUsersScreen,
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
} satisfies Meta<typeof AdminUsersScreen>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Active tab: search + Role/Organization filter pills, role chips with org scope, muted Member. */
export const Active: Story = {
  args: { defaultTab: 'active' },
};

/** Inactive tab: SSO auto-provisioned users, no filters and no Roles column — just User + edit. */
export const Inactive: Story = {
  args: { defaultTab: 'inactive' },
};

/**
 * Mobile: the sidebar collapses into a dropdown and the table scrolls horizontally.
 * Uses the viewport toolbar if available; otherwise narrow the preview to see the mobile layout.
 */
export const Mobile: Story = {
  args: { defaultTab: 'active' },
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
};
