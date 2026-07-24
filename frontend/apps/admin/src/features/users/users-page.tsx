import { useMemo, useState } from 'react';
import { PaginationState } from '@tanstack/react-table';
import { Plus } from 'lucide-react';

import DataTable from '@/components/base/data-table/data-table';
import { Button } from '@/components/base/shadcn/button';
import { Card, CardContent } from '@/components/base/shadcn/card';
import { useI18n } from '@/components/hooks/i18n';

import { MOCK_USERS } from '../../mock/data';
import type { AdminUser, AssignedRole } from '../../mock/types';

import type { UserFormValues } from './user-form.types';
import UserSheet from './user-sheet';
import UsersTableFilters, { UsersFilterState } from './users-table-filters';
import { getUsersColumns, getUsersColumnSettings } from './users-table-settings';

const EMPTY_FILTERS: UsersFilterState = { search: '', roles: [], orgs: [] };

function matchesFilters(user: AdminUser, filters: UsersFilterState): boolean {
  const query = filters.search.trim().toLowerCase();
  if (query) {
    const haystack = `${user.firstName} ${user.lastName} ${user.email}`.toLowerCase();
    if (!haystack.includes(query)) return false;
  }
  if (filters.roles.length && !user.roles.some(r => filters.roles.includes(r.roleCode))) return false;
  if (filters.orgs.length && !user.roles.some(r => (r.orgCodes ?? []).some(org => filters.orgs.includes(org)))) {
    return false;
  }
  return true;
}

/** Form assignments → stored role grants (drop orgCodes for tenant-only roles). */
function assignmentsToRoles(values: UserFormValues): AssignedRole[] {
  return values.assignments.map(a =>
    a.orgCodes.length ? { roleCode: a.roleCode, orgCodes: a.orgCodes } : { roleCode: a.roleCode },
  );
}

/** The Users section: count header + Add user, the users table, and the Add/Edit sheet (mock data). */
export default function UsersPage() {
  const { t } = useI18n();
  const [users, setUsers] = useState<AdminUser[]>(MOCK_USERS);
  const [filters, setFilters] = useState<UsersFilterState>(EMPTY_FILTERS);
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 20 });
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);

  const rows = useMemo(() => users.filter(user => matchesFilters(user, filters)), [users, filters]);

  const openAdd = () => {
    setEditingUser(null);
    setSheetOpen(true);
  };
  const openEdit = (user: AdminUser) => {
    setEditingUser(user);
    setSheetOpen(true);
  };

  const handleSave = (values: UserFormValues, userId?: string) => {
    if (userId) {
      setUsers(prev => prev.map(u => (u.id === userId ? { ...u, roles: assignmentsToRoles(values) } : u)));
    } else {
      const id = `u-new-${users.length + 1}`;
      setUsers(prev => [
        {
          id,
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          roles: assignmentsToRoles(values),
        },
        ...prev,
      ]);
    }
  };

  const handleDelete = (user: AdminUser) => {
    setUsers(prev => prev.filter(u => u.id !== user.id));
  };

  const columns = useMemo(() => getUsersColumns(t, { onEdit: openEdit }), [t]);
  const columnSettings = useMemo(() => getUsersColumnSettings(t), [t]);

  const handleFilterChange = (next: UsersFilterState) => {
    setFilters(next);
    setPagination(prev => ({ ...prev, pageIndex: 0 }));
  };

  return (
    <Card className="h-auto w-full">
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-xl font-bold">{t('admin.users.count', { total: users.length })}</h2>
            <p className="text-sm text-muted-foreground">{t('admin.users.subtitle')}</p>
          </div>
          <Button onClick={openAdd}>
            <Plus />
            {t('admin.users.add')}
          </Button>
        </div>

        <DataTable
          id="admin-users"
          columns={columns}
          data={rows}
          defaultColumnSettings={columnSettings}
          loadingStates={{ total: false, list: false }}
          total={rows.length}
          TableFilters={<UsersTableFilters value={filters} onChange={handleFilterChange} />}
          pagination={{ type: 'locale', state: pagination, onPaginationChange: setPagination }}
          enableColumnOrdering
          enableFullscreen
          tableIndexResultPosition="bottom"
        />
      </CardContent>

      <UserSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        user={editingUser}
        users={users}
        onSave={handleSave}
        onDelete={handleDelete}
      />
    </Card>
  );
}
