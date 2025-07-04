import { anchorLinkVariants as anchorLinkVar } from '@/components/base/navigation/anchor-link';
import { VariantProps } from 'tailwind-variants';

export const anchorLinkVariants: VariantProps<typeof anchorLinkVar>['variant'][] = ['primary', 'secondary'];

export const anchorLinkSizes: VariantProps<typeof anchorLinkVar>['size'][] = ['default', 'xs', 'sm', 'lg'];
