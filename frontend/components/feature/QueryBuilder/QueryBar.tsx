import { cva } from "class-variance-authority";
import QueryBarIdentifier from "./QueryBar.Identifier";
import QueryBarActions from "./QueryBar.Actions";
import { QueryInstance } from "@/components/model/query-builder-core";
import { QueryBarContext } from "./QueryBar.Context";

const queryBar = cva("flex flex-1 py-2 px-3 border ", {
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

  return (
    <QueryBarContext.Provider value={{ query }}>
      <div className="flex" onClick={() => query.setAsActive()}>
        <QueryBarIdentifier />
        <div className={queryBar({ selected })}>
          <div className="flex-1">
            {query.isEmpty() ? (
              <> Use the search tools & facets on the left to build a query</>
            ) : (
              <>pills</>
            )}
          </div>
        </div>
        {query.isNotEmpty() && <QueryBarActions />}
      </div>
    </QueryBarContext.Provider>
  );
};

export default QueryBar;
