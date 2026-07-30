import { useState } from 'react';

import AdminLayout from './components/admin-layout';
import { AdminSectionId } from './components/admin-sidebar';
import OrgsPage from './features/orgs/orgs-page';
import UsersPage from './features/users/users-page';
import { MOCK_TENANT } from './mock/data';

export default function App() {
  // Members + Organizations are implemented; Roles & Permissions is still a sidebar placeholder.
  const [section, setSection] = useState<AdminSectionId>('users');

  return (
    <AdminLayout tenantName={MOCK_TENANT.name} activeSection={section} onSectionChange={setSection}>
      {section === 'users' && <UsersPage />}
      {section === 'organizations' && <OrgsPage />}
    </AdminLayout>
  );
}
