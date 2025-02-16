import { IconButton } from "@/components/base/Buttons";
import { cn } from "@/components/lib/utils";
import { XIcon } from "lucide-react";

export type QueryPillContainerProps = React.HTMLAttributes<HTMLDivElement> & {
  onRemovePill: () => void;
};

const QueryPillContainer = ({
  children,
  className,
  onRemovePill,
  ...props
}: QueryPillContainerProps) => (
  <div
    className={cn(
      "flex items-center rounded-sm p-[2px] bg-[--gray-4] group-data-[query-active=true]/query:bg-[--gold-5]",
      className
    )}
    {...props}
  >
    {children}
    <IconButton
      icon={XIcon}
      variant="link"
      className="pr-[2px] pl-[4px] py-[2px] size-auto"
      onClick={(e) => {
        e.stopPropagation();
        onRemovePill();
      }}
    />
  </div>
);

export default QueryPillContainer;
