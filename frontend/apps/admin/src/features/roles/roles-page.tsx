import { useMemo, useState } from 'react';
import { PaginationState } from '@tanstack/react-table';
import type { TFunction } from 'i18next';
import { Lock, Plus } from 'lucide-react';
import { toast } from 'sonner';

import DataTable from '@/components/base/data-table/data-table';
import { alertDialog } from '@/components/base/dialog/alert-dialog-store';
import { Button } from '@/components/base/shadcn/button';
import { Card, CardContent } from '@/components/base/shadcn/card';
import { useI18n } from '@/components/hooks/i18n';

import {
  getRoleUsage,
  MEMBER_ROLE,
  MOCK_ROLES,
  MOCK_TENANT,
  MOCK_USERS,
  roleDescription,
  roleName,
} from '../../mock/data';
import type { Role } from '../../mock/types';

import type { RoleFormValues } from './role-form.types';
import RoleSheet from './role-sheet';
import RolesTableFilters, { RolesFilterState } from './roles-table-filters';
import { getRolesColumns, getRolesColumnSettings } from './roles-table-settings';

const EMPTY_FILTERS: RolesFilterState = { search: '', customOnly: false };

function matchesFilters(role: Role, filters: RolesFilterState, t: TFunction<string, undefined>): boolean {
  const query = filters.search.trim().toLowerCase();
  if (query) {
    const haystack = `${roleName(role, t)} ${roleDescription(role, t)}`.toLowerCase();
    if (!haystack.includes(query)) return false;
  }
  if (filters.customOnly && role.isDefault) return false;
  return true;
}

/**
 * Default sort: Administrator first, then the remaining default roles, then custom roles — each
 * group alphabetical by name. The Role/Scope headers can override with asc/desc.
 */
function defaultSortRank(role: Role): number {
  if (role.code === 'tenant_admin') return 0;
  return role.isDefault ? 1 : 2;
}

/** Slugify a new custom role's code from its name (ES2020-safe `.replace`, not `String.replaceAll`). */
function makeRoleCode(name: string, roles: Role[]): string {
  const base =
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/_+/g, '_')
      .replace(/^[^a-z]+/, '')
      .replace(/_+$/, '') || 'role';
  const taken = new Set(roles.map(r => r.code));
  let code = base;
  let n = 2;
  while (taken.has(code)) code = `${base}_${n++}`;
  return code;
}

type RolesPageProps = {
  /** Deep-link: switch to the Members section filtered to this role. */
  onViewMembers: (roleCode: string) => void;
};

/** The Roles & Permissions section: count header + Add role, the roles table, and the sheet (mock data). */
export default function RolesPage({ onViewMembers }: RolesPageProps) {
  const { t } = useI18n();
  const [roles, setRoles] = useState<Role[]>(MOCK_ROLES);
  const [filters, setFilters] = useState<RolesFilterState>(EMPTY_FILTERS);
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 20 });
  const [sheetOpen, setSheetOpen] = useState(false);
  const [activeRole, setActiveRole] = useState<Role | null>(null);
  // Add-mode prefill for Duplicate (undefined = a blank Add).
  const [initialValues, setInitialValues] = useState<RoleFormValues | undefined>(undefined);

  // The baseline `member` role is implicit and unactionable, so it's excluded from the list (its
  // permissions stay reachable via the "see what's included" link in the header).
  const listedRoles = useMemo(() => roles.filter(r => r.code !== 'member'), [roles]);

  const rows = useMemo(
    () =>
      listedRoles
        .filter(role => matchesFilters(role, filters, t))
        .sort((a, b) => defaultSortRank(a) - defaultSortRank(b) || roleName(a, t).localeCompare(roleName(b, t))),
    [listedRoles, filters, t],
  );

  const openAdd = () => {
    setActiveRole(null);
    setInitialValues(undefined);
    setSheetOpen(true);
  };
  const openRole = (role: Role) => {
    setInitialValues(undefined);
    setActiveRole(role);
    setSheetOpen(true);
  };
  const openDuplicate = (role: Role) => {
    setActiveRole(null);
    setInitialValues({
      name: `${roleName(role, t)} ${t('admin.role.duplicate_suffix')}`,
      description: roleDescription(role, t),
      permissions: role.permissions,
    });
    setSheetOpen(true);
  };

  const handleSave = (values: RoleFormValues, roleCode?: string) => {
    if (roleCode) {
      setRoles(prev =>
        prev.map(r =>
          r.code === roleCode
            ? { ...r, label: values.name, description: values.description, permissions: values.permissions }
            : r,
        ),
      );
      toast.success(t('admin.role.ok.updated'));
    } else {
      const code = makeRoleCode(values.name, roles);
      setRoles(prev => [
        {
          code,
          label: values.name,
          description: values.description,
          isDefault: false,
          permissions: values.permissions,
        },
        ...prev,
      ]);
      toast.success(t('admin.role.ok.created'));
    }
  };

  const handleDelete = (role: Role) => {
    setRoles(prev => prev.filter(r => r.code !== role.code));
    toast.success(t('admin.role.ok.deleted'));
  };

  // Delete confirm lives at the page so both the row menu and the Edit-sheet footer share it.
  const requestDelete = (role: Role) => {
    const { members } = getRoleUsage(role, MOCK_USERS);
    const description =
      members === 0
        ? t('admin.role.delete_body_empty', { tenant: MOCK_TENANT.name })
        : t('admin.role.delete_body', { count: members, tenant: MOCK_TENANT.name });
    alertDialog.open({
      type: 'warning',
      title: t('admin.role.delete_title', { name: roleName(role, t) }),
      description,
      cancelProps: { children: t('admin.role.cancel') },
      actionProps: {
        color: 'destructive',
        dataCy: 'delete-role-confirm',
        children: t('admin.role.delete_confirm'),
        onClick: async () => {
          handleDelete(role);
          setSheetOpen(false);
        },
      },
    });
  };

  const columns = useMemo(
    () =>
      getRolesColumns(t, {
        users: MOCK_USERS,
        onOpen: openRole,
        onViewMembers: role => onViewMembers(role.code),
        onDuplicate: openDuplicate,
        onDelete: requestDelete,
      }),
    [t, onViewMembers],
  );
  const columnSettings = useMemo(() => getRolesColumnSettings(t), [t]);

  const handleFilterChange = (next: RolesFilterState) => {
    setFilters(next);
    setPagination(prev => ({ ...prev, pageIndex: 0 }));
  };

  return (
    <Card className="h-auto w-full">
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-xl font-bold">{t('admin.roles_page.count', { total: listedRoles.length })}</h2>
            <p className="max-w-3xl text-sm text-muted-foreground">
              {t('admin.roles_page.subtitle')} (
              <Button
                type="button"
                variant="link"
                className="h-auto p-0 align-baseline text-sm"
                onClick={() => openRole(MEMBER_ROLE)}
              >
                {t('admin.roles_page.see_included')}
              </Button>
              ).
            </p>
          </div>
          <Button onClick={openAdd}>
            <Plus />
            {t('admin.roles_page.add')}
          </Button>
        </div>

        <DataTable
          id="admin-roles"
          columns={columns}
          data={rows}
          defaultColumnSettings={columnSettings}
          loadingStates={{ total: false, list: false }}
          total={rows.length}
          TableFilters={<RolesTableFilters value={filters} onChange={handleFilterChange} />}
          pagination={{ type: 'locale', state: pagination, onPaginationChange: setPagination }}
          enableColumnOrdering
          enableFullscreen
          tableIndexResultPosition="bottom"
        />

        {/* Card footer note: defaults are locked. */}
        <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Lock className="size-3.5" />
          {t('admin.roles_page.footer_note')}
        </p>
      </CardContent>

      <RoleSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        role={activeRole}
        initialValues={initialValues}
        roles={roles}
        onSave={handleSave}
        onDuplicate={openDuplicate}
        onRequestDelete={requestDelete}
      />
    </Card>
  );
}
