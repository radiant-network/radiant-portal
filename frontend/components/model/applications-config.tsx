import { createContext, type ReactNode, useContext } from 'react';
import { RangeOperators } from '@/components/model/sqon';

export interface IFilterRangeTypes {
  key: string;
  name: string | React.ReactNode;
}

export interface IFilterCheckboxConfig {
  nameMapping?: {
    [field: string]: string;
  };
  showMoreReadOnly?: boolean;
  showSelectAll?: boolean;
  withFooter?: boolean;
  extraFilterDictionary?: string[];
  facetTranslate?: (value: string) => string;
  categoryIcon?: ReactNode;
}

export interface IFilterRangeConfig {
  max: number | undefined;
  min: number | undefined;
  step?: number | string;
  operators?: RangeOperators[];
  rangeTypes?: IFilterRangeTypes[];
  defaultOperator?: RangeOperators;
  defaultMin?: number;
  defaultMax?: number;
  noDataInputOption?: boolean;
  intervalDecimal?: number;
}

export interface IFilterTextInputConfig {
  label: ReactNode;
  placeholder: string;
  tooltip?: {
    text: ReactNode;
  };
  validateInput?: (text: string) => boolean;
}

export type TFilterGroupConfig = IFilterRangeConfig | IFilterTextInputConfig | IFilterCheckboxConfig;

export interface Aggregation {
  key: string;
  type: 'multiple' | 'boolean' | 'numerical';
  defaults?: TFilterGroupConfig;
  tooltips?: string[];
  intervalDecimal?: { [key: string]: number };
}

export interface AggregationGroup {
  items: Aggregation[];
}

export type AggregationConfig = {
  [key: string]: AggregationGroup;
};

export interface BaseAppsConfig {
  app_id: string;
}

export interface AppsConfig extends BaseAppsConfig {
  aggregations: AggregationConfig;
}

export interface AppsAdminConfig extends BaseAppsConfig {
  admin_code: string;
}

export interface PortalConfig {
  admin: AppsAdminConfig;
  variant_exploration: AppsConfig;
  variant_entity: BaseAppsConfig;
  portal: {
    name: string;
    navigation: {
      dashboard?: boolean;
      variant?: boolean;
      profile?: boolean;
      settings?: boolean;
      logout?: boolean;
    };
  };
}

const ConfigContext = createContext<PortalConfig | undefined>(undefined);

interface ConfigProviderProps {
  children: ReactNode;
  config: PortalConfig | undefined;
}

export const ConfigProvider = ({ children, config }: ConfigProviderProps) => {
  return <ConfigContext.Provider value={config}>{children}</ConfigContext.Provider>;
};

export const useConfig = (): PortalConfig => {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
};
