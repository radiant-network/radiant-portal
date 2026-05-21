import { createContext, Dispatch, useCallback, useContext, useEffect, useMemo, useReducer } from 'react';
import { useSearchParams } from 'react-router';
import { SWRResponse } from 'swr';

type IDataTableContext = {
  list?: SWRResponse;
  count?: SWRResponse;
  rowSelection?: Record<string, boolean>;
};

export const DataTableContext = createContext<IDataTableContext>({});

type ActionType = {
  type: 'SET_ROW_SELECTION';
  payload: {
    rowSelection: Record<string, boolean>;
  };
};
type DataTableDispatch = Dispatch<ActionType>;

export const DataTableDispatchProvider = createContext<DataTableDispatch>(() => {
  console.warn('DataTableDispatchContext has been initialized without any dispatch props');
});

/**
 * Store
 */
export function DataTableReducer(context: IDataTableContext, action: ActionType) {
  switch (action.type) {
    case 'SET_ROW_SELECTION': {
      return { ...context, rowSelection: { ...action.payload.rowSelection } };
    }

    default: {
      throw Error(`DataTableReducer unknown action: ${action.type} ${JSON.stringify(action.payload)}`);
    }
  }
}

/**
 * Components
 */
type QBProviderProps = IDataTableContext & {
  children: React.ReactNode;
};

export function DataTableProvider({ children, ...props }: QBProviderProps) {
  const [state, dispatch] = useReducer(DataTableReducer, props);

  return (
    <DataTableContext value={{ ...state, list: props.list, count: props.count }}>
      <DataTableDispatchProvider value={dispatch}>{children}</DataTableDispatchProvider>
    </DataTableContext>
  );
}

/**
 * Hooks
 */
export function useDataTable() {
  const context = useContext(DataTableContext);
  if (!context) {
    throw new Error('useDataTable must be used within a DataTableProvider');
  }
  return context;
}

export function useDataTableDispatch() {
  const dispatch = useContext(DataTableDispatchProvider);
  if (!dispatch) {
    throw new Error('useDataTableDispatch must be used within a DataTableProvider');
  }
  return dispatch;
}

/**
 * Allow
 */

interface UseSliderOccurrenceNavigationProps<T> {
  data: T[];
  paramsKey: string;
  targetKey: string;
  find: (target: string | number | null) => (value: T) => boolean;
}
interface useDataTableRowNavigationReturn<T> {
  selected?: T;
  hasPrevious: boolean;
  hasNext: boolean;
  handleClose: () => void;
  handlePrevious: () => void;
  handleNext: () => void;
}

/**
 * @NOTE: if only using targetKey is limited, a custom filter function could be used instead
 */
export function useDataTableRowNavigation<T extends any>({
  data,
  paramsKey,
  targetKey,
  find,
}: UseSliderOccurrenceNavigationProps<T>): useDataTableRowNavigationReturn<T> {
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDataTableDispatch();
  const target = searchParams.get(paramsKey);

  const customFind = useCallback(find(target), [target]);

  const selected = data.find(customFind);

  let index = -1;
  if (target) {
    index = data.findIndex(customFind);
  }

  /**
   * Clean searchParams when closing external component
   */
  const handleClose = () => {
    setSearchParams(prev => {
      prev.delete(paramsKey);
      return prev;
    });

    dispatch({
      type: 'SET_ROW_SELECTION',
      payload: {
        rowSelection: {},
      },
    });
  };

  /**
   * Select previous row in data-table
   */
  const handlePrevious = () => {
    if (index > 0) {
      const previousIndex = index - 1;
      const previous = data[previousIndex];
      setSearchParams(prev => {
        prev.set(paramsKey, previous[targetKey as keyof T] as string);
        return prev;
      });

      dispatch({
        type: 'SET_ROW_SELECTION',
        payload: {
          rowSelection: { [previousIndex]: true },
        },
      });
    }
  };

  /**
   * Select next row in data-table
   */
  const handleNext = () => {
    if (index >= 0 && index < data.length - 1) {
      const nextIndex = index + 1;
      const next = data[nextIndex];
      setSearchParams(prev => {
        prev.set(paramsKey, next[targetKey as keyof T] as string);
        return prev;
      });

      dispatch({
        type: 'SET_ROW_SELECTION',
        payload: {
          rowSelection: { [nextIndex]: true },
        },
      });
    }
  };

  const hasPrevious = useMemo(() => index > 0, [index]);
  const hasNext = useMemo(() => index >= 0 && index < data.length - 1, [index, data.length]);

  useEffect(() => {
    if (index === -1) return;
    dispatch({
      type: 'SET_ROW_SELECTION',
      payload: {
        rowSelection: { [index]: true },
      },
    });
  }, [index, searchParams]);

  return {
    selected,
    hasPrevious,
    hasNext,
    handleClose,
    handlePrevious,
    handleNext,
  };
}
