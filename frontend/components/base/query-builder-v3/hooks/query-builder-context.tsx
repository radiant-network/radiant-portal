// @TODO: to be changed for api
import { createContext, Dispatch, useContext, useReducer } from 'react';

import { ActiveQueryProps, QBActionFlag, QueryProps } from './type';

export type QBContextProps = {
  activeQuery?: QueryProps;
};

type QBDispatch = Dispatch<QBAction>;

/**
 * Context
 */
export const QBContext = createContext<QBContextProps>({});
export const QBDispatchContext = createContext<QBDispatch>(() => {
  console.warn('QueryBuilderDispatchContext has been initialized without any dispatch props');
});

/**
 * Reducer
 */
export type QBAction = { type: QBActionFlag.UPDATE_ACTIVE_QUERY; payload: ActiveQueryProps };
export function qBReducer(context: QBContextProps, action: QBAction) {
  switch (action.type) {
    case QBActionFlag.UPDATE_ACTIVE_QUERY: {
      return {
        ...context,
        activeQuery: action.payload,
      };
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}

/**
 * Provider
 */
export function QBProvider({ children }: { children: React.ReactElement }) {
  const [tasks, dispatch] = useReducer(qBReducer, { activeQuery: {} });

  return (
    <QBContext value={tasks}>
      <QBDispatchContext value={dispatch}>{children}</QBDispatchContext>
    </QBContext>
  );
}

/**
 * Custom Hooks
 */
export function useQBContext() {
  return useContext(QBContext);
}

export function useQBDispatch() {
  return useContext(QBDispatchContext);
}
