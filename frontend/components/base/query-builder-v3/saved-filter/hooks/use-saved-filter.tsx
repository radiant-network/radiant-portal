import { createContext, Dispatch, useContext, useReducer } from 'react';

import { SavedFilter, SavedFilterType } from '@/api/index';

export enum SavedFiltersActionType {
  SET_SELECTED = 'set-selected',
  SAVE = 'save',
  SET_HAS_CHANGES_NOT_SAVED = 'set-has-changes-not-saved',
}

type SavedFilterDispatch = Dispatch<ActionType>;

export interface ISavedFilterContextProps {
  savedFilterType: SavedFilterType;
  savedFilters: SavedFilter[];
  selectedSavedFilter?: SavedFilter;
  hasChangesNotSaved?: boolean;
}

/**
 * Context
 */
export const SavedFilterContext = createContext<ISavedFilterContextProps>({
  savedFilterType: SavedFilterType.GERMLINE_SNV_OCCURRENCE,
  savedFilters: [],
  selectedSavedFilter: undefined,
  hasChangesNotSaved: false,
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

type SetHasChangesNotSaved = {
  type: SavedFiltersActionType.SET_HAS_CHANGES_NOT_SAVED;
  payload: boolean;
};

export type ActionType = SetSelectedSavedFilter | SaveSavedFilters | SetHasChangesNotSaved | any;

export function savedFiltersReducer(context: ISavedFilterContextProps, action: ActionType) {
  switch (action.type) {
    case SavedFiltersActionType.SET_SELECTED: {
      return {
        ...context,
        selectedSavedFilter: action.payload,
        hasChangesNotSaved: false,
      };
    }
    case SavedFiltersActionType.SAVE: {
      return {
        ...context,
        savedFilters: action.payload.savedFilters,
        selectedSavedFilter: action.payload.selectedSavedFilter,
        hasChangesNotSaved: false,
      };
    }
    case SavedFiltersActionType.SET_HAS_CHANGES_NOT_SAVED: {
      return {
        ...context,
        hasChangesNotSaved: action.payload,
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
