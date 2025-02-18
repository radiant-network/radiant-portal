import { useEffect, useState } from "react";
import {
  CoreQueryBuilderProps,
  createQueryBuilder,
  getDefaultQueryBuilderState,
  QUERY_BUILDER_UPDATE_EVENT_KEY,
  QueryBuilderInstance,
  QueryBuilderRemoteEvent,
  QueryBuilderRemoteState,
  QueryBuilderState,
  QueryBuilderUpdateEventType,
} from "./query-builder";
import { queryBuilderRemote } from "./query-builder-remote";
import { PartialKeys } from "@/components/lib/utils";
import { ISyntheticSqon } from "../sqon";

export const useQueryBuilder = (
  props: PartialKeys<CoreQueryBuilderProps, "state">
): QueryBuilderInstance => {
  const defaultProps: CoreQueryBuilderProps = {
    state: {
      ...getDefaultQueryBuilderState(),
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
    props.onStateChange?.(state);
  }, [state]);

  useEffect(() => {
    const listener = (event: QueryBuilderRemoteEvent) => {
      if (event.queryBuilderId === props.id) {
        if (event.eventType === QueryBuilderUpdateEventType.ADD_QUERY) {
          const sqon = event.eventData as ISyntheticSqon;

          props.onQueryCreate?.(sqon);

          if (sqon.id === event.value.activeQueryId) {
            props.onActiveQueryChange?.(sqon);
          }
        } else if (
          event.eventType === QueryBuilderUpdateEventType.UPDATE_QUERY
        ) {
          const sqon = event.eventData as ISyntheticSqon;

          props.onQueryUpdate?.(sqon);

          if (sqon.id === event.value.activeQueryId) {
            props.onActiveQueryChange?.(sqon);
          }
        }

        setState((prev) => {
          const newState: QueryBuilderState = {
            ...prev,
            ...event.value,
          };

          return newState;
        });
      }
    };

    window.addEventListener(
      QUERY_BUILDER_UPDATE_EVENT_KEY,
      listener as EventListener
    );

    return () => {
      window.removeEventListener(
        QUERY_BUILDER_UPDATE_EVENT_KEY,
        listener as EventListener
      );
    };
  }, []);

  queryBuilderRef.current.setCoreProps((prevProps) => ({
    savedFilterDefaultTitle: "Untitled filter",
    ...prevProps,
    ...props,
    state: {
      ...state,
      ...props.state,
    },
    onStateChange: (newState) => {
      setState(newState);
      queryBuilderRemote.setLocalQueryBuilderState(props.id, {
        value: newState,
        skipEvent: true,
      });
    },
  }));

  return queryBuilderRef.current;
};
