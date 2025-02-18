import "./App.css";
import styles from "./App.module.css";
import { ListBody, Occurrence, SortBodyOrderEnum, SqonOpEnum } from "@/api/api";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/base/ui/accordion";
import { Table } from "@/components/base/Table/Table";
import { MultiSelect } from "@/components/feature/QueryFilters/MultiSelect";
import {
  columns,
  defaultSettings,
  userSettings,
} from "./include_variant_table";
import { IVariantEntity } from "@/variant_type";
import useSWR from "swr";
import { occurrencesApi } from "@/utils/api";

type OccurrenceInput = {
  seqId: string;
  listBody: ListBody;
};

const fetcher = (input: OccurrenceInput) =>
  occurrencesApi
    .listOccurrences(input.seqId, input.listBody)
    .then((response) => response.data);

function App() {
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
        sqon: {
          content: {
            field: "impact_score",
            value: [4],
          },
          op: SqonOpEnum.In,
        },
      },
    },
    fetcher,
    {
      revalidateOnFocus: false,
    }
  );
  const occurrences = data || [];

  return (
    <div className={styles.appLayout}>
      <SidenavFilters />
      <main className="flex-1 p-4 h-full">
        <h1 className="text-2xl font-bold">Variant</h1>
        <Button
          onClick={() => {
            queryBuilderRemote.addQuery("variant", {
              id: v4(),
              op: "and",
              content: [
                {
                  content: {
                    value: ["something"],
                    field: "field1",
                  },
                  op: "in",
                },
                {
                  content: {
                    value: ["something"],
                    field: "field2",
                  },
                  op: "in",
                },
              ],
            });
          }}
        >
          Add Query
        </Button>
        <QueryBuilder
          id="variant"
          enableCombine
          enableFavorite
          enableShowHideLabels
          queryCountIcon={UsersIcon}
          onActiveQueryChange={(sqon) =>
            console.log("onActiveQueryChange", sqon)
          }
          onSavedFilterSave={() => console.log("onSavedFilterSave")}
          onQueryCreate={() => console.log("onQueryCreate")}
          onQueryDelete={() => console.log("onQueryDelete")}
          onQueryUpdate={() => console.log("onQueryUpdate")}
          onQuerySelectChange={() => console.log("onQuerySelectChange")}
          onStateChange={(newState) => console.log("onStateChange", newState)}
          fetchQueryCount={() => Promise.resolve(15)}
        />
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
