import ElementOperatorIcon from "@/components/base/Icons/ElementOperatorIcon";
import EqualOperatorIcon from "@/components/base/Icons/EqualOperatorIcon";
import GreaterThanOperatorIcon from "@/components/base/Icons/GreaterThanOperatorIcon";
import GreaterThanOrEqualOperatorIcon from "@/components/base/Icons/GreaterThanOrEqualOperatorIcon";
import LessThanOperatorIcon from "@/components/base/Icons/LessThanOperatorIcon";
import LessThanOrEqualEqualOperatorIcon from "@/components/base/Icons/LessThanOrEqualEqualOperatorIcon";
import NotInOperatorIcon from "@/components/base/Icons/NotInOperatorIcon";
import { FieldOperators } from "@/components/model/sqon";

export type QueryPillOperatorProps = {
  size?: number;
  type: FieldOperators | (string & {});
  className?: string;
};

const QueryPillOperator = ({
  type,
  size,
  className,
}: QueryPillOperatorProps) => {
  switch (type) {
    case FieldOperators[">"]:
      return <GreaterThanOperatorIcon size={size} className={className} />;
    case FieldOperators[">="]:
      return (
        <GreaterThanOrEqualOperatorIcon size={size} className={className} />
      );
    case FieldOperators["<"]:
      return <LessThanOperatorIcon size={size} className={className} />;
    case FieldOperators["<="]:
      return (
        <LessThanOrEqualEqualOperatorIcon size={size} className={className} />
      );
    case FieldOperators.between:
      return <ElementOperatorIcon size={size} className={className} />;
    case FieldOperators["not-in"]:
    case FieldOperators["some-not-in"]:
      return <NotInOperatorIcon size={size} className={className} />;
    default:
      return <EqualOperatorIcon size={size} className={className} />;
  }
};

export default QueryPillOperator;
