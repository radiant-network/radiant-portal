import { cn } from '@/components/lib/utils';
import React from 'react';
import { TabsNavContext, useTabsNavContext } from './tabs-nav-context';
import Lazy from '@/components/base/lazy';

export type TabsNavProps<T> = React.HTMLAttributes<HTMLDivElement> & {
  ref?: React.Ref<HTMLDivElement>;
  value?: T;
  onValueChange?: (value: T) => void;
};

export default function TabsNav<T>({ ref, value, onValueChange, ...props }: TabsNavProps<T>) {
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
  contentClassName?: string;
};

export function TabsList({ ref, className, contentClassName, children, ...props }: TabsListProps) {
  return (
    <div
      ref={ref}
      className={cn(
        'relative before:border-b before:border-border before:absolute before:left-0 before:right-0 before:bottom-0',
        className,
      )}
      {...props}
    >
      <div className={cn('flex overflow-x-auto', contentClassName)}>{children}</div>
    </div>
  );
}

export type TabsListItemProps<T> = React.HTMLAttributes<HTMLDivElement> & {
  value: T;
  disabled?: boolean;
  ref?: React.Ref<HTMLDivElement>;
  children: React.ReactNode;
};

export function TabsListItem<T extends string | number | symbol = string>({
  ref,
  value,
  disabled = false,
  className,
  children,
  ...props
}: React.PropsWithChildren<TabsListItemProps<T>>) {
  const tabsContext = useTabsNavContext();
  const active = tabsContext.value === value;

  return (
    <div
      ref={ref}
      data-active={active}
      data-disabled={disabled}
      className={cn(
        'z-1 group pt-1.5 pb-1 hover:cursor-pointer',
        {
          'border-b-2 border-primary font-semibold': active,
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
      <div className="flex items-center has-[svg]:px-4 px-3 py-2 [&_svg]:size-4 gap-2 text-sm text-muted-foreground rounded-sm hover:bg-accent group-data-[active=true]:text-accent-foreground hover:text-accent-foreground transition-all duration-300 group-data-[disabled=true]:pointer-events-none whitespace-nowrap">
        {children}
      </div>
    </div>
  );
}

export type TabsContentProps<T> = React.HTMLAttributes<HTMLDivElement> & {
  value: T;
  noMargin?: boolean;
  ref?: React.Ref<HTMLDivElement>;
};

export function TabsContent<T>({ ref, value, children, className, noMargin = false, ...props }: TabsContentProps<T>) {
  const tabsContext = useTabsNavContext();
  const active = tabsContext.value === value;

  return (
    <Lazy visible={active}>
      <div
        ref={ref}
        className={cn(
          {
            'py-3': !noMargin,
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
