import { createColumnHelper } from '@tanstack/react-table';
import type { TFunction } from 'i18next';
import { Pencil } from 'lucide-react';

import type { OrganizationResponse } from '@/api/api';
import TextCell from '@/components/base/data-table/cells/text-cell';
import {
  type ColumnSettings,
  createColumnSettings,
  type TableColumnDef,
} from '@/components/base/data-table/data-table';
import AnchorLink from '@/components/base/navigation/anchor-link';
import { Button } from '@/components/base/shadcn/button';

const columnHelper = createColumnHelper<OrganizationResponse>();

export function getOrganizationsColumns(t: TFunction<string, undefined>) {
  return [
    columnHelper.accessor(row => row.code, {
      id: 'name',
      cell: info => (
        <div className="flex flex-col">
          <AnchorLink
            component="button"
            variant="secondary"
            size="sm"
            external={false}
            className="w-fit font-semibold uppercase"
            onClick={() => {}}
          >
            {info.getValue()}
          </AnchorLink>
          <span className="text-sm text-muted-foreground">{info.row.original.name}</span>
        </div>
      ),
      header: t('admin.organizations.table.name'),
      size: 420,
      minSize: 240,
    }),
    columnHelper.accessor(row => row.category_name, {
      id: 'category',
      cell: info => <TextCell>{info.getValue()}</TextCell>,
      header: t('admin.organizations.table.category'),
      size: 440,
      minSize: 200,
    }),
    columnHelper.display({
      id: 'actions',
      cell: () => (
        <div className="flex justify-center">
          <Button
            iconOnly
            size="xs"
            variant="ghost"
            aria-label={t('admin.organizations.table.edit')}
            onClick={() => {}}
          >
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
  ] as TableColumnDef<OrganizationResponse, any>[];
}

export const organizationsDefaultSettings: ColumnSettings[] = createColumnSettings([
  { id: 'name', visible: true, fixed: true, label: 'admin.organizations.table.name' },
  { id: 'category', visible: true, label: 'admin.organizations.table.category' },
  { id: 'actions', visible: true, fixed: true },
]);
