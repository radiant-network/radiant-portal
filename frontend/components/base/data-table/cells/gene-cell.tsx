import { PlusIcon } from "lucide-react";
import { Button } from "@/components/base/ui/button";
import EmptyCell from "@/components/base/data-table/cells/empty-cell";
import { cn } from "@/components/lib/utils";

type GeneCellProps = {
  className?: string;
  symbol?: string;
};

type GetOmimOrgUrlProps = {
  omimGeneId?: string;
  symbol: string;
};

function getOmimOrgUrl({ omimGeneId, symbol }: GetOmimOrgUrlProps): string {
  if (omimGeneId) {
    return `https://www.omim.org/entry/${omimGeneId}`;
  }

  return `https://www.omim.org/search?index=entry&start=1&limit=10&sort=score+desc%2C+prefix_sort+desc&search=${symbol}`;
}

function GeneCell({ className, symbol }: GeneCellProps) {
  if (!symbol) return <EmptyCell />;

  return (
    <div className={className}>
      <Button variant="link">
        <a href={getOmimOrgUrl({ symbol })} target="_blank">
          {symbol}
        </a>
      </Button>
      <Button
        size="sm"
        onClick={() => {
          console.log("addQuery to be added"); //TODO: to remove
        }}
      >
        <PlusIcon />
      </Button>
    </div>
  );
}

export default GeneCell;
