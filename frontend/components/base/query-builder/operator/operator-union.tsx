import React, { ReactElement } from 'react';

function UnionOperator({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>): ReactElement {
  return (
    <span className={className} {...props}>
      ,
    </span>
  );
}

export default UnionOperator;
