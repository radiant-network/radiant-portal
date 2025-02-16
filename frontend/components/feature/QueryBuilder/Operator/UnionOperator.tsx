import React, { ReactElement } from "react";

const UnionOperator = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>): ReactElement => (
  <span className={className} {...props}>
    ,
  </span>
);
export default UnionOperator;
