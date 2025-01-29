import { useState } from "react";
import {
  CoreQueryBuilderProps,
  createQueryBuilder,
  QueryBuilderInstance,
  QueryBuilderProps,
} from "./query-builder";
import { v4 } from "uuid";

export const useQueryBuilder = (
  props: QueryBuilderProps
): QueryBuilderInstance => {
  const defaultProps: CoreQueryBuilderProps = {
    state: {
      activeQueryId: v4(),
      queries: [],
    },
    onStateChange: () => {},
    ...props,
  };

  const [queryBuilderRef] = useState(() => ({
    current: createQueryBuilder(defaultProps),
  }));

  const [state, setState] = useState(
    () => queryBuilderRef.current.initialState
  );

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
