import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/base/select";
import {
  QueryBuilderProps,
  useQueryBuilder,
} from "../../model/query-builder-core";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/base/ui/accordion";
import QueryBar from "./QueryBar";
import QueriesToolbar from "./QueriesToolbar";
import { QueryBuilderContext } from "./QueryBuilder.Context";

const QueryBuilder = (props: QueryBuilderProps) => {
  const queryBuilder = useQueryBuilder(props);

  return (
    <QueryBuilderContext.Provider value={{ queryBuilder }}>
      <Accordion type="multiple" defaultValue={["query-builder"]}>
        <AccordionItem value="query-builder" className="border-none">
          <AccordionTrigger className="border py-4 px-5">
            <div className="flex w-full">
              <div>My Filter</div>
              <div className="flex flex-1 justify-end">
                <Select>
                  <SelectTrigger className="w-[120px] h-6">
                    My Filters
                  </SelectTrigger>
                  <SelectContent>
                    {queryBuilder._getSavedFilters().map((filter) => (
                      <SelectItem key={filter.id} value={filter.id}>
                        {filter.raw().title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="border-l border-b border-r py-4 px-5 space-y-4">
            <div className="flex flex-col gap-2">
              {queryBuilder.getQueries().map((query) => (
                <QueryBar key={query.id} query={query} />
              ))}
            </div>
            <QueriesToolbar />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </QueryBuilderContext.Provider>
  );
};

export default QueryBuilder;
