import ElementOperatorIcon from "@/components/base/icons/element-operator-icon";
import EqualOperatorIcon from "@/components/base/icons/equal-operator-icon";
import GreaterThanOperatorIcon from "@/components/base/icons/greater-than-operator-icon";
import GreaterThanOrEqualOperatorIcon from "@/components/base/icons/greater-than-or-equal-operator-icon";
import LessThanOperatorIcon from "@/components/base/icons/less-than-operator-icon";
import LessThanOrEqualOperatorIcon from "@/components/base/icons/less-than-or-equal-operator-icon";
import NotInOperatorIcon from "@/components/base/icons/not-in-operator-icon";
import { FieldOperators } from "@/components/model/sqon";

export type QueryPillOperatorProps = {
  size?: number;
  type: FieldOperators | (string & {});
  className?: string;
};

function QueryPillOperator({ type, size, className }: QueryPillOperatorProps) {
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
      return <LessThanOrEqualOperatorIcon size={size} className={className} />;
    case FieldOperators.between:
      return <ElementOperatorIcon size={size} className={className} />;
    case FieldOperators["not-in"]:
    case FieldOperators["some-not-in"]:
      return <NotInOperatorIcon size={size} className={className} />;
    default:
      return <EqualOperatorIcon size={size} className={className} />;
  }
}

export default QueryPillOperator;
