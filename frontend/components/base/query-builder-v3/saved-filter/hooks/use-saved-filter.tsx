import { createContext, Dispatch, useContext, useReducer } from 'react';

import { SavedFilter, SavedFilterType } from '@/api/index';

export enum SavedFiltersActionType {
  SET_SELECTED = 'set-selected',
  SAVE = 'save',
  SET_IS_UNSAVED = 'set-is-unsaved',
  DELETE = 'delete',
}

type SavedFilterDispatch = Dispatch<ActionType>;

export interface ISavedFilterContextProps {
  savedFilterType: SavedFilterType;
  savedFilters: SavedFilter[];
  selectedSavedFilter?: SavedFilter;
  isUnsaved?: boolean;
}

/**
 * Context
 */
export const SavedFilterContext = createContext<ISavedFilterContextProps>({
  savedFilterType: SavedFilterType.GERMLINE_SNV_OCCURRENCE,
  savedFilters: [],
  selectedSavedFilter: undefined,
  isUnsaved: false,
});

export const SavedFilterDispatchContext = createContext<SavedFilterDispatch>(() => {
  console.warn('SavedFilterDispatchContext has been initialized without any dispatch props');
});

/**
 * Reducer
 *
 * Each payload is his own type
 */
type SetSelectedSavedFilter = {
  type: SavedFiltersActionType.SET_SELECTED;
  payload: SavedFilter | undefined;
};
type SaveSavedFilters = {
  type: SavedFiltersActionType.SAVE;
  payload: { savedFilters: SavedFilter[]; selectedSavedFilter?: SavedFilter };
};
type SetIsUnsaved = {
  type: SavedFiltersActionType.SET_IS_UNSAVED;
  payload: boolean;
};
type DeleteSavedFilter = {
  type: SavedFiltersActionType.DELETE;
  payload: SavedFilter[];
};

export type ActionType = SetSelectedSavedFilter | SaveSavedFilters | SetIsUnsaved | DeleteSavedFilter | any;

export function savedFiltersReducer(context: ISavedFilterContextProps, action: ActionType) {
  switch (action.type) {
    case SavedFiltersActionType.SET_SELECTED: {
      return {
        ...context,
        selectedSavedFilter: action.payload,
        isUnsaved: false,
      };
    }
    case SavedFiltersActionType.SAVE: {
      return {
        ...context,
        savedFilters: action.payload.savedFilters,
        selectedSavedFilter: action.payload.selectedSavedFilter,
        isUnsaved: false,
      };
    }
    case SavedFiltersActionType.SET_IS_UNSAVED: {
      return {
        ...context,
        isUnsaved: action.payload,
      };
    }
    case SavedFiltersActionType.DELETE: {
      return {
        ...context,
        savedFilters: action.payload,
        selectedSavedFilter: undefined,
        isUnsaved: false,
      };
    }
    default: {
      throw new Error(`Saved filters unknown action: ${action.type} ${JSON.stringify(action.payload)}`);
    }
  }
}

/**
 * Provider
 */
type SavedFiltersProviderProps = ISavedFilterContextProps & {
  children: React.ReactNode;
};
export function SavedFiltersProvider({ children, ...props }: SavedFiltersProviderProps) {
  const [value, dispatch] = useReducer(savedFiltersReducer, props);

  return (
    <SavedFilterContext value={value}>
      <SavedFilterDispatchContext value={dispatch}>{children}</SavedFilterDispatchContext>
    </SavedFilterContext>
  );
}

/**
 * Custom hooks
 */
export function useSavedFiltersContext(): ISavedFilterContextProps {
  const context = useContext(SavedFilterContext);
  if (!context) {
    throw new Error('useSavedFiltersContext must be used within a SavedFiltersProvider');
  }
  return context;
}

export function useSavedFiltersDispatch(): SavedFilterDispatch {
  const context = useContext(SavedFilterDispatchContext);
  if (!context) {
    throw new Error('useSavedFiltersDispatch must be used within a SavedFiltersProvider');
  }
  return context;
}
