import "./App.css";
import styles from "./App.module.css";
import { ListBody, Occurrence, SortBodyOrderEnum, Sqon } from "@/api/api";
import Table from "@/components/base/Table/Table";
import {
  columns,
  defaultSettings,
  userSettings,
} from "./include_variant_table";
import { IVariantEntity } from "@/variant_type";
import useSWR from "swr";
import { occurrencesApi } from "@/utils/api";
import QueryBuilder from "@/components/feature/QueryBuilder/QueryBuilder";
import { UsersIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { QueryBuilderState } from "@/components/model/query-builder-core";
import { queryBuilderRemote } from "@/components/model/query-builder-core/query-builder-remote";
import SidenavFilters from "./components/layouts/SidenavFilters";

type OccurrenceInput = {
  seqId: string;
  listBody: ListBody;
};

const fetcher = (input: OccurrenceInput) =>
  occurrencesApi
    .listOccurrences(input.seqId, input.listBody)
    .then((response) => response.data);

function App() {
  const [qbState, setQbState] = useState<QueryBuilderState>();
  const [activeSqon, setActiveSqon] = useState<Sqon>();

  const { data } = useSWR<Occurrence[], any, OccurrenceInput>(
    {
      seqId: "5011",
      listBody: {
        selected_fields: ["hgvsg", "variant_class"],
        limit: 20,
        offset: 0,
        sort: [
          {
            field: "pf",
            order: SortBodyOrderEnum.Asc,
          },
        ],
        sqon: activeSqon,
      },
    },
    fetcher,
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

  const occurrences = data || [];

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
        <Table
          columns={columns}
          defaultColumnSettings={defaultSettings}
          data={occurrences}
          total={occurrences.length}
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
