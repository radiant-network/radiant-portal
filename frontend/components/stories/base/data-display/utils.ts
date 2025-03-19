import { badgeVariants as BaseBadgeVariants } from '@/components/base/ui/badge';
import { VariantProps } from 'tailwind-variants';

export const badgeColors: VariantProps<typeof BaseBadgeVariants>['color'][] = [
  'primary',
  'destructive',
  'info',
  'success',
  'warning',
];

export const badgeVariants: VariantProps<typeof BaseBadgeVariants>['variant'][] = ['filled', 'outlined'];
