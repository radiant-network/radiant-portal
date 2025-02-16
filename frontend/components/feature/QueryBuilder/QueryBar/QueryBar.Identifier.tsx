import { useQueryBuilderContext } from "../QueryBuilder.Context";
import { useQueryBarContext } from "./QueryBar.Context";

const QueryBarIdentifier = () => {
  const { query } = useQueryBarContext();
  const { getQueryReferenceColor } = useQueryBuilderContext();
  const refColor = query.isReferencedInActiveQuery()
    ? getQueryReferenceColor(query.index())
    : null;

  return (
    <div
      className="w-1 rounded-s-sm bg-[--gray-5] group-data-[query-active=true]/query:bg-[--gold-6]"
      style={refColor ? { backgroundColor: refColor } : {}}
    />
  );
};

export default QueryBarIdentifier;
