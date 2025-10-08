import { ReactNode } from 'react';
import { DeepPartial } from 'react-hook-form';

import { Sqon } from '@/api/api';
import { PartialKeys } from '@/components/lib/utils';
import { CoreQueryBuilderProps, QueryBuilderInstance } from '@/components/model/query-builder-core';
import { ISavedFilter, IUserSavedFilter } from '@/components/model/saved-filter';
import { IValueFilter, ResolveSyntheticSqonFunc } from '@/components/model/sqon';

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

export type QueryPillCustomConfig = {
  /**
   * Enable or disable custom pill.
   * This basically only show or hide the save icon button on a query bar.
   */
  enable: boolean;

  /**
   * Query builder id for custom pill edition
   */
  queryBuilderEditId: string;

  /**
   * Validate the title of the custom pill
   */
  validateCustomPillTitle: (title: string) => Promise<boolean>;

  /**
   * Get the custom pill by id
   */
  fetchCustomPillById: (id: string) => Promise<IUserSavedFilter>;

  /**
   * Get the filters by custom pill id
   */
  fetchSavedFiltersByCustomPillId: (id: any) => Promise<ISavedFilter[]>;
};

type QueryPillFacetFilterConfig = {
  /**
   * Enable or disable query pill filter.
   */
  enable: boolean;

  /**
   * List of blacklisted facets (fields).
   * This will disable the query pill filter dropdown for those facets
   */
  blacklistedFacets?: string[];

  /**
   * Callback when a query pill facet is clicked.
   * Should return the component to show in the popover
   */
  onFacetClick: (filter: IValueFilter) => ReactNode;
};

type QueryBuilderSharedProps = {
  /**
   * Enable the combine feature
   */
  enableCombine?: boolean;

  /**
   * Enable the favorite feature
   */
  enableFavorite?: boolean;

  /**
   * Enable the show/hide labels feature
   */
  enableShowHideLabels?: boolean;

  /**
   * Icon to use for the query count
   */
  queryCountIcon?: ReactNode;

  /**
   * Fetch the query count
   */
  fetchQueryCount: (resolvedSqon: Sqon) => Promise<number>;

  /**
   * Resolver for sqon
   */
  resolveSyntheticSqon: ResolveSyntheticSqonFunc;

  /**
   * Custom pill configuration
   */
  customPillConfig?: QueryPillCustomConfig;

  /**
   * Query pill facet filter configuration
   */
  queryPillFacetFilterConfig?: QueryPillFacetFilterConfig;
};

export type QueryBuilderProps = PartialKeys<
  CoreQueryBuilderProps &
    QueryBuilderSharedProps & {
      /**
       * Initial state of the show/hide labels feature
       */
      initialShowHideLabels?: boolean;

      /**
       * Colors to use for query reference
       */
      queryReferenceColors?: ArrayTenOrMore<string>;

      /**
       * If query builder is in loading state
       */
      loading?: boolean;

      /**
       * Dictionary for copies
       */
      dictionary?: DeepPartial<QueryBuilderDictionary>;
    },
  'state'
>;

export type QueryBuilderContextType = QueryBuilderSharedProps & {
  queryBuilder: QueryBuilderInstance;
  showLabels?: boolean;
  toggleLabels?: (show: boolean) => void;
  getQueryReferenceColor: (refIndex: number) => string;
  loading?: boolean;
};

export type QueryBuilderDictionary = {
  queryBar: {
    empty: string;
    deletePopover: {
      title: string;
      cancel: string;
      ok: string;
    };
    customPill: {
      createTooltip: string;
      cannotSaveAsCustomPill: string;
    };
    saveDialog: {
      title: string;
      fields: {
        title: {
          label: string;
          placeholder: string;
        };
      };
      notice: string;
      cancel: string;
      ok: string;
    };
  };
  queryPill: {
    operator: {
      changeOperatorTo: string;
      and: string;
      or: string;
    };
    facet: (key: string) => React.ReactNode;
    customPill: {
      editDialog: {
        title: string;
        cancel: string;
        ok: string;
      };
      cantBeEmptyDialog: {
        title: string;
        description: string;
        ok: string;
      };
      titleExistsDialog: {
        title: string;
        description: string;
        ok: string;
      };
      saveDialog: {
        title: string;
        confirmationMessage: `${string}{title}${string}`;
        affectedFilters: string;
        cancel: string;
        ok: string;
      };
    };
  };
  toolbar: {
    combine: string;
    newQuery: string;
    clearAll: string;
    clearAllDialog: {
      title: string;
      description: string;
      cancel: string;
      ok: string;
    };
    labels: string;
  };
  savedFilter: {
    deleteTooltip: string;
    deleteDialog: {
      title: string;
      description: string;
      cancel: string;
      ok: string;
    };
    duplicateTooltip: string;
    overwriteDialog: {
      title: string;
      description: string;
      cancel: string;
      ok: string;
    };
    editDialog: {
      title: string;
      cancel: string;
      ok: string;
      fields: {
        title: {
          label: string;
          placeholder: string;
        };
      };
    };
    myFilters: string;
    manageFilters: string;
    manageDialog: {
      title: string;
      close: string;
      lastSaveAt: `${string}{lastSaveAt}${string}` | `${string}${string}{lastSaveAt}`;
    };
    newFilter: string;
    saveTooltip: {
      whenEmpty: string;
      whenDirty: string;
      default: string;
    };
    shareTooltip: {
      whenNotSaved: string;
      default: string;
    };
    favoriteTooltip: {
      set: string;
      unset: string;
    };
    discardTooltip: string;
    noSavedFilters: string;
    notifications: {
      created: string;
      deleted: string;
      updated: string;
      errors: {
        duplicated: string;
        fetching: string;
        updated: string;
        deleted: string;
        created: string;
      };
    };
  };
};
