import { VariantProps } from 'tailwind-variants';

import { baseButtonVariants, buttonVariants as buttonVar } from '@/components/base/buttons';

export const buttonVariants: VariantProps<typeof baseButtonVariants>['variant'][] = [
  'default',
  'secondary',
  'destructive',
  'outline',
  'ghost',
  'link',
];

export const buttonSizes: VariantProps<typeof buttonVar>['size'][] = ['default', 'xxs', 'xs', 'sm', 'lg'];
