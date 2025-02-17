import React, { ReactNode } from "react";
import { useQueryBuilderContext } from "../QueryBuilder.Context";
import {
  isBooleanFilter,
  isRangeFilter,
} from "@/components/model/query-builder-core";
import { IValueFilter } from "@/components/model/sqon";
import { cn } from "@/components/lib/utils";

type QueryPillLabelProps = React.HTMLAttributes<HTMLSpanElement> & {
  valueFilter: IValueFilter;
  operator: ReactNode;
};

const QueryPillLabelOperator = ({
  valueFilter,
  operator,
  className,
  ...props
}: QueryPillLabelProps) => {
  const { showLabels } = useQueryBuilderContext();

  return (
    <div className={cn("flex items-center", className)} {...props}>
      {(showLabels ||
        isBooleanFilter(valueFilter) ||
        isRangeFilter(valueFilter)) && (
        <>
          <QueryPillLabelContainer>
            {valueFilter.content.field}
          </QueryPillLabelContainer>
          <QueryPillOperatorContainer>{operator}</QueryPillOperatorContainer>
        </>
      )}
    </div>
  );
};

export const QueryPillOperatorContainer = ({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => (
  <span className={cn("ml-[2px] mr-[4px]", className)} {...props}>
    {children}
  </span>
);

export const QueryPillLabelContainer = ({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => (
  <span
    className={cn("ml-[4px] mr-[2px] text-xs font-medium", className)}
    {...props}
  >
    {children}
  </span>
);

export default QueryPillLabelOperator;
