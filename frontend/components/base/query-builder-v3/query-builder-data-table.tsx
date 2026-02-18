import { useState } from 'react';
import { PaginationState } from '@tanstack/react-table';
import useSWR from 'swr';

import { Count, CountBodyWithSqon, SortBody, Sqon, SqonContent, SqonOpEnum } from '@/api/api';

import DataTable, { TableProps } from '../data-table/data-table';
import { Card, CardContent } from '../shadcn/card';

import { useQBActiveQuery } from './hooks/use-query-builder';

// @TODO: Should be on api side just like CountBodyWithSqon
export interface IListInput {
  listBody: {
    additional_fields?: string[];
    limit: number;
    page_index: number;
    sort: SortBody[];
    sqon: Sqon;
  };
}

export interface ICountInput {
  countBody: CountBodyWithSqon;
}

type QueryBuilderDataTableProps<T> = Omit<TableProps<T>, 'loadingStates' | 'data' | 'pagination' | 'serverOptions'> & {
  fetcher: {
    list: (params: IListInput) => Promise<T[]>;
    count: (params: ICountInput) => Promise<Count>;
  };
};

/**
 * Wrapper for data-table
 * Used to access QBContext and create list and count query
 */
function QueryBuilderDataTable<T>({ fetcher, ...props }: QueryBuilderDataTableProps<T>) {
  const activeQuery = useQBActiveQuery();

  const [additionalFields, setAdditionalFields] = useState<string[]>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const [sorting, setSorting] = useState<SortBody[]>([]);

  const fetchList = useSWR<any[]>(
    `${props.id}-list`,
    () =>
      fetcher.list({
        listBody: {
          additional_fields: additionalFields,
          limit: pagination.pageSize,
          page_index: pagination.pageIndex,
          sort: sorting,
          sqon: {
            content: activeQuery.content as SqonContent,
            op: activeQuery.op as SqonOpEnum,
          },
        },
      }),
    {
      revalidateOnFocus: false,
      revalidateOnMount: true,
      shouldRetryOnError: false,
    },
  );

  const fetchTotal = useSWR<Count>(
    `${props.id}-count`,
    () =>
      fetcher.count({
        countBody: {
          sqon: {
            content: activeQuery.content as SqonContent,
            op: activeQuery.op as SqonOpEnum,
          },
        },
      }),
    {
      revalidateOnFocus: false,
      revalidateOnMount: true,
      shouldRetryOnError: false,
    },
  );
  return (
    <Card>
      <CardContent>
        <DataTable
          data={fetchList.data ?? []}
          total={fetchTotal.data?.count ?? 0}
          loadingStates={{ list: fetchList.isLoading, total: fetchTotal.isLoading }}
          serverOptions={{
            setAdditionalFields,
            onSortingChange: setSorting,
          }}
          pagination={{ state: pagination, type: 'server', onPaginationChange: setPagination }}
          {...props}
        />
      </CardContent>
    </Card>
  );
}
export default QueryBuilderDataTable;
