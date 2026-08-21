import { createColumnHelper } from '@tanstack/react-table';
import type { TFunction } from 'i18next';
import { Pencil } from 'lucide-react';

import type { UserResult, UserRoleResult } from '@/api/api';
import {
  type ColumnSettings,
  createColumnSettings,
  type TableColumnDef,
} from '@/components/base/data-table/data-table';
import AnchorLink from '@/components/base/navigation/anchor-link';
import { Badge } from '@/components/base/shadcn/badge';
import { Button } from '@/components/base/shadcn/button';

const columnHelper = createColumnHelper<UserResult>();

/**
 * Baseline role, granted tenant-wide to every user, so it never appears as a badge: a member
 * holding nothing else is labelled "Member" instead.
 */
const BASELINE_ROLE_CODE = 'member';
const ADMIN_ROLE_CODE = 'tenant_admin';

function adminFirst(a: UserRoleResult, b: UserRoleResult) {
  return Number(b.role_code === ADMIN_ROLE_CODE) - Number(a.role_code === ADMIN_ROLE_CODE);
}

/** `*` is the API's "every organization" grant; any other code is a single organization. */
function formatOrganizations(orgCodes: string[], t: TFunction<string, undefined>) {
  return orgCodes.map(code => (code === '*' ? t('admin.users.table.all_organizations') : code)).join(' • ');
}

function RolesCell({ roles, t }: { roles: UserRoleResult[]; t: TFunction<string, undefined> }) {
  const grantedRoles = roles.filter(role => role.role_code !== BASELINE_ROLE_CODE).sort(adminFirst);

  if (grantedRoles.length === 0) {
    return <span className="text-muted-foreground">{t('admin.users.table.baseline_role')}</span>;
  }

  return (
    <div className="flex flex-wrap gap-1">
      {grantedRoles.map(role => {
        const organizations = formatOrganizations(role.org_codes ?? [], t);
        return (
          <Badge key={role.role_code} variant={role.role_code === ADMIN_ROLE_CODE ? 'blue' : 'secondary'}>
            {role.name}
            {organizations && <span className="opacity-65">{organizations}</span>}
          </Badge>
        );
      })}
    </div>
  );
}

function getFullName(user: UserResult) {
  return [user.first_name, user.last_name].filter(Boolean).join(' ');
}

export function getUsersColumns(t: TFunction<string, undefined>, currentUserId: string) {
  return [
    columnHelper.accessor(row => getFullName(row), {
      id: 'name',
      cell: info => (
        <div className="flex flex-col">
          <span className="flex flex-wrap items-center gap-1">
            {/* TODO(SJRA-1449): opens the Edit member sheet */}
            <AnchorLink
              component="button"
              variant="secondary"
              size="sm"
              external={false}
              className="w-fit font-semibold hover:no-underline"
            >
              {info.getValue()}
            </AnchorLink>
            {info.row.original.user_id === currentUserId && (
              <span className="text-sm text-muted-foreground">{t('admin.users.table.you')}</span>
            )}
          </span>
          <span className="text-sm text-muted-foreground">{info.row.original.email}</span>
        </div>
      ),
      header: t('admin.users.table.name'),
      size: 420,
      minSize: 240,
      enableSorting: false,
    }),
    columnHelper.display({
      id: 'roles',
      cell: info => <RolesCell roles={info.row.original.roles} t={t} />,
      header: t('admin.users.table.roles'),
      size: 440,
      minSize: 200,
      enableSorting: false,
    }),
    columnHelper.display({
      id: 'actions',
      cell: () => (
        <div className="flex justify-center">
          {/* TODO(SJRA-1449): opens the Edit member sheet */}
          <Button iconOnly size="xs" variant="ghost" aria-label={t('admin.users.table.edit')}>
            <Pencil />
          </Button>
        </div>
      ),
      header: '',
      size: 56,
      minSize: 56,
      enableSorting: false,
      enablePinning: false,
    }),
  ] as TableColumnDef<UserResult, any>[];
}

export const usersDefaultSettings: ColumnSettings[] = createColumnSettings([
  { id: 'name', visible: true, fixed: true, label: 'admin.users.table.name' },
  { id: 'roles', visible: true, label: 'admin.users.table.roles' },
  { id: 'actions', visible: true, fixed: true },
]);
