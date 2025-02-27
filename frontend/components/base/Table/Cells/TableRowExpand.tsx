import { Button } from "@/base/ui/button";
import { CellContext } from "@tanstack/react-table";

const TableRowExpandCell = ({ row }: CellContext<any, any>) => (
  <Button className="cursor-pointer" onClick={row.getToggleExpandedHandler()}>
    {row.getIsExpanded() ? "👇" : "👉"}
  </Button>
);

export default TableRowExpandCell;
