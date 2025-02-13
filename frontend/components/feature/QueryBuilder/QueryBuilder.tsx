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
import QueryBar from "./QueryBar/QueryBar";
import QueriesToolbar from "./QueriesToolbar";
import { QueryBuilderContext } from "./QueryBuilder.Context";
import SavedFiltersRightActions from "./SavedFilters/SavedFilters.RightActions";
import SavedFiltersLeftActions from "./SavedFilters/SavedFilters.LeftActions";

const QueryBuilder = (props: QueryBuilderProps) => {
  const queryBuilder = useQueryBuilder(props);

  return (
    <QueryBuilderContext.Provider value={{ queryBuilder }}>
      <Accordion type="multiple" defaultValue={["query-builder"]}>
        <AccordionItem value="query-builder" className="border-none">
          <AccordionTrigger
            asChild
            className="border py-4 px-5 rounded-t-sm data-[state=closed]:rounded-sm hover:cursor-pointer"
          >
            <SavedFiltersLeftActions className="mr-4" />
            <SavedFiltersRightActions className="ml-auto" />
          </AccordionTrigger>
          <AccordionContent className="border-l border-b border-r py-4 px-5 space-y-4 rounded-b-sm">
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
