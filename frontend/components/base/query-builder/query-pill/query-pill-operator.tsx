import { SqonOpEnum } from '@/api/api';
import ElementOperatorIcon from '@/components/base/icons/element-operator-icon';
import EqualOperatorIcon from '@/components/base/icons/equal-operator-icon';
import GreaterThanOperatorIcon from '@/components/base/icons/greater-than-operator-icon';
import GreaterThanOrEqualOperatorIcon from '@/components/base/icons/greater-than-or-equal-operator-icon';
import LessThanOperatorIcon from '@/components/base/icons/less-than-operator-icon';
import LessThanOrEqualOperatorIcon from '@/components/base/icons/less-than-or-equal-operator-icon';
import NotInOperatorIcon from '@/components/base/icons/not-in-operator-icon';

export type QueryPillOperatorProps = {
  size?: number;
  type: SqonOpEnum | (string & {});
  className?: string;
};

function QueryPillOperator({ type, size, className }: QueryPillOperatorProps) {
  switch (type) {
    case SqonOpEnum.GreaterThan:
      return <GreaterThanOperatorIcon size={size} className={className} />;
    case SqonOpEnum.GreaterThanOrEqualTo:
      return <GreaterThanOrEqualOperatorIcon size={size} className={className} />;
    case SqonOpEnum.LessThan:
      return <LessThanOperatorIcon size={size} className={className} />;
    case SqonOpEnum.LessThanOrEqualTo:
      return <LessThanOrEqualOperatorIcon size={size} className={className} />;
    case SqonOpEnum.Between:
      return <ElementOperatorIcon size={size} className={className} />;
    case SqonOpEnum.NotIn:
      return <NotInOperatorIcon size={size} className={className} />;
    default:
      return <EqualOperatorIcon size={size} className={className} />;
  }
}

export default QueryPillOperator;
