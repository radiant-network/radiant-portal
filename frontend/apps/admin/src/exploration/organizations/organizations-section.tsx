import { useCallback, useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import useSWR from 'swr';

import type { ApiError, OrganizationResponse } from '@/api/api';
import DataTable from '@/components/base/data-table/data-table';
import { Button } from '@/components/base/shadcn/button';
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/base/shadcn/card';
import { Skeleton } from '@/components/base/shadcn/skeleton';
import { useI18n } from '@/components/hooks/i18n';
import { useTenant } from '@/components/hooks/use-tenant';
import { organizationsApi } from '@/utils/api';

import OrganizationFormSheet from './organization-form-sheet';
import OrganizationsFilters from './organizations-filters';
import { getOrganizationsColumns, organizationsDefaultSettings } from './organizations-table-settings';
import { normalize } from './organizations-utils';

async function fetchOrganizations(tenant: string) {
  const response = await organizationsApi.listOrganizations(tenant);
  return response.data;
}

export default function OrganizationsSection() {
  const { t } = useI18n();
  const { tenant } = useTenant();
  const [search, setSearch] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editedOrganization, setEditedOrganization] = useState<OrganizationResponse>();

  const {
    data: organizations,
    isLoading,
    mutate,
  } = useSWR<OrganizationResponse[], ApiError>(`admin-organizations-${tenant}`, () => fetchOrganizations(tenant), {
    revalidateOnFocus: false,
    shouldRetryOnError: false,
  });

  const handleEdit = useCallback((organization: OrganizationResponse) => {
    setEditedOrganization(organization);
    setIsEditOpen(true);
  }, []);

  const columns = useMemo(() => getOrganizationsColumns(t, handleEdit), [t, handleEdit]);

  // Search and category filtering are client-side
  const filteredOrganizations = useMemo(() => {
    const term = normalize(search.trim());
    return (organizations ?? []).filter(
      organization =>
        (!term ||
          normalize(organization.code ?? '').includes(term) ||
          normalize(organization.name ?? '').includes(term)) &&
        (categories.length === 0 || categories.includes(organization.category_code ?? '')),
    );
  }, [organizations, search, categories]);

  return (
    <Card className="min-h-64">
      <CardHeader>
        <CardTitle size="xl">
          {isLoading ? (
            <Skeleton className="h-5 w-40" />
          ) : (
            t('admin.organizations.count', { count: organizations?.length ?? 0 })
          )}
        </CardTitle>
        <CardDescription>{t('admin.organizations.subtitle')}</CardDescription>
        <CardAction>
          <Button onClick={() => setIsCreateOpen(true)}>
            <Plus />
            {t('admin.organizations.add')}
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-2">
        <DataTable
          id="admin-organizations"
          columns={columns}
          data={filteredOrganizations}
          defaultColumnSettings={organizationsDefaultSettings}
          TableFilters={
            <OrganizationsFilters
              search={search}
              onSearchChange={setSearch}
              categories={categories}
              onCategoriesChange={setCategories}
            />
          }
          loadingStates={{ total: isLoading, list: isLoading }}
          pagination={{ type: 'hidden' }}
          total={filteredOrganizations.length}
          enableColumnOrdering
          enableFullscreen
          tableIndexResultPosition="hidden"
        />
        {isCreateOpen && (
          <OrganizationFormSheet open={isCreateOpen} onOpenChange={setIsCreateOpen} onSaved={() => mutate()} />
        )}
        {isEditOpen && (
          <OrganizationFormSheet
            open={isEditOpen}
            onOpenChange={setIsEditOpen}
            organization={editedOrganization}
            onSaved={() => mutate()}
          />
        )}
      </CardContent>
    </Card>
  );
}
