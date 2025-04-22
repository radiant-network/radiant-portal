import { cn } from '@/components/lib/utils';
import React, { act } from 'react';
import { TabsNavContext, useTabsNavContext } from './tabs-nav-context';

export type TabsNavProps<T> = React.HTMLAttributes<HTMLDivElement> & {
  ref?: React.Ref<HTMLDivElement>;
  value?: T;
  onValueChange?: (value: T) => void;
};

export default function TabsNav<T>({ ref, value, onValueChange, className, ...props }: TabsNavProps<T>) {
  return (
    <TabsNavContext.Provider
      value={{
        value,
        onValueChange,
      }}
    >
      <div ref={ref} className={cn('flex border-b px-3', className)} {...props} />
    </TabsNavContext.Provider>
  );
}

export type TabsNavItemProps = React.HTMLAttributes<HTMLDivElement> & {
  value: string;
  disabled?: boolean;
  ref?: React.Ref<HTMLDivElement>;
};

export function TabsNavItem({ ref, value, disabled = false, className, children, ...props }: TabsNavItemProps) {
  const tabsContext = useTabsNavContext();
  const active = tabsContext.value === value;

  return (
    <div
      ref={ref}
      data-active={active}
      data-disabled={disabled}
      className={cn(
        'group pt-1.5 pb-1 mb-[-1px] hover:cursor-pointer',
        {
          'border-b-2 border-primary': active,
          'opacity-50 hover:cursor-not-allowed': disabled,
        },
        className,
      )}
      {...props}
      onClick={e => {
        if (disabled) {
          return;
        }

        tabsContext.onValueChange?.(value);
        props.onClick?.(e);
      }}
    >
      <div className="px-3 py-2 text-muted-foreground rounded hover:bg-accent group-data-[active=true]:text-accent-foreground hover:text-accent-foreground transition-all duration-300 group-data-[disabled=true]:pointer-events-none">
        {children}
      </div>
    </div>
  );
}
