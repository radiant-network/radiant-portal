import React from 'react';
import { tv, VariantProps } from 'tailwind-variants';

const listVariants = tv({
  base: 'overflow-scroll rounded-xs',
  variants: {
    bordered: {
      true: 'border',
    },
  },
  defaultVariants: {
    bordered: false,
  },
});

export type ListProps = React.HTMLAttributes<HTMLUListElement> & VariantProps<typeof listVariants>;

const List = ({ children, bordered, className, ...props }: ListProps) => (
  <ul className={listVariants({ bordered, className })} {...props}>
    {children}
  </ul>
);

export default List;
