import { numberWithCommas } from "@/components/utils/number-format";

/**
 * TableIndexResult
 * show current page and total page
 */
type TableIndexResultProp = {
  total: number;
  pageIndex: number;
  pageSize: number;
};

function TableIndexResult({
  total,
  pageIndex,
  pageSize,
}: TableIndexResultProp) {
  const result = total;
  const to = pageSize * pageIndex;
  const from = to - pageSize + 1;
  return (
    <span>
      Results {numberWithCommas(from)} - {numberWithCommas(to)} of{" "}
      {numberWithCommas(result)}
    </span>
  );
}

export default TableIndexResult;
