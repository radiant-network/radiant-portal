import { cn } from "@/components/lib/utils";
import React from "react";

const OrOperator = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span className={cn("", className)} {...props}>
      or
    </span>
  );
};

export default OrOperator;
