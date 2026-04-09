import { createContext, type ReactNode, useContext } from 'react';

import { SavedFilterType } from '@/api/index';
import { RangeOperators } from '@/components/cores/sqon';

export enum ApplicationId {
  'admin' = 'admin',
  'germline_snv_occurrence' = 'germline_snv_occurrence',
  'germline_cnv_occurrence' = 'germline_cnv_occurrence',
  'somatic_snv_to_occurrence' = 'somatic_snv_to_occurrence',
  'somatic_snv_tn_occurrence' = 'somatic_snv_tn_occurrence',
  'somatic_cnv_to_occurrence' = 'somatic_cnv_to_occurrence',
  'variant_entity' = 'germline_snv_occurrence',
}

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
export enum FilterTypes {
  MULTIPLE = 'multiple',
  BOOLEAN = 'boolean',
  NUMERICAL = 'numerical',
  DIVIDER = 'divider',
  SEARCH_BY = 'search_by',
  UPLOAD_LIST = 'upload_list',
}

export interface Aggregation {
  key: string;
  translation_key: string;
  type: FilterTypes;
  defaults?: TFilterGroupConfig;
  tooltips?: string[];
  intervalDecimal?: { [key: string]: number };
  withDictionary?: boolean;
  facetHidden?: boolean;
}

export interface AggregationGroup {
  items: Aggregation[];
}

export type AggregationConfig = {
  [key: string]: AggregationGroup;
};

export interface BaseAppsConfig {
  app_id: ApplicationId;
  saved_filter_type: SavedFilterType;
}

export interface AppsConfig extends BaseAppsConfig {
  aggregations: AggregationConfig;
}

export interface AppsAdminConfig extends BaseAppsConfig {
  admin_code: string;
}

export interface PortalConfig {
  admin: AppsAdminConfig;
  variant_entity: BaseAppsConfig;
  germline_snv_occurrence: AppsConfig;
  germline_cnv_occurrence: AppsConfig;
  somatic_snv_to_occurrence: AppsConfig;
  somatic_snv_tn_occurrence: AppsConfig;
  somatic_cnv_to_occurrence: AppsConfig;
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

export const ConfigProvider = ({ children, config }: ConfigProviderProps) => (
  <ConfigContext.Provider value={config}>{children}</ConfigContext.Provider>
);

export const useConfig = (): PortalConfig => {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
};
