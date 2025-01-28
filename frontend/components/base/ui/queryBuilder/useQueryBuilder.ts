import { useState } from "react";
import {
  createQueryBuilder,
  QueryBuilderInstance,
  QueryBuilderProps,
} from "./core/query-builder";
import { PartialKeys } from "@/lib/utils";

export const useQueryBuilder = (
  props: PartialKeys<QueryBuilderProps, "state">
): QueryBuilderInstance => {
  const defaultProps: QueryBuilderProps = {
    state: {},
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
    onStateChange: (updater) => {
      setState(updater);
      props.onStateChange?.(updater);
    },
  }));

  return queryBuilderRef.current;
};
