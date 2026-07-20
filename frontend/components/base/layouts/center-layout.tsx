import React from 'react';

import { cn } from '@/components/lib/utils';

interface CenterLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  logo?: React.ReactNode;
  background?: React.ReactNode;
}

function CenterLayout({ children, logo, background, className, ...props }: CenterLayoutProps) {
  return (
    <div className={cn('relative flex min-h-screen w-full flex-col bg-muted', className)} {...props}>
      {background && (
        <div className="absolute inset-0" aria-hidden="true">
          {background}
        </div>
      )}
      <div className="relative flex flex-1 flex-col">
        {logo && <div className="flex justify-center p-6 md:justify-start md:p-8">{logo}</div>}
        <div className="flex flex-1 items-center justify-center p-6">{children}</div>
      </div>
    </div>
  );
}

export default CenterLayout;
