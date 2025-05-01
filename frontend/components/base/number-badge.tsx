import React from 'react';
import { cn } from '../lib/utils';

interface NumberBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  count: number;
}

function NumberBadge({ count, className, children, ...props }: NumberBadgeProps) {
  return (
    <div className={cn('relative', className)} {...props}>
      <div
        className={cn('absolute top-[-6px] rounded px-[3px] bg-background text-muted-foreground text-xs', {
          'right-[-12px]': count > 9,
          'right-[-8px]': count <= 9,
          'right-[-18px]': count > 99,
        })}
      >
        {count > 99 ? '99+' : count}
      </div>
      {children}
    </div>
  );
}

export default NumberBadge;
