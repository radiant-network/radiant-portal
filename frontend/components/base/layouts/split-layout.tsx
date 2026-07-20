import React from 'react';

import { cn } from '../../lib/utils';

import RadiantBackground from './radiant-background';

interface SplitLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  logo?: React.ReactNode;
  background?: React.ReactNode;
}

function SplitLayout({ children, logo, background, className, ...props }: SplitLayoutProps) {
  return (
    <div className={cn('flex min-h-screen w-full', className)} {...props}>
      {/* Content panel */}
      <div className="relative flex flex-1 flex-col bg-muted">
        {logo && <div className="flex justify-center p-6 md:justify-start md:p-8">{logo}</div>}
        <div className="flex flex-1 items-center justify-center p-6">{children}</div>
      </div>

      {/* Decorative panel — desktop only */}
      <div className="hidden flex-1 md:block" aria-hidden="true">
        {background ?? <RadiantBackground />}
      </div>
    </div>
  );
}

export default SplitLayout;
