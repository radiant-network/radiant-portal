import { useEffect, useState } from "react";
import {
  CoreQueryBuilderProps,
  createQueryBuilder,
  getDefaultQueryBuilderState,
  QUERY_BUILDER_UPDATE_EVENT_KEY,
  QueryBuilderInstance,
  QueryBuilderProps,
  QueryBuilderUpdateEvent,
} from "./query-builder";

export const useQueryBuilder = (
  props: QueryBuilderProps
): QueryBuilderInstance => {
  const defaultProps: CoreQueryBuilderProps = {
    state: getDefaultQueryBuilderState(),
    onStateChange: () => {},
    ...props,
  };

  const [queryBuilderRef] = useState(() => ({
    current: createQueryBuilder(defaultProps),
  }));

  const [state, setState] = useState(
    () => defaultProps.initialState || defaultProps.state
  );

  useEffect(() => {
    const listener = (event: QueryBuilderUpdateEvent) => {
      if (event.queryBuilderId === props.id) {
        setState((prev) => {
          const newState = {
            ...prev,
            ...event.value,
          };

          props.onStateChange?.(newState);

          return newState;
        });
      }
    };

    document.addEventListener(QUERY_BUILDER_UPDATE_EVENT_KEY, listener);

    return () => {
      document.removeEventListener(QUERY_BUILDER_UPDATE_EVENT_KEY, listener);
    };
  }, []);

  queryBuilderRef.current.setCoreProps((prevProps) => ({
    ...prevProps,
    ...props,
    state: {
      ...state,
      ...props.state,
    },
    onStateChange: (newState) => {
      setState(newState);
      props.onStateChange?.(newState);
    },
  }));

  return queryBuilderRef.current;
};
