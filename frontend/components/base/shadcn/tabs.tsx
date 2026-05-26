'use client';

import * as React from 'react';
import { createContext, useContext } from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { tv, VariantProps } from 'tailwind-variants';

const tabsVariants = tv({
  slots: {
    base: 'flex flex-col gap-2 data-[orientation=vertical]:flex-row',
    list: 'inline-flex h-9 w-fit items-center justify-center rounded-lg p-[3px] data-[orientation=vertical]:h-auto data-[orientation=vertical]:flex-col data-[orientation=vertical]:items-stretch',
    trigger:
      'inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-3 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-xs [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*="size-"])]:size-4 data-[orientation=vertical]:w-full data-[orientation=vertical]:justify-start',
    content: 'flex-1 outline-none',
  },
  variants: {
    variant: {
      default: {
        list: 'bg-muted text-muted-foreground',
        trigger:
          'data-[state=active]:bg-background data-[state=active]:text-foreground dark:data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input text-muted-foreground hover:text-foreground',
      },
      primary: {
        list: 'bg-muted text-muted-foreground',
        trigger:
          'data-[state=active]:bg-primary data-[state=active]:text-primary-foreground dark:data-[state=active]:text-primary-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input text-muted-foreground hover:text-foreground',
      },
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const TabsContext = createContext<VariantProps<typeof tabsVariants> | undefined>(undefined);

export const useTabsContext = () => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('useTabsContext must be used within a TabsContext.Provider');
  }
  return context;
};

function Tabs({
  className,
  variant,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root> & VariantProps<typeof tabsVariants>) {
  const style = tabsVariants({ variant });
  return (
    <TabsContext.Provider value={{ variant }}>
      {<TabsPrimitive.Root data-slot="tabs" className={style.base({ className })} {...props} />}
    </TabsContext.Provider>
  );
}

function TabsList({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.List>) {
  const { variant } = useTabsContext();
  const style = tabsVariants({ variant });

  return <TabsPrimitive.List data-slot="tabs-list" className={style.list({ className })} {...props} />;
}

function TabsTrigger({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  const { variant } = useTabsContext();
  const style = tabsVariants({ variant });

  return <TabsPrimitive.Trigger data-slot="tabs-trigger" className={style.trigger({ className })} {...props} />;
}

function TabsContent({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Content>) {
  const { variant } = useTabsContext();
  const style = tabsVariants({ variant });

  return <TabsPrimitive.Content data-slot="tabs-content" className={style.content({ className })} {...props} />;
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
