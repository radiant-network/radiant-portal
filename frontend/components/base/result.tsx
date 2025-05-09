import React from 'react';
import { cn } from '../lib/utils';

interface NotFoundProps extends React.HTMLAttributes<HTMLDivElement> {
  status: '404' | '500';
  message?: string;
  extra?: React.ReactNode;
}

function Result({ status, message, className, extra, ...props }: NotFoundProps) {
  return (
    <div className={cn('flex flex-col gap-6 items-center justify-center', className)} {...props}>
      <div className="space-y-2">
        <h1 className="text-6xl font-semibold">{status}</h1>
        {message && <p className="text-muted-foreground">{message}</p>}
      </div>
      {extra}
    </div>
  );
}

export default Result;
