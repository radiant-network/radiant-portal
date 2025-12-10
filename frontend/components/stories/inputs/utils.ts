import { VariantProps } from 'tailwind-variants';

import { inputVariants } from '@/components/base/shadcn/input';
import { selectTriggerVariants } from '@/components/base/shadcn/select';

export const sizes: VariantProps<typeof inputVariants>['size'][] = ['xxs', 'xs', 'sm', 'default'];
export const selectSizes: VariantProps<typeof selectTriggerVariants>['size'][] = ['xxs', 'xs', 'sm', 'default'];
