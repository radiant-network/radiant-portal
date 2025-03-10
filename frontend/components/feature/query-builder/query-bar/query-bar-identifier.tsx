import { useQueryBuilderContext } from "../query-builder-context";
import { useQueryBarContext } from "./query-bar-context";

function QueryBarIdentifier() {
  const { query } = useQueryBarContext();
  const { getQueryReferenceColor } = useQueryBuilderContext();
  const refColor = query.isReferencedInActiveQuery()
    ? getQueryReferenceColor(query.index())
    : null;

  return (
    <div
      className="w-1 rounded-s-sm bg-gray-500 group-data-[query-active=true]/query:bg-[--query-bar-identifier-active]"
      style={refColor ? { backgroundColor: refColor } : {}}
    />
  );
}

export default QueryBarIdentifier;
