import React, { ReactElement } from 'react';

function IntersectionOperator({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>): ReactElement {
  return (
    <span className={className} {...props}>
      &
    </span>
  );
}

export default IntersectionOperator;
