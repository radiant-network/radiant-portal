import { badgeVariants as BaseBadgeVariants } from '@/components/base/ui/badge';
import { numberBadgeVariants as BaseNumberBadgeVariants } from '@/components/base/number-badge';
import { VariantProps } from 'tailwind-variants';
import { IndicatorVariants } from '@/components/base/ui/indicator';

export const badgeVariants: VariantProps<typeof BaseBadgeVariants>['variant'][] = [
  'default',
  'secondary',
  'destructive',
  'outline',
  'red',
  'orange',
  'yellow',
  'lime',
  'green',
  'cyan',
  'blue',
  'violet',
  'fuchsia',
  'neutral',
];

export const indicatorVariants: VariantProps<typeof IndicatorVariants>['variant'][] = [
  'red',
  'amber',
  'emerald',
  'blue',
  'fuchsia',
  'grey',
];

export const numberBadgeVariants: VariantProps<typeof BaseNumberBadgeVariants>['variant'][] = [
  'default',
  'ghost',
  'destructive',
];
