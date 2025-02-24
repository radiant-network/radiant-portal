import QueryPillField from "./QueryPill.Field";
import {
  BooleanOperators,
  ISqonGroupFilter,
  IValueFilter,
  TermOperators,
} from "@/components/model/sqon";
import cloneDeep from "lodash/cloneDeep";
import { useMemo } from "react";

export type QueryPillIsolatedBooleanProps = {
  groupFilter: ISqonGroupFilter;
};

function QueryPillIsolatedBoolean({
  groupFilter,
}: QueryPillIsolatedBooleanProps) {
  const newQueryDict: { [content: string]: any } = {};

  const formattedQuery = useMemo(
    function () {
      groupFilter.content.forEach((f: any) => {
        if (newQueryDict.hasOwnProperty(f.content.field)) {
          newQueryDict[f.content.field] = cloneDeep(
            newQueryDict[f.content.field]
          );

          newQueryDict[f.content.field].content.value = newQueryDict[
            f.content.field
          ].content.value.concat(f.content.value);

          if (
            f.op === TermOperators.in &&
            groupFilter.op === BooleanOperators.and &&
            groupFilter.skipBooleanOperatorCheck
          ) {
            newQueryDict[f.content.field].op = TermOperators.all;
          }
        } else {
          newQueryDict[f.content.field] = cloneDeep(f);
        }
      });

      return {
        ...groupFilter,
        content: Object.entries(newQueryDict).map((kv: any) => kv[1]),
      };
    },
    [groupFilter]
  );

  return (
    <QueryPillField valueFilter={formattedQuery.content[0] as IValueFilter} />
  );
}

export default QueryPillIsolatedBoolean;
