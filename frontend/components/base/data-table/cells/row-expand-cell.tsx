import { Button } from "@/base/ui/button";
import { CellContext } from "@tanstack/react-table";
import { MinusIcon, PlusIcon } from "lucide-react";

function RowExpandCell({ row }: CellContext<any, any>) {
  return (
    <Button className="cursor-pointer" onClick={row.getToggleExpandedHandler()}>
      {row.getIsExpanded() ? <MinusIcon /> : <PlusIcon />}
    </Button>
  );
}

export default RowExpandCell;
