import { useMemo, useState } from 'react';
import type { PaginationState } from '@tanstack/react-table';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

import DataTable from '@/components/base/data-table/data-table';
import { Button } from '@/components/base/shadcn/button';
import { Card, CardContent } from '@/components/base/shadcn/card';
import { useI18n } from '@/components/hooks/i18n';

import { MOCK_USERS } from '../../mock/data';
import type { AdminUser, AssignedRole } from '../../mock/types';

import type { UserFormValues } from './user-form.types';
import UserSheet from './user-sheet';
import UsersTableFilters, { type UsersFilterState } from './users-table-filters';
import { getUsersColumns, getUsersColumnSettings } from './users-table-settings';

const EMPTY_FILTERS: UsersFilterState = { search: '', roles: [] };

function matchesFilters(user: AdminUser, filters: UsersFilterState): boolean {
  const query = filters.search.trim().toLowerCase();
  if (query) {
    const haystack = `${user.firstName} ${user.lastName} ${user.email}`.toLowerCase();
    if (!haystack.includes(query)) return false;
  }
  if (filters.roles.length) {
    // `member` is a virtual option = baseline only (no assigned roles); other codes match assigned
    // roles. OR across everything selected: keep the user if they hit any selected role or baseline.
    const matchesBaselineOnly = filters.roles.includes('member') && user.roles.length === 0;
    const matchesAssignedRole = user.roles.some(r => filters.roles.includes(r.roleCode));
    if (!matchesBaselineOnly && !matchesAssignedRole) return false;
  }
  return true;
}

/** Form assignments → stored role grants (drop orgCodes for tenant-only roles). */
function assignmentsToRoles(values: UserFormValues): AssignedRole[] {
  return values.assignments.map(a =>
    a.orgCodes.length ? { roleCode: a.roleCode, orgCodes: a.orgCodes } : { roleCode: a.roleCode },
  );
}

type UsersPageProps = {
  /** Seed filters, e.g. when arriving from a role's "assigned to" deep-link on the Roles page. */
  initialFilters?: UsersFilterState;
};

/** The Users section: count header + Add user, the users table, and the Add/Edit sheet (mock data). */
export default function UsersPage({ initialFilters }: UsersPageProps = {}) {
  const { t } = useI18n();
  const [users, setUsers] = useState<AdminUser[]>(MOCK_USERS);
  const [filters, setFilters] = useState<UsersFilterState>(initialFilters ?? EMPTY_FILTERS);
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 20 });
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);

  // Default (unsorted) order: the signed-in member pinned on top, then everyone else alphabetically
  // by last name (first name as tiebreak). Clicking the Name header to sort asc/desc overrides this
  // and orders everyone by last name (the pin only applies to the default state).
  const rows = useMemo(
    () =>
      users
        .filter(user => matchesFilters(user, filters))
        .sort((a, b) => {
          if (a.isCurrentUser) return -1;
          if (b.isCurrentUser) return 1;
          return a.lastName.localeCompare(b.lastName) || a.firstName.localeCompare(b.firstName);
        }),
    [users, filters],
  );

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
      toast.success(t('admin.user.ok.updated'));
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
      toast.success(t('admin.user.ok.created'));
    }
  };

  const handleDelete = (user: AdminUser) => {
    setUsers(prev => prev.filter(u => u.id !== user.id));
    toast.success(t('admin.user.ok.deleted'));
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
