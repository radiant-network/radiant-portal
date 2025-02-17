import { Button } from "@/base/button";
import { CellContext } from "@tanstack/react-table";

const getTableRowExpandCell = ({ row }: CellContext<any, any>) => {
  return (
    <Button className="cursor-pointer" onClick={row.getToggleExpandedHandler()}>
      {row.getIsExpanded() ? "👇" : "👉"}
    </Button>
  );
};

export { getTableRowExpandCell };
