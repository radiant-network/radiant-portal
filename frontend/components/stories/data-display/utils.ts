import { badgeVariants as BaseBadgeVariants } from '@/components/base/ui/badge';
import { numberBadgeVariants as BaseNumberBadgeVariants } from '@/components/base/number-badge';
import { VariantProps } from 'tailwind-variants';

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
  'slate',
];

export const numberBadgeVariants: VariantProps<typeof BaseNumberBadgeVariants>['variant'][] = [
  'default',
  'ghost',
  'destructive',
];
