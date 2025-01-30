import { useState } from "react";
import {
  CoreQueryBuilderProps,
  createQueryBuilder,
  getDefaultQueryBuilderState,
  QueryBuilderInstance,
  QueryBuilderProps,
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
