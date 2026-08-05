import { createColumnHelper } from '@tanstack/react-table';
import type { TFunction } from 'i18next';
import { Pencil } from 'lucide-react';

import { createColumnSettings, type TableColumnDef } from '@/components/base/data-table/data-table';
import { Button } from '@/components/base/shadcn/button';

import type { Organization } from '../../mock/types';

import OrgCell from './cells/org-cell';

const columnHelper = createColumnHelper<Organization>();

type OrgsColumnsOptions = {
  onEdit: (org: Organization) => void;
};

/**
 * Column definitions for the Organizations table. Display columns (no server sorting in the mock).
 * The row action is a single edit-pencil; Edit-name lives in the sheet. Delete is out of scope (v1).
 */
export function getOrgsColumns(
  t: TFunction<string, undefined>,
  { onEdit }: OrgsColumnsOptions,
): TableColumnDef<Organization, any>[] {
  const columns = [
    columnHelper.accessor(row => row.name, {
      id: 'org',
      header: () => t('admin.orgs.col.name'),
      cell: ({ row }) => <OrgCell org={row.original} onEdit={() => onEdit(row.original)} />,
      // Sortable by full name (locale-aware).
      sortingFn: (a, b) => a.original.name.localeCompare(b.original.name),
      size: 420,
      minSize: 240,
    }),
    columnHelper.accessor(row => row.category_code, {
      id: 'category',
      header: () => t('admin.orgs.col.category'),
      cell: ({ row }) => <span>{t(`admin.org_categories.${row.original.category_code}`)}</span>,
      sortingFn: (a, b) =>
        t(`admin.org_categories.${a.original.category_code}`).localeCompare(
          t(`admin.org_categories.${b.original.category_code}`),
        ),
      size: 440,
      minSize: 200,
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
            aria-label={t('admin.orgs.edit_aria')}
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

  return columns as TableColumnDef<Organization, any>[];
}

/** Column settings (order / visibility / sizing) matching the columns above. */
export function getOrgsColumnSettings(t: TFunction<string, undefined>) {
  return createColumnSettings([
    { id: 'org', label: t('admin.orgs.col.name'), visible: true, fixed: true, size: 420 },
    { id: 'category', label: t('admin.orgs.col.category'), visible: true, size: 440 },
    { id: 'actions', label: '', visible: true, fixed: true, size: 56 },
  ]);
}
