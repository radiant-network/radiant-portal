import QueryBarIdentifier from "./query-bar-identifier";
import QueryBarActions from "./query-bar-actions";
import {
  isBooleanOperator,
  QueryInstance,
} from "@/components/model/query-builder-core";
import { QueryBarContext } from "./query-bar-context";
import QueryBarCount from "./query-bar-count";
import QueryBarSelector from "./query-bar-selector";
import { tv } from "tailwind-variants";
import {
  useQueryBuilderContext,
  useQueryBuilderDictContext,
} from "../query-builder-context";
import QueryPillBoolean from "../query-pill/query-pill-boolean";

const queryBar = tv({
  base: "flex flex-1 py-2 px-3 border ",
  variants: {
    active: {
      true: [
        "border-[--query-bar-border-color-active] bg-[--query-bar-bg-active]",
      ],
      false: ["border-gray-400 bg-gray-100"],
    },
  },
  defaultVariants: {
    active: false,
  },
});

export type QueryBarProps = {
  query: QueryInstance;
};

function QueryBar({ query }: QueryBarProps) {
  const active = query.isActive();
  const dict = useQueryBuilderDictContext();
  const { enableCombine } = useQueryBuilderContext();

  const handleSetAsActive = () => {
    if (!active) {
      query.setAsActive();
    }
  };

  return (
    <QueryBarContext.Provider value={{ query }}>
      <div
        data-query-active={active}
        className="flex group/query"
        onClick={handleSetAsActive}
      >
        <QueryBarIdentifier />
        {enableCombine && <QueryBarSelector />}
        <div className={queryBar({ active })}>
          <div className="flex-1">
            {query.isEmpty() ? (
              <>{dict.queryBar.empty}</>
            ) : (
              <div className="flex">
                <div className="flex-1">
                  {isBooleanOperator(query.raw()) && (
                    <div className="flex items-center flex-wrap pr-2">
                      <QueryPillBoolean sqon={query.raw()} />
                    </div>
                  )}
                </div>
                <QueryBarCount />
              </div>
            )}
          </div>
        </div>
        {query.isNotEmpty() && <QueryBarActions />}
      </div>
    </QueryBarContext.Provider>
  );
}

export default QueryBar;
