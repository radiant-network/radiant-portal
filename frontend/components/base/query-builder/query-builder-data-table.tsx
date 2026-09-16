import { useEffect, useState } from 'react';
import type { PaginationState, RowData } from '@tanstack/react-table';
import useSWR from 'swr';

import type { OccurrenceCount, SortBody, SqonContent, SqonOpEnum } from '@/api/api';

import DataTable, { type TableProps } from '../data-table/data-table';
import { DataTableProvider } from '../data-table/hooks/use-data-table';
import { Card, CardContent } from '../shadcn/card';

import { useQBActiveQuery, useQBContext, useQBExtraBodyParams } from './hooks/use-query-builder';

type QueryBuilderDataTableProps<T extends RowData> = Omit<
  TableProps<T>,
  'loadingStates' | 'data' | 'pagination' | 'serverOptions'
> & {
  defaultPageSize?: number;
  swrId?: string | number;
  paginationType?: 'server' | 'hidden';
};

/**
 * Wrapper for data-table
 * Used to access QBContext and create list and count query
 */
function QueryBuilderDataTable<T extends RowData>({
  defaultPageSize = 10,
  swrId,
  paginationType = 'server',
  ...props
}: QueryBuilderDataTableProps<T>) {
  const activeQuery = useQBActiveQuery();
  const extraBodyParams = useQBExtraBodyParams();
  const { fetcher } = useQBContext();

  const [additionalFields, setAdditionalFields] = useState<string[]>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: defaultPageSize,
  });

  const [sorting, setSorting] = useState<SortBody[]>([]);

  const swrKey = swrId !== undefined ? `${props.id}:${swrId}` : props.id;

  const fetchList = useSWR<any[]>(
    {
      id: swrKey,
      listBody: {
        additional_fields: additionalFields,
        limit: pagination.pageSize,
        page_index: pagination.pageIndex,
        sort: sorting,
        sqon: {
          content: activeQuery.content as SqonContent,
          op: activeQuery.op as SqonOpEnum,
        },
        ...extraBodyParams,
      },
    },
    fetcher.list,
    {
      revalidateOnFocus: false,
      revalidateOnMount: true,
      shouldRetryOnError: false,
    },
  );

  const fetchCount = useSWR<OccurrenceCount>(
    {
      id: swrKey,
      countBody: {
        sqon: {
          content: activeQuery.content as SqonContent,
          op: activeQuery.op as SqonOpEnum,
        },
        ...extraBodyParams,
      },
    },
    fetcher.count,
    {
      revalidateOnFocus: false,
      revalidateOnMount: true,
      shouldRetryOnError: false,
    },
  );

  useEffect(() => {
    setPagination({
      pageIndex: 0,
      pageSize: pagination.pageSize,
    });
  }, [activeQuery, extraBodyParams]);

  return (
    <Card>
      <CardContent>
        <DataTableProvider list={fetchList} count={fetchCount}>
          <DataTable
            data={fetchList.data ?? []}
            total={fetchCount.data?.count ?? 0}
            filteredTotal={fetchCount.data?.filtered_count}
            loadingStates={{ list: fetchList.isLoading, total: fetchCount.isLoading }}
            serverOptions={{
              setAdditionalFields,
              onSortingChange: setSorting,
            }}
            pagination={
              paginationType === 'hidden'
                ? { type: 'hidden' }
                : { state: pagination, type: 'server', onPaginationChange: setPagination }
            }
            {...props}
          />
        </DataTableProvider>
      </CardContent>
    </Card>
  );
}
export default QueryBuilderDataTable;
