import React from 'react';

import { cn } from '@/components/lib/utils';

interface CenterLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  logo?: React.ReactNode;
  langSwitcher?: React.ReactNode;
  background?: React.ReactNode;
}

function CenterLayout({ children, logo, langSwitcher, background, className, ...props }: CenterLayoutProps) {
  return (
    <div className={cn('relative flex min-h-screen w-full flex-col bg-muted', className)} {...props}>
      {background && (
        <div className="absolute inset-0" aria-hidden="true">
          {background}
        </div>
      )}
      <div className="relative flex flex-1 flex-col">
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
    </div>
  );
}

export default CenterLayout;
