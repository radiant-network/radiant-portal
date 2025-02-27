import { cn } from "@/lib/utils";
import { SquareArrowOutUpRightIcon } from "lucide-react";

type ExternalLinkCellProps = {
  className?: string;
  url: string;
  children?: React.ReactElement;
};

const ExternalLinkCell = ({
  className,
  url,
  children,
}: ExternalLinkCellProps) => (
  <a
    className={cn("text-blue-500 flex text-center ", className)}
    href={url}
    target="_blank"
  >
    <SquareArrowOutUpRightIcon />
    {children}
  </a>
);

export default ExternalLinkCell;
