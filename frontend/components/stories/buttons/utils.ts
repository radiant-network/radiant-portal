import { VariantProps } from 'tailwind-variants';

import { baseButtonVariants, buttonVariants as buttonVar } from '@/components/base/buttons';

export const buttonVariants: VariantProps<typeof baseButtonVariants>['variant'][] = [
  'default',
  'secondary',
  'destructive',
  'outline',
  'ghost',
  'link',
  'red',
  'orange',
  'yellow',
  'lime',
  'green',
  'cyan',
  'violet',
  'fuchsia',
  'neutral',
];

export const buttonSizes: VariantProps<typeof buttonVar>['size'][] = ['3xs', '2xs', 'xs', 'sm', 'default', 'lg'];
