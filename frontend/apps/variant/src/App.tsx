import "./App.css";
import styles from "./App.module.css";
import {
  Count,
  CountBody,
  ListBody,
  Occurrence,
  SortBody,
  SortBodyOrderEnum,
  Sqon,
} from "@/api/api";
import DataTable from "@/components/base/data-table/data-table";
import { PaginationState } from "@tanstack/react-table";
import {
  columns,
  defaultSettings,
  userSettings,
} from "./include_variant_table";
import { IVariantEntity } from "@/variant_type";
import useSWR from "swr";
import { occurrencesApi } from "@/utils/api";
import QueryBuilder from "@/components/feature/query-builder/query-builder";
import { UsersIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { QueryBuilderState } from "@/components/model/query-builder-core";
import { queryBuilderRemote } from "@/components/model/query-builder-core/query-builder-remote";
import { FilterList } from "@/components/feature/QueryFilters/FilterList";

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
    field: "pf",
    order: SortBodyOrderEnum.Asc,
  },
];

async function fetchOccurencesList(input: OccurrencesListInput) {
  const response = await occurrencesApi.listOccurrences(
    input.seqId,
    input.listBody,
  );
  return response.data;
}

async function fetchOccurencesCount(input: OccurrenceCountInput) {
  const response = await occurrencesApi.countOccurrences(
    input.seqId,
    input.countBody,
  );
  return response.data;
}

const SEQ_ID = "5011";

function App() {
  const [qbState, setQbState] = useState<QueryBuilderState>();
  const [activeSqon, setActiveSqon] = useState<Sqon>({
    op: "and",
    content: [
      {
        op: "in",
        content: {
          field: "hgvsg",
          value: "chr18:g.3452225del",
        },
      },
    ],
  });
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const { data: total, isLoading: totalIsLoading } = useSWR<
    Count,
    any,
    OccurrenceCountInput
  >(
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

  const { data: list, isLoading: listIsLoading } = useSWR<
    Occurrence[],
    any,
    OccurrencesListInput
  >(
    {
      seqId: SEQ_ID,
      listBody: {
        selected_fields: [
          "hgvsg",
          "variant_class",
          "rsnumber",
          "symbol",
          "vep_impact",
          "mane_select",
          "omim_inheritance_code",
          "clinvar",
          "gnomad_v3_af",
          "pf",
          "genotype_quality",
          "zygosity",
          "ad_ratio",
        ],
        limit: pagination.pageSize,
        offset: pagination.pageIndex,
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
    const localQbState =
      queryBuilderRemote.getLocalQueryBuilderState("variant");

    setQbState({
      ...localQbState,
      savedFilters: [],
      selectedQueryIndexes: [0],
    });

    setActiveSqon(queryBuilderRemote.getActiveQuery("variant") as Sqon);
  }, []);

  return (
    <div className={styles.appLayout}>
      <aside>
        <FilterList />
      </aside>
      <main className="flex-1 p-4 h-full overflow-hidden">
        <h1 className="text-2xl font-bold">Variant</h1>
        <div className="py-4 space-y-2">
          <QueryBuilder
            id="variant"
            state={qbState}
            enableCombine
            enableFavorite
            enableShowHideLabels
            queryCountIcon={<UsersIcon size={14} />}
            fetchQueryCount={() => Promise.resolve(15)}
            onActiveQueryChange={(sqon) => setActiveSqon(sqon as Sqon)}
            onStateChange={(state) => {
              setQbState(state);
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
          subComponent={(data: IVariantEntity) => {
            return (
              <pre style={{ fontSize: "10px" }}>
                <code>{JSON.stringify(data, null, 2)}</code>
              </pre>
            );
          }}
          total={total?.count ?? 0}
        />
      </main>
    </div>
  );
}

export default App;
