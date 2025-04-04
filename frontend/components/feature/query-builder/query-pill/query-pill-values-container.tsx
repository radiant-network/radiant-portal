import { cn } from '@/components/lib/utils';
import React from 'react';

export type QueryPillValuesContainerProps = React.HTMLAttributes<HTMLDivElement> & {
  canExpand?: boolean;
  classNameContent?: string;
};

function QueryPillValuesContainer({
  canExpand,
  className,
  classNameContent,
  children,
  onClick,
  ...props
}: QueryPillValuesContainerProps) {
  return (
    <div
      className={cn(
        'bg-background rounded-sm pl-2 text-xs font-medium leading-5 relative',
        canExpand ? 'pr-[22px]' : 'pr-2',
        className,
      )}
      {...props}
    >
      <div
        onClick={onClick}
        className={cn(
          'flex flex-wrap items-center',
          onClick ? 'hover:shadow-[inset_0_-4px_0_-2.5px_black] hover:cursor-pointer' : '',
          classNameContent,
        )}
      >
        {children}
      </div>
    </div>
  );
}

export default QueryPillValuesContainer;
