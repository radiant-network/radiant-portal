import React, { ReactElement } from "react";

const IntersectionOperator = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>): ReactElement => (
  <span className={className} {...props}>
    &
  </span>
);
export default IntersectionOperator;
