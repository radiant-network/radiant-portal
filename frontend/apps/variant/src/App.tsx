import styles from './App.module.css';
import { Count, CountBody, ListBody, Occurrence, SortBody, SortBodyOrderEnum, Sqon } from '@/api/api';
import DataTable from '@/components/base/data-table/data-table';
import { PaginationState } from '@tanstack/react-table';
import { columns, defaultSettings, userSettings } from '@/feature/variant-table/table-settings';
import useSWR from 'swr';
import { occurrencesApi } from '@/utils/api';
import QueryBuilder from '@/components/feature/query-builder/query-builder';
import { useEffect, useState } from 'react';
import { QueryBuilderState, resolveSyntheticSqon } from '@/components/model/query-builder-core';
import { queryBuilderRemote } from '@/components/model/query-builder-core/query-builder-remote';
import { FilterList } from '@/components/feature/query-filters/filter-list';
import { useConfig } from '@/components/model/applications-config';
import VariantIcon from '@/components/base/icons/variant-icon';
import VariantTablePreview from './feature/variant-table/variant-table-preview';
import { FilterComponent, FilterContainer } from '@/components/feature/query-filters/filter-container';

type OccurrencesListInput = {
  seqId: string;
  listBody: ListBody;
};

type OccurrenceCountInput = {
  seqId: string;
  countBody: CountBody;
};

const DEFAULT_SORTING = [
  {
    field: 'pf',
    order: SortBodyOrderEnum.Asc,
  },
];

async function fetchOccurencesList(input: OccurrencesListInput) {
  const response = await occurrencesApi.listOccurrences(input.seqId, input.listBody);
  return response.data;
}

async function fetchOccurencesCount(input: OccurrenceCountInput) {
  const response = await occurrencesApi.countOccurrences(input.seqId, input.countBody);
  return response.data;
}

const SEQ_ID = '5011';

function App() {
  const config = useConfig();
  const [qbState, setQbState] = useState<QueryBuilderState>();
  const [activeSqon, setActiveSqon] = useState<Sqon>({
    op: 'and',
    content: [],
  });
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const { data: total, isLoading: totalIsLoading } = useSWR<Count, any, OccurrenceCountInput>(
    {
      seqId: SEQ_ID,
      countBody: { sqon: activeSqon },
    },
    fetchOccurencesCount,
    {
      revalidateOnFocus: false,
    },
  );
  const [sorting, setSorting] = useState<SortBody[]>(DEFAULT_SORTING);

  const appId = config.variant_entity.app_id;

  const { data: list, isLoading: listIsLoading } = useSWR<Occurrence[], any, OccurrencesListInput>(
    {
      seqId: SEQ_ID,
      listBody: {
        additional_fields: [
          'rsnumber',
          'symbol',
          'vep_impact',
          'mane_select',
          'omim_inheritance_code',
          'clinvar',
          'pf',
          'transcript_id',
        ],
        limit: pagination.pageSize,
        page_index: pagination.pageIndex,
        sort: sorting,
        sqon: activeSqon,
      },
    },
    fetchOccurencesList,
    {
      revalidateOnFocus: false,
    },
  );

  useEffect(() => {
    const localQbState = queryBuilderRemote.getLocalQueryBuilderState(appId);

    setQbState({
      ...localQbState,
      savedFilters: [],
      selectedQueryIndexes: [0],
    });
    setActiveSqon(queryBuilderRemote.getResolvedActiveQuery(appId) as Sqon);
  }, []);

  useEffect(() => {
    setPagination({
      pageIndex: 0,
      pageSize: pagination.pageSize,
    });
  }, [JSON.stringify(qbState?.queries), qbState?.activeQueryId]);

  return (
    <div className={styles.appLayout}>
      <aside>
        <FilterList />
      </aside>
      <main className="flex-1 p-4 h-full overflow-hidden">
        <h1 className="text-2xl font-bold">Variant</h1>
        <div className="py-4 space-y-2">
          <QueryBuilder
            id={appId}
            state={qbState}
            enableCombine
            enableFavorite
            enableShowHideLabels
            queryCountIcon={<VariantIcon size={14} />}
            fetchQueryCount={resolvedSqon =>
              fetchOccurencesCount({
                seqId: SEQ_ID,
                countBody: {
                  sqon: resolvedSqon,
                },
              }).then(res => res.count || 0)
            }
            resolveSyntheticSqon={resolveSyntheticSqon}
            onActiveQueryChange={sqon => setActiveSqon(resolveSyntheticSqon(sqon, qbState?.queries || []) as Sqon)}
            onStateChange={state => {
              setQbState(state);
            }}
            queryPillFacetFilterConfig={{
              enable: true,
              blacklistedFacets: ['locus_id'],
              onFacetClick: filter => (
                <FilterComponent
                  field={config.variant_entity.aggregations.find(f => f.key === filter.content.field)!}
                  searchVisible={true}
                />
              ),
            }}
          />
        </div>
        <DataTable
          columns={columns}
          columnSettings={userSettings}
          data={list ?? []}
          defaultColumnSettings={defaultSettings}
          defaultServerSorting={DEFAULT_SORTING}
          loadingStates={{
            total: totalIsLoading,
            list: listIsLoading,
          }}
          pagination={pagination}
          onPaginationChange={setPagination}
          onServerSortingChange={setSorting}
          subComponent={data => <VariantTablePreview occurence={data} />}
          total={total?.count ?? 0}
        />
      </main>
    </div>
  );
}

export default App;
