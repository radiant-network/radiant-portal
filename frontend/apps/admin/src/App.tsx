import { useState } from 'react';

import AdminLayout from './components/admin-layout';
import { AdminSectionId } from './components/admin-sidebar';
import UsersPage from './features/users/users-page';
import { MOCK_TENANT } from './mock/data';

export default function App() {
  // Only "users" is implemented so far; Organizations/Roles are sidebar placeholders.
  const [section, setSection] = useState<AdminSectionId>('users');

  return (
    <AdminLayout tenantName={MOCK_TENANT.name} activeSection={section} onSectionChange={setSection}>
      {section === 'users' && <UsersPage />}
    </AdminLayout>
  );
}
