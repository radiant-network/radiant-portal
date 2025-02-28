import { useEffect, useState } from "react";
import { useQueryBuilderContext } from "../query-builder-context";
import { useQueryBarContext } from "./query-bar-context";
import { Spinner } from "@/components/base/spinner";

function QueryBarCount() {
  const {
    queryBuilder,
    queryCountIcon: QueryCountIcon,
    fetchQueryCount,
  } = useQueryBuilderContext();
  const { query } = useQueryBarContext();

  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchQueryCount(query.raw())
      .then((count) => setTotal(count))
      .finally(() => setLoading(false));
  }, [fetchQueryCount, query.raw(), queryBuilder.getRawQueries()]);

  return (
    <div className="flex items-center gap-1">
      {loading ? (
        <Spinner />
      ) : (
        <>
          {QueryCountIcon && <QueryCountIcon size={14} />}
          <span className="font-medium">{total}</span>
        </>
      )}
    </div>
  );
}

export default QueryBarCount;
