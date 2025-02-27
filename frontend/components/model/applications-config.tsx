import { createContext, type ReactNode, useContext } from "react";

export interface Aggregation {
  key: string;
  type: 'multiple' | 'boolean' | 'range';
}

export type AggregationConfig = Aggregation[];


export interface AppsConfig {
  'aggregations': AggregationConfig;
}

export interface PortalConfig {
  'variant_entity': AppsConfig;
}

const ConfigContext = createContext<PortalConfig | undefined>(undefined);

interface ConfigProviderProps {
  children: ReactNode;
  config: PortalConfig | undefined;
}

export const ConfigProvider = ({ children, config }: ConfigProviderProps) => {
  return (
    <ConfigContext.Provider value={config}>
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = (): PortalConfig => {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
};

