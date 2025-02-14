import QueryBarIdentifier from "./QueryBar.Identifier";
import QueryBarActions from "./QueryBar.Actions";
import { QueryInstance } from "@/components/model/query-builder-core";
import { QueryBarContext } from "./QueryBar.Context";
import QueryBarCount from "./QueryBar.Count";
import QueryBarSelector from "./QueryBar.Selector";
import { tv } from "tailwind-variants";
import { useQueryBuilderContext } from "../QueryBuilder.Context";

const queryBar = tv({
  base: "flex flex-1 py-2 px-3 border ",
  variants: {
    selected: {
      true: ["border-[--gold-6] bg-[--gold-2]"],
      false: ["border-[--gray-5] bg-[--gray-2]"],
    },
  },
  defaultVariants: {
    selected: false,
  },
});

export type QueryBarProps = {
  query: QueryInstance;
};

const QueryBar = ({ query }: QueryBarProps) => {
  const selected = query.isActive();
  const { enableCombine } = useQueryBuilderContext();

  return (
    <QueryBarContext.Provider value={{ query }}>
      <div className="flex" onClick={() => query.setAsActive()}>
        <QueryBarIdentifier />
        {query.isSelectable() && enableCombine && <QueryBarSelector />}
        <div className={queryBar({ selected })}>
          <div className="flex-1">
            {query.isEmpty() ? (
              <>Use the search tools & facets on the left to build a query</>
            ) : (
              <div className="flex">
                <div className="flex-1">Pills</div>
                <QueryBarCount />
              </div>
            )}
          </div>
        </div>
        {query.isNotEmpty() && <QueryBarActions />}
      </div>
    </QueryBarContext.Provider>
  );
};

export default QueryBar;
