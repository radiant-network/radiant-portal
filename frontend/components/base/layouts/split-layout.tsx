import React from 'react';

import { cn } from '@/components/lib/utils';

import RadiantBackground from './radiant-background';

interface SplitLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  logo?: React.ReactNode;
  langSwitcher?: React.ReactNode;
  background?: React.ReactNode;
}

function SplitLayout({ children, logo, langSwitcher, background, className, ...props }: SplitLayoutProps) {
  return (
    <div className={cn('flex min-h-screen w-full', className)} {...props}>
      {/* Content panel */}
      <div className="relative flex flex-1 flex-col bg-muted">
        {(logo || langSwitcher) && (
          <div className="grid grid-cols-[1fr_auto_1fr] items-center p-6 md:flex md:justify-between md:p-8">
            {/* Left spacer — balances the switcher to center the logo on mobile */}
            <div className="md:hidden" aria-hidden="true" />
            <div>{logo}</div>
            <div className="justify-self-end">{langSwitcher}</div>
          </div>
        )}
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
