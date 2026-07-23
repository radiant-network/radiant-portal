import { createColumnHelper } from '@tanstack/react-table';
import { TFunction } from 'i18next';
import { Pencil } from 'lucide-react';

import { createColumnSettings, TableColumnDef } from '@/components/base/data-table/data-table';
import { Button } from '@/components/base/shadcn/button';

import type { AdminUser } from '../../mock/types';

import RolesAccessCell from './cells/roles-access-cell';
import UserCell from './cells/user-cell';

const columnHelper = createColumnHelper<AdminUser>();

type UsersColumnsOptions = {
  onEdit: (user: AdminUser) => void;
};

/**
 * Column definitions for the Users table. Uses display columns (no server sorting in the mock).
 * The row action is a single edit-pencil; Delete (revoke tenant access) lives in the Edit sheet.
 */
export function getUsersColumns(
  t: TFunction<string, undefined>,
  { onEdit }: UsersColumnsOptions,
): TableColumnDef<AdminUser, any>[] {
  const columns = [
    columnHelper.display({
      id: 'user',
      header: () => t('admin.users.col.user'),
      cell: ({ row }) => <UserCell user={row.original} />,
      size: 300,
      minSize: 200,
    }),
    columnHelper.display({
      id: 'roles',
      header: () => t('admin.users.col.roles'),
      cell: ({ row }) => <RolesAccessCell roles={row.original.roles} />,
      size: 560,
      minSize: 240,
    }),
    columnHelper.display({
      id: 'actions',
      header: () => null,
      cell: ({ row }) => (
        <div className="flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            iconOnly
            aria-label={t('admin.users.edit_aria')}
            onClick={() => onEdit(row.original)}
          >
            <Pencil />
          </Button>
        </div>
      ),
      size: 56,
      minSize: 56,
    }),
  ];

  return columns as TableColumnDef<AdminUser, any>[];
}

/** Column settings (order / visibility / sizing) matching the columns above. */
export function getUsersColumnSettings(t: TFunction<string, undefined>) {
  return createColumnSettings([
    { id: 'user', label: t('admin.users.col.user'), visible: true, fixed: true, size: 300 },
    { id: 'roles', label: t('admin.users.col.roles'), visible: true, size: 560 },
    { id: 'actions', label: '', visible: true, fixed: true, size: 56 },
  ]);
}
