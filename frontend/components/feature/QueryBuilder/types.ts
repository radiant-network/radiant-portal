import { PartialKeys } from "@/components/lib/utils";
import {
  CoreQueryBuilderProps,
  QueryBuilderInstance,
} from "@/components/model/query-builder-core";
import {
  ISavedFilter,
  IUserSavedFilter,
} from "@/components/model/saved-filter";
import { ISyntheticSqon } from "@/components/model/sqon";
import { LucideProps } from "lucide-react";
import { ReactElement } from "react";
import { DeepPartial } from "react-hook-form";

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

type QueryPillCustomConfig = {
  /**
   * Query builder id for custom pill edition
   */
  queryBuilderEditId: string;
  /**
   * Validate the title of the custom pill
   */
  validateCustomPillTitle: (title: string, tag: string) => Promise<boolean>;
  /**
   * Get the custom pill by id
   */
  fetchCustomPillById: (id: string) => Promise<IUserSavedFilter>;
  /**
   * Get the filters by custom pill id
   */
  fetchSavedFiltersByCustomPillId: (id: string) => Promise<ISavedFilter[]>;
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
  queryCountIcon?: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
  /**
   * Fetch the query count
   */
  fetchQueryCount: (sqon: ISyntheticSqon) => Promise<number>;
  /**
   * Custom pill configuration
   */
  customPillConfig?: QueryPillCustomConfig;
};

export type QueryBuilderProps = PartialKeys<
  CoreQueryBuilderProps &
    QueryBuilderSharedProps & {
      className?: string;
      /**
       * Initial state of the show/hide labels feature
       */
      initialShowHideLabels?: boolean;
      /**
       * Colors to use for query reference
       */
      queryReferenceColors?: ArrayTenOrMore<string>;
      /**
       * Dictionary for copies
       */
      dictionary?: DeepPartial<QueryBuilderDictionary>;
    },
  "state"
>;

export type QueryBuilderContextType = QueryBuilderSharedProps & {
  queryBuilder: QueryBuilderInstance;
  showLabels?: boolean;
  toggleLabels?: (show: boolean) => void;
  getQueryReferenceColor: (refIndex: number) => string;
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
      cantBeEmptyDialod: {
        title: string;
        description: string;
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
      lastSaveAt:
        | `${string}{lastSaveAt}${string}`
        | `${string}${string}{lastSaveAt}`;
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
  };
};
