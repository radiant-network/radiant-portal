import { ComponentProps } from 'react';
import { cn } from '../lib/utils';

function Container({ className, children, ...props }: ComponentProps<'div'>) {
  return (
    <div className={cn('max-w-8xl mx-auto', className)} {...props}>
      {children}
    </div>
  );
}

export default Container;
