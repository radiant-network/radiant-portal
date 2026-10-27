import { type ReactNode, useEffect, useState } from 'react';
import type { PaginationState, RowData } from '@tanstack/react-table';
import useSWR from 'swr';

import type { OccurrenceCount, SortBody, SqonContent, SqonOpEnum } from '@/api/api';

import DataTable, { DEFAULT_PAGE_SIZE, type TableProps } from '../data-table/data-table';
import { DataTableProvider } from '../data-table/hooks/use-data-table';
import { Card, CardContent } from '../shadcn/card';

import { useQBActiveQuery, useQBContext, useQBExtraBodyParams, useQBExtraTableProps } from './hooks/use-query-builder';
import useTableSelection, { type TableSelection } from './hooks/use-table-selection';
import QueryBuilderSelectionSummary from './query-builder-selection-summary';

type QueryBuilderDataTableProps<T extends RowData> = Omit<
  TableProps<T>,
  'loadingStates' | 'data' | 'pagination' | 'serverOptions'
> & {
  defaultPageSize?: number;
  swrId?: string | number;
  paginationType?: 'server' | 'hidden';
  defaultSorting?: SortBody[];
  selection?: {
    idField: string;
    renderActions: (selection: TableSelection) => ReactNode;
  };
};

/**
 * Wrapper for data-table
 * Used to access QBContext and create list and count query
 */
function QueryBuilderDataTable<T extends RowData>({
  defaultPageSize = DEFAULT_PAGE_SIZE,
  swrId,
  paginationType = 'server',
  defaultSorting,
  selection,
  ...props
}: QueryBuilderDataTableProps<T>) {
  const activeQuery = useQBActiveQuery();
  const extraBodyParams = useQBExtraBodyParams();
  const extraTableProps = useQBExtraTableProps();
  const { fetcher } = useQBContext();

  const [additionalFields, setAdditionalFields] = useState<string[]>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: defaultPageSize,
  });

  const [sorting, setSorting] = useState<SortBody[]>(defaultSorting ?? []);

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

  const selectionTotal = extraTableProps.quickfilters?.enabled
    ? (fetchCount.data?.filtered_count ?? 0)
    : (fetchCount.data?.count ?? 0);

  const tableSelection = useTableSelection({
    idField: selection?.idField ?? '',
    pageRows: fetchList.data ?? [],
    total: selectionTotal,
    activeQuery,
    extraBodyParams,
    resetKey: swrKey,
    fetchList: fetcher.list,
  });

  const selectionProps = selection
    ? {
        getRowId: tableSelection.getRowId,
        rowSelection: tableSelection.rowSelection,
        onRowSelectionChange: tableSelection.onRowSelectionChange,
        toolbarActions: selection.renderActions(tableSelection.selection),
        selectionSummary:
          tableSelection.selection.selectedCount > 0 ? (
            <QueryBuilderSelectionSummary selection={tableSelection.selection} />
          ) : undefined,
      }
    : {};

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
            loadingStates={{ list: fetchList.isLoading, total: fetchCount.isLoading }}
            serverOptions={{
              setAdditionalFields,
              defaultSorting,
              onSortingChange: setSorting,
            }}
            pagination={
              paginationType === 'hidden'
                ? { type: 'hidden' }
                : { state: pagination, type: 'server', onPaginationChange: setPagination }
            }
            {...props}
            {...selectionProps}
            quickfilters={{
              enabled: extraTableProps.quickfilters?.enabled ?? false,
              total: fetchCount.data?.filtered_count ?? 0,
            }}
          />
        </DataTableProvider>
      </CardContent>
    </Card>
  );
}
export default QueryBuilderDataTable;
