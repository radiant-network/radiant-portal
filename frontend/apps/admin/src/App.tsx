import { useState } from 'react';

import AdminLayout from './components/admin-layout';
import type { AdminSectionId } from './components/admin-sidebar';
import OrgsPage from './features/orgs/orgs-page';
import RolesPage from './features/roles/roles-page';
import UsersPage from './features/users/users-page';
import type { UsersFilterState } from './features/users/users-table-filters';
import { MOCK_TENANT } from './mock/data';

export default function App() {
  const [section, setSection] = useState<AdminSectionId>('users');
  // One-shot filter handed to Members when arriving via a role's "assigned to" deep-link.
  const [usersInitialFilters, setUsersInitialFilters] = useState<UsersFilterState | undefined>();

  // Plain sidebar/section changes clear any pending deep-link filter so nav lands on a full list.
  const handleSectionChange = (next: AdminSectionId) => {
    setUsersInitialFilters(undefined);
    setSection(next);
  };

  // From the Roles table: open the Members section pre-filtered to a single role.
  const viewMembersForRole = (roleCode: string) => {
    setUsersInitialFilters({ search: '', roles: [roleCode] });
    setSection('users');
  };

  return (
    <AdminLayout tenantName={MOCK_TENANT.name} activeSection={section} onSectionChange={handleSectionChange}>
      {section === 'users' && <UsersPage initialFilters={usersInitialFilters} />}
      {section === 'organizations' && <OrgsPage />}
      {section === 'roles' && <RolesPage onViewMembers={viewMembersForRole} />}
    </AdminLayout>
  );
}
