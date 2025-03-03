import { Button } from "@/base/ui/button";
import { CellContext } from "@tanstack/react-table";

function RowExpandCell({ row }: CellContext<any, any>) {
  return (
    <Button className="cursor-pointer" onClick={row.getToggleExpandedHandler()}>
      {row.getIsExpanded() ? "👇" : "👉"}
    </Button>
  );
}

export default RowExpandCell;
