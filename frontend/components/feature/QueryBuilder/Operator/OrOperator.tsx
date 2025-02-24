import { cn } from "@/components/lib/utils";
import React from "react";
import { useQueryBuilderDictContext } from "../QueryBuilder.Context";

function OrOperator({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  const dict = useQueryBuilderDictContext();

  return (
    <span className={cn("", className)} {...props}>
      {dict.queryPill.operator.or}
    </span>
  );
}

export default OrOperator;
