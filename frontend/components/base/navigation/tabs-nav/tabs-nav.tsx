import React, { useId } from 'react';

import Lazy from '@/components/base/lazy';
import { cn } from '@/components/lib/utils';

import { TabsNavContext, useTabsNavContext } from './tabs-nav-context';

export type TabsNavProps<T> = React.HTMLAttributes<HTMLDivElement> & {
  ref?: React.Ref<HTMLDivElement>;
  value?: T;
  onValueChange?: (value: T) => void;
};

function getTabId(baseId: string, value: unknown) {
  return `${baseId}-tab-${String(value)}`;
}

function getPanelId(baseId: string, value: unknown) {
  return `${baseId}-panel-${String(value)}`;
}

export default function TabsNav<T>({ ref, value, onValueChange, ...props }: TabsNavProps<T>) {
  const baseId = useId();

  return (
    <TabsNavContext.Provider
      value={{
        value,
        onValueChange,
        baseId,
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

/**
 * Arrow keys move between tabs and activate them, Home / End jump to the first / last one.
 */
function handleTabsKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
  const tabs = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="tab"]:not([disabled])'));
  const index = tabs.indexOf(document.activeElement as HTMLButtonElement);
  if (index === -1) return;

  let next: number;
  switch (event.key) {
    case 'ArrowRight':
      next = (index + 1) % tabs.length;
      break;
    case 'ArrowLeft':
      next = (index - 1 + tabs.length) % tabs.length;
      break;
    case 'Home':
      next = 0;
      break;
    case 'End':
      next = tabs.length - 1;
      break;
    default:
      return;
  }

  event.preventDefault();
  tabs[next].focus();
  tabs[next].click();
}

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
      {/* eslint-disable-next-line jsx-a11y/interactive-supports-focus -- the focusable tabs handle focus, their key events bubble here */}
      <div role="tablist" className={cn('flex overflow-x-auto', contentClassName)} onKeyDown={handleTabsKeyDown}>
        {children}
      </div>
    </div>
  );
}

export type TabsListItemProps<T> = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  value: T;
  disabled?: boolean;
  ref?: React.Ref<HTMLButtonElement>;
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
    <button
      type="button"
      ref={ref}
      role="tab"
      id={getTabId(tabsContext.baseId, value)}
      aria-selected={active}
      tabIndex={active ? 0 : -1}
      disabled={disabled}
      data-active={active}
      data-disabled={disabled}
      className={cn(
        'z-1 group flex flex-col pt-1.5 pb-1 hover:cursor-pointer',
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
      <span className="flex items-center has-[svg]:px-4 px-3 py-2 [&_svg]:size-4 gap-2 text-sm text-muted-foreground rounded-sm hover:bg-accent group-data-[active=true]:text-accent-foreground hover:text-accent-foreground transition-all duration-300 group-data-[disabled=true]:pointer-events-none whitespace-nowrap">
        {children}
      </span>
    </button>
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
        role="tabpanel"
        id={getPanelId(tabsContext.baseId, value)}
        aria-labelledby={getTabId(tabsContext.baseId, value)}
        className={cn(
          {
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
