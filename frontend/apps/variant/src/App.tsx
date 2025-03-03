import "./App.css";
import styles from "./App.module.css";
import {
  Count,
  CountBody,
  ListBody,
  Occurrence,
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
import SidenavFilters from "./components/layouts/SidenavFilters";

type OccurrencesListInput = {
  seqId: string;
  listBody: ListBody;
};

type OccurrenceCountInput = {
  seqId: string;
  countBody: CountBody;
};

function fetchOccurencesList(input: OccurrencesListInput) {
  return occurrencesApi
    .listOccurrences(input.seqId, input.listBody)
    .then((response) => response.data);
}

function fetchOccurencesCount(input: OccurrenceCountInput) {
  return occurrencesApi
    .countOccurrences(input.seqId, input.countBody)
    .then((response) => response.data);
}

const SEQ_ID = "5011";

function App() {
  const [qbState, setQbState] = useState<QueryBuilderState>();
  const [activeSqon, setActiveSqon] = useState<Sqon>();
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const { data: total } = useSWR<Count, any, OccurrenceCountInput>(
    {
      seqId: SEQ_ID,
      countBody: { sqon: activeSqon },
    },
    fetchOccurencesCount,
    {
      revalidateOnFocus: false,
    }
  );

  const { data: list } = useSWR<Occurrence[], any, OccurrencesListInput>(
    {
      seqId: SEQ_ID,
      listBody: {
        selected_fields: ["hgvsg", "variant_class"],
        limit: pagination.pageSize,
        offset: pagination.pageIndex,
        sort: [
          {
            field: "pf",
            order: SortBodyOrderEnum.Asc,
          },
        ],
        sqon: activeSqon,
      },
    },
    fetchOccurencesList,
    {
      revalidateOnFocus: false,
    }
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
      <SidenavFilters />
      <main className="flex-1 p-4 h-full">
        <h1 className="text-2xl font-bold">Variant</h1>
        <div className="py-4 space-y-2">
          <QueryBuilder
            id="variant"
            state={qbState}
            enableCombine
            enableFavorite
            enableShowHideLabels
            queryCountIcon={UsersIcon}
            fetchQueryCount={() => Promise.resolve(15)}
            onActiveQueryChange={(sqon) => setActiveSqon(sqon as Sqon)}
            onStateChange={(state) => {
              setQbState(state);
            }}
          />
        </div>
        <DataTable
          pagination={pagination}
          onPaginationChange={setPagination}
          columns={columns}
          defaultColumnSettings={defaultSettings}
          data={list ?? []}
          total={total?.count ?? 0}
          columnSettings={userSettings}
          subComponent={(data: IVariantEntity) => {
            return (
              <pre style={{ fontSize: "10px" }}>
                <code>{JSON.stringify(data, null, 2)}</code>
              </pre>
            );
          }}
        />
      </main>
    </div>
  );
}

export default App;
