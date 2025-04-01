import { baseButtonVariants, buttonVariants as buttonVar } from '@/components/base/Buttons';
import { VariantProps } from 'tailwind-variants';

export const buttonVariants: VariantProps<typeof baseButtonVariants>['variant'][] = [
  'default',
  'secondary',
  'destructive',
  'outline',
  'ghost',
  'link',
];

export const buttonSizes: VariantProps<typeof buttonVar>['size'][] = ['default', 'xs', 'sm', 'lg'];
