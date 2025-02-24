import { cn } from "@/components/lib/utils";
import React from "react";

type QueryPillValuesContainerProps = React.HTMLAttributes<HTMLDivElement> & {
  canExpand?: boolean;
};

function QueryPillValuesContainer({
  canExpand,
  className,
  children,
  ...props
}: QueryPillValuesContainerProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center bg-white rounded-sm pl-2 text-xs font-medium leading-5 relative",
        canExpand ? "pr-[22px]" : "pr-2",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export default QueryPillValuesContainer;
