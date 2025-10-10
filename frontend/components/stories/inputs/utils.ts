import { VariantProps } from 'tailwind-variants';

import { inputVariants } from '@/components/base/ui/input';
import { selectTriggerVariants } from '@/components/base/ui/select';

export const sizes: VariantProps<typeof inputVariants>['size'][] = ['xxs', 'xs', 'sm', 'default'];
export const selectSizes: VariantProps<typeof selectTriggerVariants>['size'][] = ['xxs', 'xs', 'sm', 'default'];
