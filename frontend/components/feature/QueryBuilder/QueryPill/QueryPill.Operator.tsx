import { FieldOperators } from "@/components/model/sqon";
import React from "react";

export type QueryPillOperatorProps = {
  type: string;
  className?: string;
};

const QueryPillOperator = ({ type, className }: QueryPillOperatorProps) => {
  switch (type) {
    case FieldOperators[">"]:
      return <GreaterThanOperator className={className} />;
    case FieldOperators[">="]:
      return <GreaterThanOrEqualOperator className={className} />;
    case FieldOperators["<"]:
      return <LessThanOperator className={className} />;
    case FieldOperators["<="]:
      return <LessThanOrEqualOperator className={className} />;
    case FieldOperators.between:
      return <ElementOperator className={className} />;
    case FieldOperators["not-in"]:
    case FieldOperators["some-not-in"]:
      return <NotInOperator className={className} />;
    default:
      return <EqualOperator className={className} />;
  }
};

export default QueryPillOperator;
