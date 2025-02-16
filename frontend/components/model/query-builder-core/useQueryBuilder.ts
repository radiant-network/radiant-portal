import { useEffect, useState } from "react";
import {
  CoreQueryBuilderProps,
  createQueryBuilder,
  getDefaultQueryBuilderState,
  QUERY_BUILDER_UPDATE_EVENT_KEY,
  QueryBuilderInstance,
  QueryBuilderState,
  QueryBuilderUpdateEvent,
} from "./query-builder";
import { queryBuilderRemote } from "./query-builder-remote";
import { PartialKeys } from "@/components/lib/utils";

export const useQueryBuilder = (
  props: PartialKeys<CoreQueryBuilderProps, "state">
): QueryBuilderInstance => {
  const defaultProps: CoreQueryBuilderProps = {
    state: {
      ...getDefaultQueryBuilderState(),
      ...queryBuilderRemote.getLocalQueryBuilderState(props.id),
      savedFilters: [],
      selectedQueryIndexes: [],
    },
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
          const newState: QueryBuilderState = {
            ...prev,
            ...event.value,
          };

          props.onStateChange?.(newState);

          return newState;
        });
      }
    };

    window.addEventListener(QUERY_BUILDER_UPDATE_EVENT_KEY, listener);

    return () => {
      window.removeEventListener(QUERY_BUILDER_UPDATE_EVENT_KEY, listener);
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
      queryBuilderRemote.setLocalQueryBuilderState(props.id, newState, true);
    },
  }));

  return queryBuilderRef.current;
};
