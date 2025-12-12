import { VepImpact } from '@/api/api';
import { Indicator, IndicatorProps } from '@/components/base/shadcn/indicator';

interface ImpactIndicatorProps extends Omit<IndicatorProps, 'variant'> {
  value: VepImpact;
  className?: string;
}

function ImpactIndicator({ value, ...props }: ImpactIndicatorProps) {
  switch (value) {
    case VepImpact.HIGH:
      return <Indicator {...props} variant="red" symbol="triangle-up" />;
    case VepImpact.LOW:
      return <Indicator {...props} variant="emerald" symbol="triangle-down" />;
    case VepImpact.MODERATE:
      return <Indicator {...props} variant="amber" symbol="diamond" />;
    case VepImpact.MODIFIER:
      return <Indicator {...props} variant="grey" />;
    default:
      return;
  }
}

export default ImpactIndicator;
