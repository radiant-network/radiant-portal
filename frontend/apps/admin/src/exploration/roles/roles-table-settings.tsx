import { createColumnHelper } from '@tanstack/react-table';
import type { TFunction } from 'i18next';
import { CopyIcon, EllipsisVerticalIcon, EyeIcon, LockIcon, PencilIcon, Trash2Icon } from 'lucide-react';

import type { RoleResult } from '@/api/api';
import {
  type ColumnSettings,
  createColumnSettings,
  type TableColumnDef,
} from '@/components/base/data-table/data-table';
import AnchorLink from '@/components/base/navigation/anchor-link';
import { Button } from '@/components/base/shadcn/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/base/shadcn/dropdown-menu';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/base/shadcn/tooltip';

import { ScopeBadges } from './role-scope-badges';
import { ADMIN_ROLE_CODE } from './roles-utils';

const columnHelper = createColumnHelper<RoleResult>();

type RolesColumnsActions = {
  onViewPermissions: (role: RoleResult) => void;
  onViewMembers: (role: RoleResult) => void;
  onEdit: (role: RoleResult) => void;
};

export function getRolesColumns(t: TFunction<string, undefined>, actions: RolesColumnsActions) {
  return [
    columnHelper.accessor(row => row.name, {
      id: 'role',
      cell: info => {
        const role = info.row.original;

        return (
          <div>
            <span className="flex items-center gap-1.5">
              <AnchorLink
                component="button"
                variant="secondary"
                size="sm"
                external={false}
                className="w-fit font-semibold hover:no-underline"
                onClick={() => (role.is_default ? actions.onViewPermissions(role) : actions.onEdit(role))}
              >
                {role.name}
              </AnchorLink>
              {role.is_default && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span tabIndex={0} className="inline-flex">
                      <LockIcon className="size-3.5 shrink-0 text-muted-foreground" />
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>{t('admin.roles.permissions.locked')}</TooltipContent>
                </Tooltip>
              )}
            </span>
            <span className="block whitespace-normal text-sm text-muted-foreground">{role.description}</span>
          </div>
        );
      },
      header: t('admin.roles.table.role'),
      size: 520,
      minSize: 320,
    }),
    columnHelper.accessor(row => row.scope, {
      id: 'scope',
      cell: info => <ScopeBadges scope={info.getValue()} />,
      header: t('admin.roles.table.scope'),
      size: 200,
      minSize: 160,
    }),
    columnHelper.accessor(row => row.actions.length, {
      id: 'permissions',
      cell: info => (
        <AnchorLink
          component="button"
          size="sm"
          external={false}
          onClick={() => actions.onViewPermissions(info.row.original)}
        >
          {t('admin.roles.table.permissions_count', { count: info.getValue() })}
        </AnchorLink>
      ),
      header: t('admin.roles.table.permissions'),
      size: 180,
      minSize: 140,
    }),
    columnHelper.accessor(row => row.assigned_users_count ?? 0, {
      id: 'assigned_to',
      cell: info => {
        const count = info.getValue();
        const label = t('admin.roles.table.members_count', { count });

        if (count === 0) {
          return <span className="text-muted-foreground">{label}</span>;
        }

        return (
          <AnchorLink
            component="button"
            size="sm"
            external={false}
            onClick={() => actions.onViewMembers(info.row.original)}
          >
            {label}
          </AnchorLink>
        );
      },
      header: t('admin.roles.table.assigned_to'),
      size: 200,
      minSize: 160,
      enableSorting: false,
    }),
    columnHelper.display({
      id: 'actions',
      cell: info => {
        const role = info.row.original;

        if (role.code === ADMIN_ROLE_CODE) {
          return (
            <div className="flex justify-center">
              <Button
                iconOnly
                size="xs"
                variant="ghost"
                aria-label={t('admin.roles.table.view_role')}
                onClick={() => actions.onViewPermissions(role)}
              >
                <EyeIcon />
              </Button>
            </div>
          );
        }

        return (
          <div className="flex justify-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button iconOnly size="xs" variant="ghost" aria-label={t('admin.roles.table.actions')}>
                  <EllipsisVerticalIcon />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {role.is_default ? (
                  <DropdownMenuItem onClick={() => actions.onViewPermissions(role)}>
                    <EyeIcon />
                    {t('admin.roles.table.view')}
                  </DropdownMenuItem>
                ) : (
                  // TODO(SJRA-1450): opens the Edit role sheet, which lands with its API endpoint
                  <DropdownMenuItem>
                    <PencilIcon />
                    {t('admin.roles.table.edit')}
                  </DropdownMenuItem>
                )}
                {/* TODO(SJRA-1450): duplicating creates a custom role, so it needs the create endpoint */}
                <DropdownMenuItem>
                  <CopyIcon />
                  {t('admin.roles.table.duplicate')}
                </DropdownMenuItem>
                {!role.is_default && (
                  // TODO(SJRA-1450): lands with the delete endpoint and its impact confirmation
                  <DropdownMenuItem className="text-destructive focus:bg-destructive/10 focus:text-destructive">
                    <Trash2Icon />
                    {t('admin.roles.table.delete')}
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
      header: '',
      size: 56,
      minSize: 56,
      enableSorting: false,
      enablePinning: false,
    }),
  ] as TableColumnDef<RoleResult, any>[];
}

export const rolesDefaultSettings: ColumnSettings[] = createColumnSettings([
  { id: 'role', visible: true, fixed: true, label: 'admin.roles.table.role' },
  { id: 'scope', visible: true, label: 'admin.roles.table.scope' },
  { id: 'permissions', visible: true, label: 'admin.roles.table.permissions' },
  { id: 'assigned_to', visible: true, label: 'admin.roles.table.assigned_to' },
  { id: 'actions', visible: true, fixed: true },
]);
