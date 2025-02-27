/**
 * TableIndexResult
 * show current page and total page
 */
type TableIndexResultProp = {
  total: number;
  pageIndex: number;
  pageSize: number;
};

const TableIndexResult = ({
  total,
  pageIndex,
  pageSize,
}: TableIndexResultProp) => {
  const result = total;
  const to = pageSize * pageIndex;
  const from = to - pageSize + 1;
  return (
    <span>
      Results {from} - {to} of {result}
    </span>
  );
};

export default TableIndexResult;
