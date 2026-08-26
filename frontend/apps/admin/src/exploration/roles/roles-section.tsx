import { useMemo, useState } from 'react';
import { Trans } from 'react-i18next';
import { useSearchParams } from 'react-router';
import { LockIcon, Plus } from 'lucide-react';

import type { RoleResult } from '@/api/api';
import DataTable from '@/components/base/data-table/data-table';
import AnchorLink from '@/components/base/navigation/anchor-link';
import { Button } from '@/components/base/shadcn/button';
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/base/shadcn/card';
import { Skeleton } from '@/components/base/shadcn/skeleton';
import { useI18n } from '@/components/hooks/i18n';
import { useTenant } from '@/components/hooks/use-tenant';

import { normalize } from '../organizations/organizations-utils';

import RolePermissionsDialog from './role-permissions-dialog';
import RolesFilters from './roles-filters';
import { getRolesColumns, rolesDefaultSettings } from './roles-table-settings';
import { BASELINE_ROLE_CODE, findRole } from './roles-utils';
import { useTenantRoles } from './use-tenant-roles';

export default function RolesSection() {
  const { t } = useI18n();
  const { tenant } = useTenant();
  const [, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [customOnly, setCustomOnly] = useState(false);
  const [permissionsRole, setPermissionsRole] = useState<RoleResult>();

  const { data: tenantRoles, isLoading } = useTenantRoles(tenant);

  /** Jumps to the members list with the role preselected in its filter. */
  const handleViewMembers = (role: RoleResult) =>
    setSearchParams(params => {
      params.set('section', 'users');
      params.set('role', role.code);
      return params;
    });

  const columns = useMemo(
    () =>
      getRolesColumns(t, {
        onViewPermissions: setPermissionsRole,
        onViewMembers: handleViewMembers,
        // TODO(SJRA-1450): opens the Edit role sheet, which lands with its API endpoint
        onEdit: () => {},
      }),
    [t],
  );

  const filteredRoles = useMemo(() => {
    const term = normalize(search.trim());
    return (tenantRoles ?? []).filter(
      role =>
        role.code !== BASELINE_ROLE_CODE &&
        (!term || normalize(role.name).includes(term) || normalize(role.description ?? '').includes(term)) &&
        (!customOnly || !role.is_default),
    );
  }, [tenantRoles, search, customOnly]);

  return (
    <div className="space-y-2">
      <Card className="min-h-64">
        <CardHeader>
          <CardTitle size="xl">
            {isLoading ? <Skeleton className="h-5 w-40" /> : t('admin.roles.count', { count: filteredRoles.length })}
          </CardTitle>
          <CardDescription className="max-w-3xl">
            <Trans
              i18nKey="admin.roles.subtitle"
              components={{
                permissions: (
                  <AnchorLink
                    component="button"
                    type="button"
                    size="sm"
                    external={false}
                    onClick={() => setPermissionsRole(findRole(tenantRoles ?? [], BASELINE_ROLE_CODE))}
                  />
                ),
              }}
            />
          </CardDescription>
          <CardAction>
            {/* TODO(SJRA-1450): opens the Add role sheet, which lands with its API endpoint */}
            <Button>
              <Plus />
              {t('admin.roles.add')}
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent className="space-y-2">
          <DataTable
            id="admin-roles"
            columns={columns}
            data={filteredRoles}
            defaultColumnSettings={rolesDefaultSettings}
            TableFilters={
              <RolesFilters
                search={search}
                onSearchChange={setSearch}
                customOnly={customOnly}
                onCustomOnlyChange={setCustomOnly}
              />
            }
            loadingStates={{ total: isLoading, list: isLoading }}
            pagination={{ type: 'hidden' }}
            total={filteredRoles.length}
            enableColumnOrdering
            enableFullscreen
            tableIndexResultPosition="hidden"
          />
        </CardContent>
      </Card>
      <p className="flex items-center gap-1.5 px-1 text-sm text-muted-foreground">
        <LockIcon className="size-3.5" />
        {t('admin.roles.default_note')}
      </p>
      <RolePermissionsDialog role={permissionsRole} onOpenChange={() => setPermissionsRole(undefined)} />
    </div>
  );
}
