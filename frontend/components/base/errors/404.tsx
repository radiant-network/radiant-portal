import type { HTMLAttributes, ReactNode } from 'react';

import CenterLayout from '@/components/base/layouts/center-layout';

interface Error404Props extends HTMLAttributes<HTMLDivElement> {
  message?: string;
  extra?: ReactNode;
}

function Error404({ message, extra, className, ...props }: Error404Props) {
  return (
    <CenterLayout className={className} {...props}>
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="space-y-2">
          <h1 className="text-6xl font-semibold">404</h1>
          {message && <p className="text-muted-foreground">{message}</p>}
        </div>
        {extra}
      </div>
    </CenterLayout>
  );
}

export default Error404;
