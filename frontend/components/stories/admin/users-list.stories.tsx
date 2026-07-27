import { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import type { Meta, StoryObj } from '@storybook/react-vite';

import AdminLayout from '@/apps/admin/src/components/admin-layout';
import { AdminSectionId } from '@/apps/admin/src/components/admin-sidebar';
import UsersPage from '@/apps/admin/src/features/users/users-page';
import { MOCK_TENANT } from '@/apps/admin/src/mock/data';
import { Toaster } from '@/components/base/shadcn/sonner';

/** Full admin screen (shell + sidebar + Users section) on mock data. */
function AdminUsersScreen() {
  const [section, setSection] = useState<AdminSectionId>('users');
  return (
    <AdminLayout tenantName={MOCK_TENANT.name} activeSection={section} onSectionChange={setSection}>
      {section === 'users' && <UsersPage />}
      {/* Mirrors the portal root, which mounts the Toaster in production — lets stories show toasts. */}
      <Toaster position="top-right" />
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

/** Users list: search + Role/Organization filter pills, role chips with org scope, muted Member, edit pencil. */
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
