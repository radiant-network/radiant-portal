import { cn } from "@/lib/utils";
import { SquareArrowOutUpRightIcon } from "lucide-react";
import * as React from "react";
type ExternalLinkCellProps = {
  className?: string;
  url: string;
  children?: React.ReactElement;
};
const ExternalLinkCell = React.forwardRef<
  HTMLAnchorElement,
  ExternalLinkCellProps
>(({ className, url, children }, ref) => {
  return (
    <a
      className={cn("text-blue-500 flex text-center ", className)}
      ref={ref}
      href={url}
      target="_blank"
    >
      <SquareArrowOutUpRightIcon />
      {children}
    </a>
  );
});
ExternalLinkCell.displayName = "ExternalLinkCell";

export default ExternalLinkCell;
