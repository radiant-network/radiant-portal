import { createContext } from "react";

import {
  ICustomPillConfig,
  IDictionary,
  IFacetFilterConfig,
  IQueriesState,
  IQueryBuilderHeaderConfig,
  ISavedFilter,
} from "./types";

export type TQueryBuilderContextType = {
  queryBuilderId: string;
  queriesState: IQueriesState;
  customPillConfig: ICustomPillConfig;
  headerConfig: IQueryBuilderHeaderConfig;
  selectedSavedFilter: ISavedFilter | null;
  noQueries: boolean;
  canCombine: boolean;
  enableCombine: boolean;
  enableShowHideLabels: boolean;
  enableSingleQuery: boolean;
  hasEmptyQuery: boolean;
};

export type TQueryCommonContext = {
  showLabels: boolean;
  dictionary: IDictionary;
  facetFilterConfig: IFacetFilterConfig;
};

export const defaultHeaderConfig = {
  defaultTitle: "Untitled Filter",
  onDeleteFilter: (): void => {
    /* */
  },
  onSaveFilter: (): void => {
    /* */
  },
  onSetAsFavorite: (): void => {
    /* */
  },
  onShareFilter: (): void => {
    /* */
  },
  onUpdateFilter: (): void => {
    /* */
  },
  options: {
    enableDuplicate: true,
    enableEditTitle: true,
    enableFavoriteFilter: false,
    enableShare: false,
    enableUndoChanges: false,
  },
  savedFilters: [],
  selectedSavedFilter: null,
  showHeader: false,
  showTools: false,
};

export const defaultFacetFilterConfig = {
  blacklistedFacets: [],
  enable: false,
  onFacetClick: (): void => {
    /* */
  },
};

export const defaultCustomPillConfig: ICustomPillConfig = {
  createCustomPill: () => ({}),
  //editMenuItems: [],
  editPill: () => ({}),
  getFiltersByPill: () => ({}),
  getPillById: () => undefined,
  queryEditionQBId: "",
  tag: "",
  validateName: () => ({}),
};

export const QueryBuilderContext = createContext<TQueryBuilderContextType>({
  canCombine: false,
  customPillConfig: defaultCustomPillConfig,
  enableCombine: false,
  enableShowHideLabels: false,
  enableSingleQuery: false,
  hasEmptyQuery: false,
  headerConfig: defaultHeaderConfig,
  noQueries: false,
  queriesState: {
    activeId: "",
    queries: [],
  },
  queryBuilderId: "",
  selectedSavedFilter: null,
});

export const QueryCommonContext = createContext<TQueryCommonContext>({
  dictionary: {},
  facetFilterConfig: defaultFacetFilterConfig,
  showLabels: false,
});
