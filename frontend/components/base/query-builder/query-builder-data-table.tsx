import { useEffect, useState } from 'react';
import { PaginationState } from '@tanstack/react-table';
import useSWR from 'swr';

import { Count, SortBody, SqonContent, SqonOpEnum } from '@/api/api';

import DataTable, { TableProps } from '../data-table/data-table';
import { DataTableProvider } from '../data-table/hooks/use-data-table';
import { Card, CardContent } from '../shadcn/card';

import { useQBActiveQuery, useQBContext } from './hooks/use-query-builder';

const HIDDEN_PAGINATION_LIMIT = 1000;

type QueryBuilderDataTableProps<T> = Omit<TableProps<T>, 'loadingStates' | 'data' | 'pagination' | 'serverOptions'> & {
  defaultPageSize?: number;
  swrId?: string | number;
  paginationType?: 'server' | 'hidden';
};

/**
 * Wrapper for data-table
 * Used to access QBContext and create list and count query
 */
function QueryBuilderDataTable<T>({
  defaultPageSize = 10,
  swrId,
  paginationType = 'server',
  ...props
}: QueryBuilderDataTableProps<T>) {
  const activeQuery = useQBActiveQuery();
  const { fetcher } = useQBContext();

  const isPaginationHidden = paginationType === 'hidden';

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
        limit: isPaginationHidden ? HIDDEN_PAGINATION_LIMIT : pagination.pageSize,
        page_index: isPaginationHidden ? 0 : pagination.pageIndex,
        sort: sorting,
        sqon: {
          content: activeQuery.content as SqonContent,
          op: activeQuery.op as SqonOpEnum,
        },
      },
    },
    fetcher.list,
    {
      revalidateOnFocus: false,
      revalidateOnMount: true,
      shouldRetryOnError: false,
    },
  );

  const fetchCount = useSWR<Count>(
    {
      id: swrKey,
      countBody: {
        sqon: {
          content: activeQuery.content as SqonContent,
          op: activeQuery.op as SqonOpEnum,
        },
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
  }, [activeQuery]);

  return (
    <Card>
      <CardContent>
        <DataTableProvider list={fetchList} count={fetchCount}>
          <DataTable
            data={fetchList.data ?? []}
            total={fetchCount.data?.count ?? 0}
            loadingStates={{ list: fetchList.isLoading, total: fetchCount.isLoading }}
            serverOptions={{
              setAdditionalFields,
              onSortingChange: setSorting,
            }}
            pagination={
              isPaginationHidden
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
