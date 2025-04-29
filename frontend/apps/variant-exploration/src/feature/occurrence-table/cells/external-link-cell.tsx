import { Button } from "@/components/base/ui/button";
import { SquareArrowOutUpRightIcon } from "lucide-react";

type ExternalLinkCellProps = {
  className?: string;
  url: string;
  children?: React.ReactElement;
};

function ExternalLinkCell({ className, url, children }: ExternalLinkCellProps) {
  return (
    <Button variant="link" className={className}>
      <a href={url} target="_blank">
        <SquareArrowOutUpRightIcon />
        {children}
      </a>
    </Button>
  );
}

export default ExternalLinkCell;
