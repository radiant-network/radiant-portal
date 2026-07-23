import { useMemo, useState } from 'react';
import { PaginationState } from '@tanstack/react-table';
import { Plus } from 'lucide-react';

import DataTable from '@/components/base/data-table/data-table';
import { Button } from '@/components/base/shadcn/button';
import { Card, CardContent } from '@/components/base/shadcn/card';
import { useI18n } from '@/components/hooks/i18n';

import { MOCK_USERS } from '../../mock/data';
import type { AdminUser } from '../../mock/types';

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

/** The Users section: count header + Add user, and the users table (mock data). */
export default function UsersPage() {
  const { t } = useI18n();
  const [filters, setFilters] = useState<UsersFilterState>(EMPTY_FILTERS);
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 20 });

  const rows = useMemo(() => MOCK_USERS.filter(user => matchesFilters(user, filters)), [filters]);

  // TODO(increment 2): open the Add/Edit user Sheet (which also hosts Delete). No-op for now.
  const handleEdit = (_user: AdminUser) => {};
  const handleAdd = () => {};

  const columns = useMemo(() => getUsersColumns(t, { onEdit: handleEdit }), [t]);
  const columnSettings = useMemo(() => getUsersColumnSettings(t), [t]);

  const handleFilterChange = (next: UsersFilterState) => {
    setFilters(next);
    setPagination(prev => ({ ...prev, pageIndex: 0 }));
  };

  return (
    <Card className="h-auto w-full">
      <CardContent className="flex flex-col gap-4">
        {/* Section header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-xl font-bold">{t('admin.users.count', { total: MOCK_USERS.length })}</h2>
            <p className="text-sm text-muted-foreground">{t('admin.users.subtitle')}</p>
          </div>
          <Button onClick={handleAdd}>
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
    </Card>
  );
}
