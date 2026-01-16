import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { SearchIcon } from 'lucide-react';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/base/shadcn/table';
import { useI18n } from '@/components/hooks/i18n';
import { cn } from '@/components/lib/utils';

import Empty from '../empty';

import { HEADER_HEIGHT, ROW_HEIGHT, TableColumnDef } from './data-table';

const TABLE_MAX_HEIGHT = HEADER_HEIGHT + ROW_HEIGHT * 10;

type SimpleTableProps<TData> = {
  variant?: 'default' | 'borderless' | 'border';
  data: TData[];
  columns: TableColumnDef<TData, any>[];
  dataCy?: string;
};

/**
 * DisplayTable
 * Only display data in a table.
 * @see For more complexe case (needs pagination, re-order, re-sizing etc..) use DataTable instead
 */
function DisplayTable({ columns, variant = 'default', data, dataCy }: SimpleTableProps<any>) {
  const { t } = useI18n();
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="rounded-md w-full overflow-auto" style={{ maxHeight: `${TABLE_MAX_HEIGHT}px` }}>
      <Table data-cy={dataCy} className={cn({ 'border-collapse': variant == 'border' })}>
        <TableHeader>
          {table.getHeaderGroups().map(headerGroup => (
            <TableRow key={headerGroup.id} variant={variant}>
              {headerGroup.headers.map(header => (
                <TableHead
                  key={header.id}
                  className="h-[43px]"
                  style={{ width: `${header.getSize()}px` }}
                  colSpan={header.colSpan}
                >
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map(row => (
              <TableRow key={row.id} variant={variant} data-state={row.getIsSelected() && 'selected'}>
                {row.getVisibleCells().map(cell => (
                  <TableCell key={cell.id} className="h-[41px]">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow variant={variant}>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                <Empty title={t('common.table.no_result')} iconType="custom" icon={SearchIcon} size="mini" />
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
export default DisplayTable;
