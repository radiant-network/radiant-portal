import React from 'react';

import { cn } from '../../lib/utils';

// TODO SJRA-1707 remove this page and add an app/errors/404.tsx
interface NotFoundProps extends React.HTMLAttributes<HTMLDivElement> {
  status: '404' | '500';
  message?: string;
  extra?: React.ReactNode;
}

function PageError({ status, message, className, extra, ...props }: NotFoundProps) {
  return (
    <div className={cn('flex flex-col gap-3 items-center justify-center', className)} {...props}>
      <div className="space-y-2">
        <h1 className="text-6xl font-semibold">{status}</h1>
        {message && <p className="text-muted-foreground">{message}</p>}
      </div>
      {extra}
    </div>
  );
}

export default PageError;
