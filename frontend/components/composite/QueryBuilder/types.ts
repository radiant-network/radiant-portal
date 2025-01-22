import React from "react";

import {
  IRemoteComponent,
  ISqonGroupFilter,
  ISyntheticSqon,
  IValueFilter,
} from "@/utils/sqon/types";
// import { IQueriesSidebarDictionary } from "../CustomPill/QueriesSidebar/types";
// import { ISidebarMenuItem } from "../SidebarMenu";

export type ArrayTenOrMore<T> = {
  0: T;
  1: T;
  2: T;
  3: T;
  4: T;
  5: T;
  6: T;
  7: T;
  8: T;
  9: T;
  10: T;
} & Array<T>;

export enum CombinerEnum {
  And = "and",
  Or = "or",
}

export const defaultReferenceColors: ArrayTenOrMore<string> = [
  "#C31D7E",
  "#328536",
  "#AA00FF",
  "#C2410C",
  "#047ABE",
  "#E5231F",
  "#007D85",
  "#C51162",
  "#7B5A90",
  "#B85C00",
  "#722ED1",
  "#4D7C0F",
  "#9F1239",
  "#2D7D9A",
  "#847545",
];

export type IFetchQueryCount = (
  sqon: ISyntheticSqon,
  sqonList: ISyntheticSqon[]
) => Promise<number>;

export type IGetResolvedQueryForCount = (
  sqon: ISyntheticSqon,
  sqonList: ISyntheticSqon[]
) => ISqonGroupFilter;

export interface IQueryBuilderState {
  state?: ISyntheticSqon[];
  active?: string;
}

export interface IQueriesState {
  activeId: string;
  queries: ISyntheticSqon[];
}

export enum SavedFilterTypeEnum {
  Filter = "filter",
  Query = "query",
}

export interface ISavedFilter {
  id: string;
  title: string;
  favorite: boolean;
  queries: ISyntheticSqon[];
  type?: string;
}

export interface IQueryBuilderHeaderConfigOptions {
  enableEditTitle?: boolean;
  enableShare?: boolean;
  enableDuplicate?: boolean;
  enableFavoriteFilter?: boolean;
  enableUndoChanges?: boolean;
}

export interface IQueryBuilderHeaderConfig {
  showTools: boolean;
  showHeader: boolean;
  defaultTitle?: string;
  titleMaxLength?: number;
  options?: IQueryBuilderHeaderConfigOptions;
  savedFilters?: ISavedFilter[];
  selectedSavedFilter?: ISavedFilter | null;
  //collapseProps?: Omit<TCollapseProps, "defaultActiveKey">;
  onSetAsFavorite?: (filter: ISavedFilter) => void;
  onUpdateFilter?: (filter: ISavedFilter) => void | Promise<any>;
  onUpdateFilterModal?: (filter: ISavedFilter) => void;
  onShareFilter?: (filter: ISavedFilter) => void;
  onSaveFilter?: (filter: ISavedFilter) => void | Promise<any>;
  onDeleteFilter?: (filterId: string) => void;
  maxNameCapSavedQuery?: number;
}

export type TOnSavedFilterChange = (savedFilter: ISavedFilter) => void;
export type TCallbackRemoveAction = (
  field: string,
  query: ISyntheticSqon | Record<string, never>
) => void;
export type TCallbackRemoveReferenceAction = (
  refIndex: number,
  query: ISyntheticSqon | Record<string, never>
) => void;
export type TCallbackRemoveQueryAction = (
  id: string,
  query: ISyntheticSqon | Record<string, never>
) => void;
export type TOnChange = (
  id: string,
  query: ISyntheticSqon | Record<string, never>
) => void;
export type TOnFacetClick = (filter: IValueFilter) => void;

export interface ICustomPillConfig {
  createCustomPill: (query: ISavedFilter, tag: string) => any;
  tag: string;
  maxNameCapSavedQuery?: number;
  editCallback?: () => void;
  editPill: (
    queryPill: ISavedFilter,
    tag: string,
    queryBuilderId: string
  ) => any;
  getFiltersByPill: (id: string) => any;
  getPillById: (id: string) => any;
  //editMenuItems: ISidebarMenuItem[];
  queryEditionQBId: string;
  remoteComponentMapping?: (props: IRemoteComponent) => void;
  validateName: (title: string, tag: string) => any;
}

export interface ISaveCustomPillResponse {
  data?: ISavedFilter;
  hasError: boolean;
  message?: string;
}

// Dictionnary Types

interface IActions {
  addQuery?: React.ReactNode;
  combine?: React.ReactNode;
  labels?: React.ReactNode;
  clear?: IClearTranslation;
  delete?: IDeleteTranslation;
  new?: React.ReactNode;
  duplicate?: React.ReactNode;
  changeOperatorTo?: React.ReactNode;
  saveCustomPill?: ISaveTranslation;
}

interface IClearTranslation {
  title: React.ReactNode;
  cancel: React.ReactNode;
  confirm: React.ReactNode;
  buttonTitle: React.ReactNode;
  description: React.ReactNode;
}

interface IDeleteTranslation {
  title: React.ReactNode;
  titleSelected?: React.ReactNode;
  cancel: React.ReactNode;
  confirm: React.ReactNode;
}

interface ISaveTranslation {
  form?: {
    error?: {
      fieldRequired: string;
      nameAlreadyExists: string;
      invalidFormat: string;
    };
  };
  input: IInputDictionary & {
    maximumLength: React.ReactNode;
  };
  modal: {
    title: React.ReactNode;
    okText: React.ReactNode;
    cancelText: React.ReactNode;
    message: React.ReactNode;
  };
  tooltip?: { enabled: React.ReactNode; disabled: React.ReactNode };
}

interface IFacetValueMapping {
  [facet: string]: {
    [value: string]: string;
  };
}

type TTranslation = (key: string) => React.ReactNode;
interface IQuery {
  combine?: ICombineTranslation;
  noQuery?: React.ReactNode;
  facet?: TTranslation;
  setNameResolver?: TTranslation;
  facetValueMapping?: IFacetValueMapping;
}

interface ICombineTranslation {
  and: React.ReactNode;
  or: React.ReactNode;
}

interface IPopupConfirmDictionary {
  title: React.ReactNode;
  okText: React.ReactNode;
  cancelText: React.ReactNode;
  content: React.ReactNode;
}

interface IInputDictionary {
  label: React.ReactNode;
  placeholder: string;
}

export interface IFacetFilterConfig {
  enable: boolean;
  selectedFilterContent?: React.ReactElement;
  onFacetClick: TOnFacetClick;
  blacklistedFacets?: Array<string>;
}

interface IQueryBuilderHeaderDictionnary {
  modal?: {
    edit?: IPopupConfirmDictionary & {
      input: IInputDictionary & {
        maximumLength: React.ReactNode;
      };
    };
    saveThisFilter: React.ReactNode;
    confirmUnsaved?: {
      title: React.ReactNode;
      openSavedFilter: {
        okText: React.ReactNode;
        cancelText: React.ReactNode;
        content: React.ReactNode;
      };
      createNewFilter: {
        okText: React.ReactNode;
        cancelText: React.ReactNode;
        content: React.ReactNode;
      };
    };
  };
  form?: {
    error?: {
      fieldRequired: React.ReactNode;
    };
    pattern?: {
      regex: RegExp;
      message: string;
    };
  };
  notification?: {
    savedTitle: React.ReactNode;
  };
  popupConfirm?: {
    delete: IPopupConfirmDictionary;
  };
  tooltips?: {
    newQueryBuilder: React.ReactNode;
    save: React.ReactNode;
    saveChanges: React.ReactNode;
    saveDisabled: React.ReactNode;
    duplicateQueryBuilder: React.ReactNode;
    delete: React.ReactNode;
    share: React.ReactNode;
    shareDisabled: React.ReactNode;
    setAsDefaultFilter: React.ReactNode;
    unsetDefaultFilter: React.ReactNode;
    undoChanges: React.ReactNode;
    noSavedFilters: React.ReactNode;
  };
  myFiltersDropdown?: {
    title: React.ReactNode;
    manageMyFilter: React.ReactNode;
  };
  duplicateFilterTitleSuffix?: string;
  manageFilters?: {
    modalTitle?: string;
    okText?: string;
    lastSavedAt?: string;
  };
}

export interface IDictionary {
  queryBuilderHeader?: IQueryBuilderHeaderDictionnary;
  actions?: IActions;
  query?: IQuery;
  // queriesSidebar?: IQueriesSidebarDictionary;
}

export interface IQueryBuilderProps {
  id: string;
  className?: string;
  dictionary?: IDictionary;
  total?: number;
  iconTotal?: React.ReactNode;
  currentQuery?: ISyntheticSqon | Record<string, never>;
  enableCombine?: boolean;
  enableSingleQuery?: boolean;
  enableShowHideLabels?: boolean;
  initialShowLabelState?: boolean;
  referenceColors?: ArrayTenOrMore<string>;
  headerConfig?: IQueryBuilderHeaderConfig;
  facetFilterConfig?: IFacetFilterConfig;
  customPillConfig?: ICustomPillConfig;
  fetchQueryCount: IFetchQueryCount;
  getResolvedQueryForCount: IGetResolvedQueryForCount;
  remoteComponentMapping?: (props: IRemoteComponent) => void;
  filterQueryToIgnore?: string[];
}
