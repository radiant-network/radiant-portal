import { ComponentProps } from 'react';
import { cn } from '../lib/utils';

function Container({ className, children, ...props }: ComponentProps<'div'>) {
  return (
    <div className={cn('mx-auto', className)} {...props}>
      {children}
    </div>
  );
}

export default Container;
