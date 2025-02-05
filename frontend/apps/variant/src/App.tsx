import "./App.css";
import styles from "./App.module.css";
import { ListBody, Occurrence, SortBodyOrderEnum, SqonOpEnum } from "@/api/api";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "components/base/ui/accordion";
import { Table } from "components/base/ui/table/table";
import {
  columns,
  userSettings,
  defaultSettings,
} from "./include_variant_table";
import { IVariantEntity } from "@/variant_type";
import useSWR, { Fetcher } from "swr";

export interface AppProps {}

const fetcher: Fetcher<Occurrence[], string> = (url: string) =>
  fetch(url, {
    method: "POST",
    body: JSON.stringify({
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
          field: "impact_score",
          op: SqonOpEnum.In,
          value: [4],
        },
      },
    }),
  }).then((res) => res.json());

function App({}: AppProps) {
  const { data, error, isLoading } = useSWR("/api/occurrences", fetcher, {
    revalidateOnFocus: false,
  });
  const occurrences = data || [];

  return (
    <div className={styles.appLayout}>
      <aside>
        <ul>
          <li>
            <Accordion type="single" collapsible>
              <AccordionItem value="item-1">
                <AccordionTrigger>Aggregation 1</AccordionTrigger>
                <AccordionContent>
                  <input
                    type="checkbox"
                    id="aggre1"
                    name="aggre1"
                    value="Aggre1"
                  />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </li>
          <li>
            <Accordion type="single" collapsible>
              <AccordionItem value="item-1">
                <AccordionTrigger>Aggregation 2</AccordionTrigger>
                <AccordionContent>
                  <input
                    type="checkbox"
                    id="aggre1"
                    name="aggre1"
                    value="Aggre1"
                  />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </li>
          <li>
            <Accordion type="single" collapsible>
              <AccordionItem value="item-1">
                <AccordionTrigger>Aggregation 3</AccordionTrigger>
                <AccordionContent>
                  <input
                    type="checkbox"
                    id="aggre1"
                    name="aggre1"
                    value="Aggre1"
                  />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </li>
        </ul>
      </aside>

      <main className="flex-1 p-4 h-full">
        <h1 className="text-2xl font-bold">Variant</h1>
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
