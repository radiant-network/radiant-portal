import { useMemo, useState } from 'react';
import type { PaginationState } from '@tanstack/react-table';
import { Plus } from 'lucide-react';
import useSWR from 'swr';

import type { ApiError, UsersSearchResponse } from '@/api/api';
import DataTable from '@/components/base/data-table/data-table';
import { Button } from '@/components/base/shadcn/button';
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/base/shadcn/card';
import { Skeleton } from '@/components/base/shadcn/skeleton';
import { useI18n } from '@/components/hooks/i18n';
import { useLoginContext } from '@/components/hooks/use-login';
import { useTenant } from '@/components/hooks/use-tenant';
import { useDebounce } from '@/components/hooks/useDebounce';
import { usersApi } from '@/utils/api';

import UsersFilters from './users-filters';
import { getUsersColumns, usersDefaultSettings } from './users-table-settings';

const DEFAULT_PAGE_SIZE = 20;
const SEARCH_DEBOUNCE_MS = 300;

type ListUsersInput = {
  tenant: string;
  search: string;
  roles: string[];
  pagination: PaginationState;
};

async function fetchUsers({ tenant, search, roles, pagination }: ListUsersInput) {
  const response = await usersApi.listUsers(
    tenant,
    search || undefined,
    roles.length > 0 ? roles.join(',') : undefined,
    pagination.pageSize,
    undefined,
    pagination.pageIndex,
  );
  return response.data;
}

export default function UsersSection() {
  const { t } = useI18n();
  const { tenant } = useTenant();
  const { sub } = useLoginContext();
  const [search, setSearch] = useState('');
  const [roles, setRoles] = useState<string[]>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: DEFAULT_PAGE_SIZE,
  });

  const debouncedSearch = useDebounce(search.trim(), SEARCH_DEBOUNCE_MS);

  const { data, error, isLoading } = useSWR<UsersSearchResponse, ApiError>(
    `admin-users-${tenant}-${debouncedSearch}-${roles.join(',')}-${pagination.pageIndex}-${pagination.pageSize}`,
    () => fetchUsers({ tenant, search: debouncedSearch, roles, pagination }),
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    },
  );

  const columns = useMemo(() => getUsersColumns(t, sub), [t, sub]);

  const resetPagination = () => setPagination(current => ({ ...current, pageIndex: 0 }));

  const handleSearchChange = (value: string) => {
    setSearch(value);
    resetPagination();
  };

  const handleRolesChange = (values: string[]) => {
    setRoles(values);
    resetPagination();
  };

  return (
    <Card className="min-h-64">
      <CardHeader>
        <CardTitle size="xl">
          {isLoading ? <Skeleton className="h-5 w-40" /> : t('admin.users.count', { count: data?.count ?? 0 })}
        </CardTitle>
        <CardDescription>{t('admin.users.subtitle')}</CardDescription>
        <CardAction>
          {/* TODO(SJRA-1449): opens the Add member sheet */}
          <Button>
            <Plus />
            {t('admin.users.add')}
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-2">
        <DataTable
          id="admin-users"
          columns={columns}
          data={data?.list ?? []}
          defaultColumnSettings={usersDefaultSettings}
          hasError={!!error}
          TableFilters={
            <UsersFilters
              search={search}
              onSearchChange={handleSearchChange}
              roles={roles}
              onRolesChange={handleRolesChange}
            />
          }
          loadingStates={{ total: isLoading, list: isLoading }}
          pagination={{ state: pagination, type: 'server', onPaginationChange: setPagination }}
          total={data?.count ?? 0}
          enableColumnOrdering
          enableFullscreen
          tableIndexResultPosition="bottom"
        />
      </CardContent>
    </Card>
  );
}
