import { cn } from '@/components/lib/utils';
import React from 'react';
import { TabsNavContext, useTabsNavContext } from './tabs-nav-context';
import Lazy from '@/components/base/lazy';

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
      <div ref={ref} {...props} />
    </TabsNavContext.Provider>
  );
}

export type TabsListProps = React.HTMLAttributes<HTMLDivElement> & {
  ref?: React.Ref<HTMLDivElement>;
};

export function TabsList({ ref, className, ...props }: TabsListProps) {
  return <div ref={ref} className={cn('flex border-b overflow-x-auto', className)} {...props} />;
}

export type TabsListItemProps<T> = React.HTMLAttributes<HTMLDivElement> & {
  value: T;
  disabled?: boolean;
  ref?: React.Ref<HTMLDivElement>;
};

export function TabsListItem<T>({ ref, value, disabled = false, className, children, ...props }: TabsListItemProps<T>) {
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
      <div className="px-3 py-2 text-sm text-muted-foreground rounded hover:bg-accent group-data-[active=true]:text-accent-foreground hover:text-accent-foreground transition-all duration-300 group-data-[disabled=true]:pointer-events-none">
        {children}
      </div>
    </div>
  );
}

export type TabsContentProps<T> = React.HTMLAttributes<HTMLDivElement> & {
  value: T;
  ref?: React.Ref<HTMLDivElement>;
};

export function TabsContent<T>({ ref, value, children, className, ...props }: TabsContentProps<T>) {
  const tabsContext = useTabsNavContext();
  const active = tabsContext.value === value;

  return (
    <Lazy visible={active}>
      <div
        ref={ref}
        className={cn(
          'py-3',
          {
            flex: active,
            hidden: !active,
          },
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </Lazy>
  );
}
