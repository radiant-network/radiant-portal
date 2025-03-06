import EmptyCell from "@/components/base/data-table/cells/empty-cell";
import { Badge } from "@/components/base/ui/badge";

type OmimCellProps = {
  codes?: string[];
};

function OmimCell({ codes = [] }: OmimCellProps) {
  if (codes.length === 0) return <EmptyCell />;

  return (
    <>
      {codes.map((code) => {
        return (
          <Badge key={code} className="me-2">
            {code}
          </Badge>
        );
      })}
    </>
  );
}

export default OmimCell;
