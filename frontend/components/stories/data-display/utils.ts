import { badgeVariants as BaseBadgeVariants } from '@/components/base/ui/badge';
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
