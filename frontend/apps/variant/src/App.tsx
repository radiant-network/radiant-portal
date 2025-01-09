import "./App.css";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "components/base/ui/accordion";
import { Table } from "components/base/ui/table/table";
import { variants } from "./include_variant_mock";
import {
  columns,
  userSettings,
  defaultSettings,
} from "./include_variant_table";
import { IVariantEntity } from "@/variant_type";

export interface AppProps {
  api: string;
}

function App({ api }: AppProps) {
  console.log(api);
  return (
    <div className="flex flex-1">
      <aside className="w-1/4 p-4">
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
          data={variants.data}
          total={variants.total}
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
