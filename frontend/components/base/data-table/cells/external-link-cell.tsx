import { cn } from "@/lib/utils";
import { SquareArrowOutUpRightIcon } from "lucide-react";

type ExternalLinkCellProps = {
  className?: string;
  url: string;
  children?: React.ReactElement;
};

function ExternalLinkCell({ className, url, children }: ExternalLinkCellProps) {
  return (
    <a
      className={cn("text-blue-500 flex text-center ", className)}
      href={url}
      target="_blank"
    >
      <SquareArrowOutUpRightIcon />
      {children}
    </a>
  );
}

export default ExternalLinkCell;
