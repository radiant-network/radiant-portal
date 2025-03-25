import { createContext, type ReactNode, useContext } from "react";
import { RangeOperators } from "@/components/model/sqon";

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
  type: "multiple" | "boolean" | "numerical";
  defaults?: TFilterGroupConfig;
  tooltips?: string[];
  intervalDecimal?: { [key: string]: number };
}

export type AggregationConfig = Aggregation[];

export interface AppsConfig {
  app_id: string;
  aggregations: AggregationConfig;
}

export interface PortalConfig {
  variant_entity: AppsConfig;
}

const ConfigContext = createContext<PortalConfig | undefined>(undefined);

interface ConfigProviderProps {
  children: ReactNode;
  config: PortalConfig | undefined;
}

export const ConfigProvider = ({ children, config }: ConfigProviderProps) => {
  return (
    <ConfigContext.Provider value={config}>{children}</ConfigContext.Provider>
  );
};

export const useConfig = (): PortalConfig => {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error("useConfig must be used within a ConfigProvider");
  }
  return context;
};
