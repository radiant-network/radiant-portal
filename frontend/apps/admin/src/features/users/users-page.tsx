import { useMemo, useState } from 'react';
import { PaginationState } from '@tanstack/react-table';
import { Plus } from 'lucide-react';

import DataTable from '@/components/base/data-table/data-table';
import { Button } from '@/components/base/shadcn/button';
import { Card, CardContent } from '@/components/base/shadcn/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/base/shadcn/tabs';
import { useI18n } from '@/components/hooks/i18n';

import { MOCK_USERS } from '../../mock/data';
import type { AdminUser, UserStatus } from '../../mock/types';

import UsersTableFilters, { UsersFilterState } from './users-table-filters';
import { getUsersColumns, getUsersColumnSettings } from './users-table-settings';

const EMPTY_FILTERS: UsersFilterState = { search: '', roles: [], orgs: [] };

function matchesFilters(user: AdminUser, filters: UsersFilterState, isActiveTab: boolean): boolean {
  const query = filters.search.trim().toLowerCase();
  if (query) {
    const haystack = `${user.firstName} ${user.lastName} ${user.email}`.toLowerCase();
    if (!haystack.includes(query)) return false;
  }
  // Role/Org filters only apply on the Active tab (inactive users hold no roles).
  if (isActiveTab) {
    if (filters.roles.length && !user.roles.some(r => filters.roles.includes(r.roleCode))) return false;
    if (filters.orgs.length && !user.roles.some(r => (r.orgCodes ?? []).some(org => filters.orgs.includes(org)))) {
      return false;
    }
  }
  return true;
}

type UsersPageProps = {
  /** Initial tab — lets stories open directly on Inactive. */
  defaultTab?: UserStatus;
};

/** The Users section: count header + Add user, Active/Inactive tabs, and the users table (mock data). */
export default function UsersPage({ defaultTab = 'active' }: UsersPageProps = {}) {
  const { t } = useI18n();
  const [tab, setTab] = useState<UserStatus>(defaultTab);
  const [filters, setFilters] = useState<UsersFilterState>(EMPTY_FILTERS);
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 20 });

  const isActiveTab = tab === 'active';

  const { activeUsers, inactiveUsers } = useMemo(
    () => ({
      activeUsers: MOCK_USERS.filter(u => u.status === 'active'),
      inactiveUsers: MOCK_USERS.filter(u => u.status === 'inactive'),
    }),
    [],
  );

  const rows = useMemo(() => {
    const base = isActiveTab ? activeUsers : inactiveUsers;
    return base.filter(user => matchesFilters(user, filters, isActiveTab));
  }, [isActiveTab, activeUsers, inactiveUsers, filters]);

  // TODO(next increment): open the Add/Edit user Sheet. No-op in this read-only pass.
  const handleEdit = (_user: AdminUser) => {};
  const handleAdd = () => {};

  const columns = useMemo(() => getUsersColumns(t, { showRoles: isActiveTab, onEdit: handleEdit }), [t, isActiveTab]);
  const columnSettings = useMemo(() => getUsersColumnSettings(t, isActiveTab), [t, isActiveTab]);

  const handleTabChange = (value: string) => {
    setTab(value as UserStatus);
    setFilters(EMPTY_FILTERS);
    setPagination(prev => ({ ...prev, pageIndex: 0 }));
  };

  const handleFilterChange = (next: UsersFilterState) => {
    setFilters(next);
    setPagination(prev => ({ ...prev, pageIndex: 0 }));
  };

  const tabTriggerClass =
    'flex-none rounded-none border-0 border-b-2 border-transparent bg-transparent px-0 pb-3 -mb-px font-medium text-muted-foreground shadow-none hover:text-foreground data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none';

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

        {/* Underline tabs (the design system Tabs is pill-style; overridden here to an underline). */}
        <div className="border-b border-border">
          <Tabs value={tab} onValueChange={handleTabChange}>
            <TabsList className="h-auto gap-6 rounded-none bg-transparent p-0">
              <TabsTrigger value="active" className={tabTriggerClass}>
                {t('admin.users.tabs.active')} ({activeUsers.length})
              </TabsTrigger>
              <TabsTrigger value="inactive" className={tabTriggerClass}>
                {t('admin.users.tabs.inactive')} ({inactiveUsers.length})
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <DataTable
          id={`admin-users-${tab}`}
          columns={columns}
          data={rows}
          defaultColumnSettings={columnSettings}
          loadingStates={{ total: false, list: false }}
          total={rows.length}
          TableFilters={<UsersTableFilters value={filters} onChange={handleFilterChange} showPills={isActiveTab} />}
          pagination={{ type: 'locale', state: pagination, onPaginationChange: setPagination }}
          enableColumnOrdering
          enableFullscreen
          tableIndexResultPosition="bottom"
        />
      </CardContent>
    </Card>
  );
}
