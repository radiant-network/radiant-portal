import { createColumnHelper } from '@tanstack/react-table';
import type { TFunction } from 'i18next';

import { createColumnSettings, type TableColumnDef } from '@/components/base/data-table/data-table';
import { Badge } from '@/components/base/shadcn/badge';

import { getRoleScopes, roleName, SCOPE_BADGE_VARIANT } from '../../mock/data';
import type { AdminUser, Role } from '../../mock/types';

import RoleActionsCell from './cells/role-actions-cell';
import RoleCell from './cells/role-cell';
import RoleUsageCell from './cells/role-usage-cell';

const columnHelper = createColumnHelper<Role>();

/** Sort rank for the Scope column: Network-only → mixed → Organization-only → none. */
function scopeRank(role: Role): number {
  const scopes = getRoleScopes(role);
  const hasTenant = scopes.includes('tenant');
  const hasOrg = scopes.includes('org');
  if (hasTenant && hasOrg) return 1;
  if (hasTenant) return 0;
  if (hasOrg) return 2;
  return 3;
}

type RolesColumnsOptions = {
  users: AdminUser[];
  /** Open the edit sheet (custom roles only). */
  onOpen: (role: Role) => void;
  /** Open the read-only permissions dialog (default roles + any permissions-count click). */
  onViewPermissions: (role: Role) => void;
  onViewMembers: (role: Role) => void;
  onDuplicate: (role: Role) => void;
  onDelete: (role: Role) => void;
};

/** Column definitions for the Roles table. Display columns (no server sorting in the mock). */
export function getRolesColumns(
  t: TFunction<string, undefined>,
  { users, onOpen, onViewPermissions, onViewMembers, onDuplicate, onDelete }: RolesColumnsOptions,
): TableColumnDef<Role, any>[] {
  const columns = [
    columnHelper.accessor(row => roleName(row, t), {
      id: 'role',
      header: () => t('admin.roles_page.col.role'),
      // Name click: custom → edit sheet, default → read-only dialog.
      cell: ({ row }) => (
        <RoleCell
          role={row.original}
          onOpen={() => (row.original.isDefault ? onViewPermissions(row.original) : onOpen(row.original))}
        />
      ),
      sortingFn: (a, b) => roleName(a.original, t).localeCompare(roleName(b.original, t)),
      size: 420,
      minSize: 260,
    }),
    columnHelper.accessor(row => scopeRank(row), {
      id: 'scope',
      header: () => t('admin.roles_page.col.scope'),
      cell: ({ row }) => {
        const scopes = getRoleScopes(row.original);
        if (!scopes.length) return <span className="text-sm text-muted-foreground">—</span>;
        return (
          <div className="flex flex-wrap gap-1.5">
            {scopes.map(scope => (
              <Badge key={scope} variant={SCOPE_BADGE_VARIANT[scope]} className="font-normal">
                {t(`admin.roles.scope.${scope}`)}
              </Badge>
            ))}
          </div>
        );
      },
      size: 200,
      minSize: 140,
    }),
    columnHelper.accessor(row => row.permissions.length, {
      id: 'permissions',
      header: () => t('admin.roles_page.col.permissions'),
      // The count doubles as a shortcut into the read-only permissions dialog (all roles).
      cell: ({ row }) => (
        <button
          type="button"
          onClick={() => onViewPermissions(row.original)}
          className="w-fit cursor-pointer text-sm text-primary hover:underline"
        >
          {t('admin.roles_page.permissions_count', { count: row.original.permissions.length })}
        </button>
      ),
      size: 160,
      minSize: 120,
    }),
    columnHelper.display({
      id: 'members',
      header: () => t('admin.roles_page.col.members'),
      cell: ({ row }) => <RoleUsageCell role={row.original} users={users} onViewMembers={onViewMembers} />,
      size: 200,
      minSize: 140,
    }),
    columnHelper.display({
      id: 'actions',
      header: () => null,
      cell: ({ row }) => (
        <RoleActionsCell
          role={row.original}
          onOpen={onOpen}
          onViewPermissions={onViewPermissions}
          onDuplicate={onDuplicate}
          onDelete={onDelete}
        />
      ),
      size: 56,
      minSize: 56,
    }),
  ];

  return columns as TableColumnDef<Role, any>[];
}

/** Column settings (order / visibility / sizing) matching the columns above. */
export function getRolesColumnSettings(t: TFunction<string, undefined>) {
  return createColumnSettings([
    { id: 'role', label: t('admin.roles_page.col.role'), visible: true, fixed: true, size: 420 },
    { id: 'scope', label: t('admin.roles_page.col.scope'), visible: true, size: 200 },
    { id: 'permissions', label: t('admin.roles_page.col.permissions'), visible: true, size: 160 },
    { id: 'members', label: t('admin.roles_page.col.members'), visible: true, size: 200 },
    { id: 'actions', label: '', visible: true, fixed: true, size: 56 },
  ]);
}
