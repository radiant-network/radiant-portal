import { PropsWithChildren, useRef } from 'react';

export interface LazyProps {
  visible: boolean;
}

const Lazy = ({ visible, children }: PropsWithChildren<LazyProps>) => {
  const rendered = useRef(visible);

  if (visible && !rendered.current) {
    rendered.current = true;
  }

  if (!rendered.current) return null;

  return <>{children}</>;
};

export default Lazy;
