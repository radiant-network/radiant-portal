import React, { ReactElement } from "react";

interface ConditionalWrapperProps {
  condition: boolean;
  wrapper: (children: React.ReactElement) => React.ReactElement;
  children: React.ReactElement;
}

export default ({
  children,
  condition,
  wrapper,
}: ConditionalWrapperProps): ReactElement =>
  condition ? wrapper(children) : children;
