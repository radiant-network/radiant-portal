import { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import type { Meta, StoryObj } from '@storybook/react-vite';

import AdminLayout from '@/apps/admin/src/components/admin-layout';
import type { AdminSectionId } from '@/apps/admin/src/components/admin-sidebar';
import OrgsPage from '@/apps/admin/src/features/orgs/orgs-page';
import UsersPage from '@/apps/admin/src/features/users/users-page';
import { MOCK_TENANT } from '@/apps/admin/src/mock/data';
import { Toaster } from '@/components/base/shadcn/sonner';

/** Full admin screen (shell + sidebar + Organizations section) on mock data. */
function AdminOrgsScreen() {
  const [section, setSection] = useState<AdminSectionId>('organizations');
  return (
    <AdminLayout tenantName={MOCK_TENANT.name} activeSection={section} onSectionChange={setSection}>
      {section === 'users' && <UsersPage />}
      {section === 'organizations' && <OrgsPage />}
      {/* Mirrors the portal root, which mounts the Toaster in production — lets stories show toasts. */}
      <Toaster position="top-right" />
    </AdminLayout>
  );
}

const meta = {
  title: 'Features/Admin/Organizations',
  component: AdminOrgsScreen,
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
} satisfies Meta<typeof AdminOrgsScreen>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Organizations list: search (name/code) + Category filter, CODE over muted name, edit pencil. */
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
