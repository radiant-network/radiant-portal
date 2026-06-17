import { useState } from 'react';
import useSWR from 'swr';

import { type Count, type SortBody, type SqonContent, SqonOpEnum } from '@/api/api';
import DataTable, { type TableProps } from '@/components/base/data-table/data-table';
import { DataTableProvider } from '@/components/base/data-table/hooks/use-data-table';
import { useQBActiveQuery, useQBContext } from '@/components/base/query-builder/hooks/use-query-builder';
import { Card, CardContent } from '@/components/base/shadcn/card';

/**
 * Mirrors `QueryBuilderDataTable`, but renders without pagination (the reference Studies page
 * shows every result at once). It reads the active sqon from QBContext and fetches via the
 * mock `fetcher`. A single large page is fetched so the totals footer covers the full set.
 * TODO(back): switch back to server pagination once the studies endpoint exists.
 */
const PAGE_SIZE = 1000;

type StudyDataTableProps<T> = Omit<TableProps<T>, 'loadingStates' | 'data' | 'pagination' | 'serverOptions'>;

export default function StudyDataTable<T>(props: StudyDataTableProps<T>) {
  const activeQuery = useQBActiveQuery();
  const { fetcher } = useQBContext();
  const [sorting, setSorting] = useState<SortBody[]>([]);

  const sqon = { content: activeQuery.content as SqonContent, op: activeQuery.op as SqonOpEnum };

  const fetchList = useSWR<any[]>(
    { id: props.id, listBody: { additional_fields: [], limit: PAGE_SIZE, page_index: 0, sort: sorting, sqon } },
    fetcher.list,
    { revalidateOnFocus: false, shouldRetryOnError: false },
  );

  const fetchCount = useSWR<Count>({ id: `${props.id}-count`, countBody: { sqon } }, fetcher.count, {
    revalidateOnFocus: false,
    shouldRetryOnError: false,
  });

  // TODO check si on peut utiliser QB data table
  return (
    <Card>
      <CardContent>
        <DataTableProvider list={fetchList} count={fetchCount}>
          <DataTable
            data={fetchList.data ?? []}
            total={fetchCount.data?.count ?? 0}
            loadingStates={{ list: fetchList.isLoading, total: fetchCount.isLoading }}
            serverOptions={{ onSortingChange: setSorting }}
            pagination={{ type: 'hidden' }}
            {...props}
          />
        </DataTableProvider>
      </CardContent>
    </Card>
  );
}
