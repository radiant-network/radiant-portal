import { badgeVariants as BaseBadgeVariants } from '@/components/base/ui/badge';
import { VariantProps } from 'tailwind-variants';

export const badgeVariants: VariantProps<typeof BaseBadgeVariants>['variant'][] = [
  'default',
  'secondary',
  'destructive',
  'outline',
];

export const badgeSizes: VariantProps<typeof BaseBadgeVariants>['size'][] = ['default', 'sm', 'md'];
