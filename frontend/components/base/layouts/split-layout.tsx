import React from 'react';

import { cn } from '../../lib/utils';

import './split-layout.css';

interface SplitLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  logo?: React.ReactNode;
  background?: React.ReactNode;
}

function DefaultBackground() {
  return (
    <div className="split-layout-decoration size-full">
      <div className="split-layout-circle split-layout-circle--3" />
      <div className="split-layout-circle split-layout-circle--2" />
      <div className="split-layout-circle split-layout-circle--1" />
    </div>
  );
}

function SplitLayout({ children, logo, background, className, ...props }: SplitLayoutProps) {
  return (
    <div className={cn('flex min-h-screen w-full', className)} {...props}>
      {/* Content panel */}
      <div className="relative flex flex-1 flex-col bg-background">
        {logo && <div className="flex justify-center p-6 md:justify-start md:p-8">{logo}</div>}
        <div className="flex flex-1 items-center justify-center p-6">{children}</div>
      </div>

      {/* Decorative panel — desktop only */}
      <div className="hidden flex-1 md:block" aria-hidden="true">
        {background ?? <DefaultBackground />}
      </div>
    </div>
  );
}

export default SplitLayout;
