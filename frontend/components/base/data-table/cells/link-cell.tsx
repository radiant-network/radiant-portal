import { Button } from "@/components/base/ui/button";
import { cn } from "@/components/lib/utils";

type ExternalLinkCellProps = {
  className?: string;
  url: string;
  children?: any;
};

function LinkCell({ className, url, children }: ExternalLinkCellProps) {
  return (
    <Button
      variant="link"
      className={cn("max-w-[300px] overflow-hidden", className)}
    >
      <a href={url} className="overflow-hidden text-ellipsis">
        {children}
      </a>
    </Button>
  );
}

export default LinkCell;
