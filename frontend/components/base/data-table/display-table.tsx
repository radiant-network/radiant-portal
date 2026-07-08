import { flexRender, getCoreRowModel, OnChangeFn, RowSelectionState, useReactTable } from '@tanstack/react-table';
import { SearchIcon } from 'lucide-react';

import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/base/shadcn/table';
import { useI18n } from '@/components/hooks/i18n';
import { cn } from '@/components/lib/utils';

import Empty from '../empties/empty';

import { HEADER_HEIGHT, ROW_HEIGHT, TableColumnDef } from './data-table';

const TABLE_MAX_HEIGHT = HEADER_HEIGHT + ROW_HEIGHT * 10;

type SimpleTableProps<TData> = {
  variant?: 'default' | 'borderless' | 'border';
  data: TData[];
  columns: TableColumnDef<TData, any>[];
  rowSelection?: RowSelectionState;
  onRowSelectionChange?: OnChangeFn<RowSelectionState>;
  dataCy?: string;
};

/**
 * DisplayTable
 * Only display data in a table.
 * @see For more complexe case (needs pagination, re-order, re-sizing etc..) use DataTable instead
 */
function DisplayTable({
  columns,
  variant = 'default',
  data,
  rowSelection = {},
  onRowSelectionChange,
  dataCy,
}: SimpleTableProps<any>) {
  const { t } = useI18n();
  const table = useReactTable({
    state: {
      rowSelection,
    },
    data,
    columns,
    enableRowSelection: !!onRowSelectionChange && !!rowSelection,
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: onRowSelectionChange,
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
              <TableCell colSpan={table.getAllLeafColumns().length} className="h-24 text-center">
                <Empty title={t('common.table.no_result')} iconType="custom" icon={SearchIcon} size="mini" />
              </TableCell>
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          {table.getFooterGroups().map(footerGroup => (
            <TableRow key={footerGroup.id} variant={variant}>
              {footerGroup.headers.map(header => {
                const footerColSpan = (header.column.columnDef.meta as { footerColSpan?: number } | undefined)
                  ?.footerColSpan;
                if (footerColSpan === 0) return null;
                return (
                  <TableCell
                    key={header.id}
                    style={{ width: `${header.getSize()}px` }}
                    colSpan={footerColSpan ?? header.colSpan}
                  >
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.footer, header.getContext())}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableFooter>
      </Table>
    </div>
  );
}
export default DisplayTable;
