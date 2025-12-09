import React from 'react';

import { cn } from '@/components/lib/utils';

import { useQueryBuilderDictContext } from '../query-builder-context';

function AndOperator({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  const dict = useQueryBuilderDictContext();

  return (
    <span className={cn('', className)} {...props}>
      {dict.queryPill.operator.and}
    </span>
  );
}

export default AndOperator;
