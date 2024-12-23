import * as React from "react";
import { Button } from "@/base/ui/button";
import { PlusOutlinedIcon } from "@/base/ui/icons";
import { cn } from "@/lib/utils";

type GeneCellProps = {
  className?: string;
  name: string;
  url: string;
  onClick: () => void;
};

const GeneCell = React.forwardRef<HTMLDivElement, GeneCellProps>(
  ({ className, url, name, onClick }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex items-center text-blue-500", className)}
      >
        <a href={url} target="_blank">
          {name}
        </a>
        <Button onClick={onClick}>
          <PlusOutlinedIcon />
        </Button>
      </div>
    );
  }
);
GeneCell.displayName = "GeneCell";

export default GeneCell;
