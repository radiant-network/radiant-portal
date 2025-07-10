import { ColumnSettings } from '@/components/base/data-table/data-table';
import { Skeleton } from '@/components/base/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/base/ui/table';
import { HeaderGroup, PaginationState } from '@tanstack/react-table';
import { ReactElement } from 'react';

type DataTableSkeletonLoadingProps = {
  loading?: boolean;
  headerGroups: HeaderGroup<any>[];
  pagination: PaginationState;
  columnSettings: ColumnSettings[];
  children: ReactElement | ReactElement[];
};

/**
 * With server side rendering, localStorage will cause issues
 * and make both server and client rendering differ.
 *
 * Using a skeleton prevent those issues
 */
function DataTableSkeletonLoading({
  headerGroups,
  pagination,
  columnSettings,
  loading = true,
  children,
}: DataTableSkeletonLoadingProps) {
  if (loading) {
    return (
      <Table>
        <TableHeader>
          {headerGroups.map(headerGroup => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <TableHead key={header.id}>
                  <Skeleton className="w-full h-[24px]" />
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {new Array(pagination.pageSize).fill(0).map((_, index) => (
            <TableRow key={`skeleton-row-${index}`}>
              <TableCell colSpan={columnSettings.length}>
                <Skeleton className="w-full h-[20px]" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }

  return <>{children}</>;
}

export default DataTableSkeletonLoading;
