import { VariantProps } from 'tailwind-variants';

import { anchorLinkVariants as anchorLinkVar } from '@/components/base/navigation/anchor-link';

export const anchorLinkVariants: VariantProps<typeof anchorLinkVar>['variant'][] = ['primary', 'secondary', 'white'];

export const anchorLinkSizes: VariantProps<typeof anchorLinkVar>['size'][] = ['default', 'xs', 'sm', 'lg'];
