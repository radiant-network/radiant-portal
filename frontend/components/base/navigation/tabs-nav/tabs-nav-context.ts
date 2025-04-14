import { createContext, useContext } from 'react';

export type TabsNavContextType = {
  value?: any;
  onValueChange?: (value: any) => void;
};

export const TabsNavContext = createContext<TabsNavContextType | null>(null);

export const useTabsNavContext = () => {
  const context = useContext(TabsNavContext);
  if (context === null) {
    throw new Error('useTabsNavContext must be used within a TabsNavProvider');
  }
  return context;
};
