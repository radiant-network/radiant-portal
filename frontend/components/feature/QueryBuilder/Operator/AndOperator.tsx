import { cn } from "@/components/lib/utils";
import React from "react";

const AndOperator = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span className={cn("", className)} {...props}>
      and
    </span>
  );
};

export default AndOperator;
