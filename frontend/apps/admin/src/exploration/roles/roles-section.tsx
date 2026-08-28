import { useMemo, useState } from 'react';
import { Trans } from 'react-i18next';
import { useSearchParams } from 'react-router';
import { LockIcon, Plus } from 'lucide-react';
import { toast } from 'sonner';

import type { RoleResult } from '@/api/api';
import DataTable from '@/components/base/data-table/data-table';
import { alertDialog } from '@/components/base/dialog/alert-dialog-store';
import AnchorLink from '@/components/base/navigation/anchor-link';
import { Button } from '@/components/base/shadcn/button';
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/base/shadcn/card';
import { Skeleton } from '@/components/base/shadcn/skeleton';
import { useI18n } from '@/components/hooks/i18n';
import { useTenant } from '@/components/hooks/use-tenant';
import { rolesApi } from '@/utils/api';

import { normalize } from '../organizations/organizations-utils';

import RoleFormSheet, { type RoleFormValues } from './role-form-sheet';
import RolePermissionsDialog from './role-permissions-dialog';
import RolesFilters from './roles-filters';
import { getRolesColumns, rolesDefaultSettings } from './roles-table-settings';
import { BASELINE_ROLE_CODE, findRole } from './roles-utils';
import { useTenantRoles } from './use-tenant-roles';

/** TODO name translation exists in back but not in front mock up */
function toConflictField(field: unknown): 'name' | 'code' | undefined {
  if (field === 'code') return 'code';
  if (field === 'name_en' || field === 'name_fr') return 'name';
  return undefined;
}

/** Reports a clash on the field the API names, and says whether it did. */
function reportFieldConflict(error: any, setDuplicateError: (field: 'name' | 'code') => void) {
  const field = toConflictField(error?.response?.data?.detail?.field);
  if (error?.response?.status !== 409 || !field) return false;

  setDuplicateError(field);
  return true;
}

export default function RolesSection() {
  const { t } = useI18n();
  const { tenant } = useTenant();
  const [, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [customOnly, setCustomOnly] = useState(false);
  const [permissionsRole, setPermissionsRole] = useState<RoleResult>();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editedRole, setEditedRole] = useState<RoleResult>();
  const [duplicatedRole, setDuplicatedRole] = useState<RoleResult>();

  const { data: tenantRoles, isLoading, mutate } = useTenantRoles(tenant);

  const closeSheets = () => {
    setIsCreateOpen(false);
    setEditedRole(undefined);
    setDuplicatedRole(undefined);
  };

  const impactValues = (role: RoleResult) => ({
    name: role.name,
    members: t('admin.roles.table.members_count', { count: role.assigned_users_count ?? 0 }),
    orgs: t('admin.roles.table.orgs_count', { count: role.assigned_orgs_count ?? 0 }),
  });

  const onSaved = (successKey: string) => {
    toast.success(t(successKey));
    mutate();
    closeSheets();
  };

  /** TODO name translation exists in back but not in front mock up */
  const createRole = async (
    values: RoleFormValues,
    { setDuplicateError }: { setDuplicateError: (field: 'name' | 'code') => void },
    isDuplicate: boolean,
  ) => {
    try {
      await rolesApi.createRole(tenant, {
        code: values.code,
        name_en: values.name.trim(),
        description_en: values.description?.trim() || undefined,
        actions: values.permissions,
      });
      onSaved(isDuplicate ? 'admin.roles.duplicate.notifications.success' : 'admin.roles.create.notifications.success');
    } catch (error: any) {
      if (reportFieldConflict(error, setDuplicateError)) return;

      toast.error(
        t(
          isDuplicate
            ? 'admin.roles.duplicate.notifications.errors.default'
            : 'admin.roles.create.notifications.errors.default',
        ),
      );
    }
  };

  const updateRole = async (
    role: RoleResult,
    values: RoleFormValues,
    { setDuplicateError }: { setDuplicateError: (field: 'name' | 'code') => void },
  ) => {
    try {
      await rolesApi.updateRole(tenant, role.code, {
        name_en: values.name.trim(),
        description_en: values.description?.trim() || undefined,
        actions: values.permissions,
      });
      onSaved('admin.roles.edit.notifications.success');
    } catch (error: any) {
      if (reportFieldConflict(error, setDuplicateError)) return;

      toast.error(t('admin.roles.edit.notifications.errors.default'));
    }
  };

  /** Changing what an assigned role grants changes what its holders can do: confirm first. */
  const openEditImpactConfirm = (
    role: RoleResult,
    values: RoleFormValues,
    helpers: { setDuplicateError: (field: 'name' | 'code') => void },
  ) =>
    alertDialog.open({
      type: 'warning',
      title: t('admin.roles.edit_impact.title'),
      description: (
        <Trans
          i18nKey={
            (role.assigned_orgs_count ?? 0) > 0
              ? 'admin.roles.edit_impact.body'
              : 'admin.roles.edit_impact.body_no_orgs'
          }
          values={impactValues(role)}
          components={{ b: <strong /> }}
        />
      ),
      cancelProps: { children: t('common.cancel') },
      actionProps: {
        children: t('admin.roles.edit_impact.submit'),
        onClick: () => updateRole(role, values, helpers),
      },
    });

  const openDeleteConfirm = (role: RoleResult) => {
    const membersCount = role.assigned_users_count ?? 0;
    const orgsCount = role.assigned_orgs_count ?? 0;
    const isAssigned = membersCount > 0;

    let bodyKey = 'admin.roles.delete.body_empty';
    if (isAssigned) {
      bodyKey = orgsCount > 0 ? 'admin.roles.delete.body' : 'admin.roles.delete.body_no_orgs';
    }

    const body = (
      <Trans
        i18nKey={bodyKey}
        values={impactValues(role)}
        components={{
          name: isAssigned ? <strong className="mb-3 block text-sm font-semibold leading-5" /> : <strong />,
          b: <strong />,
        }}
      />
    );

    alertDialog.open({
      type: 'error',
      title: t('admin.roles.delete.title'),
      description: isAssigned ? (
        <span className="block rounded-md border border-alert-error-foreground/30 bg-alert-error/20 p-3 text-alert-error-foreground">
          {body}
        </span>
      ) : (
        body
      ),
      cancelProps: { children: t('common.cancel') },
      actionProps: {
        variant: 'destructive',
        children: t('admin.roles.delete.submit'),
        onClick: async () => {
          try {
            await rolesApi.deleteRole(tenant, role.code);
            onSaved('admin.roles.delete.notifications.success');
          } catch {
            toast.error(t('admin.roles.delete.notifications.errors.default'));
          }
        },
      },
    });
  };

  /** Jumps to the members list with the role preselected in its filter. */
  const handleViewMembers = (role: RoleResult) =>
    setSearchParams(params => {
      params.set('section', 'users');
      params.set('role', role.code);
      return params;
    });

  const handleDuplicate = (role: RoleResult) => {
    setEditedRole(undefined);
    setDuplicatedRole(role);
  };

  const columns = useMemo(
    () =>
      getRolesColumns(t, {
        onViewPermissions: setPermissionsRole,
        onViewMembers: handleViewMembers,
        onEdit: setEditedRole,
        onDuplicate: handleDuplicate,
        onDelete: openDeleteConfirm,
      }),
    [t],
  );

  const handleEditSave = (values: RoleFormValues, helpers: { setDuplicateError: (field: 'name' | 'code') => void }) => {
    if (!editedRole) return;

    const permissionsChanged =
      [...editedRole.actions.map(action => action.code)].sort().join(',') !== [...values.permissions].sort().join(',');

    if (permissionsChanged && (editedRole.assigned_users_count ?? 0) > 0) {
      openEditImpactConfirm(editedRole, values, helpers);
      return;
    }
    updateRole(editedRole, values, helpers);
  };

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
            <Button onClick={() => setIsCreateOpen(true)}>
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
      {isCreateOpen && (
        <RoleFormSheet
          open={isCreateOpen}
          onOpenChange={setIsCreateOpen}
          onSave={(values, helpers) => createRole(values, helpers, false)}
        />
      )}
      {editedRole && (
        <RoleFormSheet
          open={!!editedRole}
          onOpenChange={() => setEditedRole(undefined)}
          role={editedRole}
          onSave={handleEditSave}
          onDuplicate={handleDuplicate}
          onDelete={openDeleteConfirm}
        />
      )}
      {duplicatedRole && (
        <RoleFormSheet
          open={!!duplicatedRole}
          onOpenChange={() => setDuplicatedRole(undefined)}
          role={duplicatedRole}
          isDuplicate
          onSave={(values, helpers) => createRole(values, helpers, true)}
        />
      )}
    </div>
  );
}
