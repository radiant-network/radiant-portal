import * as React from 'react';
import * as NavigationMenuPrimitive from '@radix-ui/react-navigation-menu';
import { cva } from 'class-variance-authority';
import { ChevronDown } from 'lucide-react';

import { cn } from '@/lib/utils';

type NavigationMenuProps = React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Root> & {
  direction?: 'up' | 'down';
};

// This is a wrapper that allows access to the direction prop for child components
const NavigationMenuContext = React.createContext<{ direction: 'up' | 'down' }>({ direction: 'down' });

export const useNavigationMenuContext = () => React.useContext(NavigationMenuContext);

const NavigationMenu = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Root>,
  NavigationMenuProps
>(({ className, children, direction = 'down', ...props }, ref) => (
  <NavigationMenuContext.Provider value={{ direction }}>
    <NavigationMenuPrimitive.Root
      ref={ref}
      className={cn('relative z-10 flex max-w-max flex-1 items-center justify-center', className)}
      {...props}
    >
      {children}
      <NavigationMenuViewport direction={direction} />
    </NavigationMenuPrimitive.Root>
  </NavigationMenuContext.Provider>
));
NavigationMenu.displayName = NavigationMenuPrimitive.Root.displayName;

const NavigationMenuList = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.List>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.List
    ref={ref}
    className={cn('group flex flex-1 list-none items-center justify-center space-x-1', className)}
    {...props}
  />
));
NavigationMenuList.displayName = NavigationMenuPrimitive.List.displayName;

const NavigationMenuItem = NavigationMenuPrimitive.Item;

const navigationMenuTriggerStyle = cva(
  'group inline-flex h-9 w-fit items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[state=open]:text-accent-foreground data-[state=open]:bg-accent/50 data-[state=open]:hover:bg-accent data-[state=open]:focus:bg-accent',
);

const NavigationMenuTrigger = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <NavigationMenuPrimitive.Trigger
    ref={ref}
    className={cn(navigationMenuTriggerStyle(), 'group', className)}
    {...props}
  >
    {children}{' '}
    <ChevronDown
      className="relative top-[1px] ml-1 h-3 w-3 transition duration-200 group-data-[state=open]:rotate-180"
      aria-hidden="true"
    />
  </NavigationMenuPrimitive.Trigger>
));
NavigationMenuTrigger.displayName = NavigationMenuPrimitive.Trigger.displayName;

const NavigationMenuContent = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Content>
>(({ className, ...props }, ref) => {
  const { direction } = useNavigationMenuContext();
  
  return (
    <NavigationMenuPrimitive.Content
      ref={ref}
      className={cn(
        'left-0 w-full data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 md:absolute md:w-auto',
        direction === 'up' ? 'bottom-0' : 'top-0',
        className,
      )}
      {...props}
    />
  );
});
NavigationMenuContent.displayName = NavigationMenuPrimitive.Content.displayName;

const NavigationMenuLink = NavigationMenuPrimitive.Link;

type NavigationMenuViewportProps = React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Viewport> & {
  direction?: 'up' | 'down';
};

const NavigationMenuViewport = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Viewport>,
  NavigationMenuViewportProps
>(({ className, direction: propDirection, ...props }, ref) => {
  const { direction: contextDirection } = useNavigationMenuContext();
  const direction = propDirection || contextDirection;
  
  return (
    <div className={cn('absolute left-0', direction === 'up' ? 'bottom-full' : 'top-full', 'flex justify-center')}>
      <NavigationMenuPrimitive.Viewport
        className={cn(
          direction === 'up' ? 'origin-bottom-center relative mb-1.5' : 'origin-top-center relative mt-1.5',
          'h-[var(--radix-navigation-menu-viewport-height)] w-full overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-90 md:w-[var(--radix-navigation-menu-viewport-width)]',
          className,
        )}
        ref={ref}
        {...props}
      />
    </div>
  );
});
NavigationMenuViewport.displayName = NavigationMenuPrimitive.Viewport.displayName;

type NavigationMenuIndicatorProps = React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Indicator> & {
  direction?: 'up' | 'down';
};

const NavigationMenuIndicator = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Indicator>,
  NavigationMenuIndicatorProps
>(({ className, direction: propDirection, ...props }, ref) => {
  const { direction: contextDirection } = useNavigationMenuContext();
  const direction = propDirection || contextDirection;
  
  return (
    <NavigationMenuPrimitive.Indicator
      ref={ref}
      className={cn(
        direction === 'up' ? 'bottom-full' : 'top-full',
        'z-[1] flex h-1.5 items-end justify-center overflow-hidden data-[state=visible]:animate-in data-[state=hidden]:animate-out data-[state=hidden]:fade-out data-[state=visible]:fade-in',
        className,
      )}
      {...props}
    >
      <div className={cn(
        "relative h-2 w-2 rotate-45 rounded-tl-sm bg-border shadow-md",
        direction === 'up' ? "bottom-[60%]" : "top-[60%]"
      )} />
    </NavigationMenuPrimitive.Indicator>
  );
});
NavigationMenuIndicator.displayName = NavigationMenuPrimitive.Indicator.displayName;

export {
  navigationMenuTriggerStyle,
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
};
