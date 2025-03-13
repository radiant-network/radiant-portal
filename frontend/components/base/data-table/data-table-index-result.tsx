import { Skeleton } from "@/components/base/ui/skeleton";
import { numberWithCommas } from "@/components/lib/number-format";

/**
 * TableIndexResult
 * show current page and total page
 */
type TableIndexResultProp = {
  total: number;
  loading?: boolean;
  pageIndex: number;
  pageSize: number;
};

function TableIndexResult({
  loading,
  pageIndex,
  pageSize,
  total,
}: TableIndexResultProp) {
  if (loading) return <Skeleton className="h-[24px] w-[250px]" />;

  let to = pageSize * pageIndex;
  const from = to - pageSize + 1;

  if (to > total) {
    to = total;
  }

  return (
    <span>
      Results {numberWithCommas(from)} - {numberWithCommas(to)} of{" "}
      {numberWithCommas(total)}
    </span>
  );
}

export default TableIndexResult;
