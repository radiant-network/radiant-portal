import { QueryBuilderInstance } from "@/components/model/query-builder-core";
import { createContext, useContext } from "react";

export type QueryBuilderContextType = {
  queryBuilder: QueryBuilderInstance;
};
export const QueryBuilderContext =
  createContext<QueryBuilderContextType | null>(null);

export const useQueryBuilderContext = () => {
  const context = useContext(QueryBuilderContext);
  if (!context) {
    throw new Error(
      "useQueryBuilderContext must be used within a QueryBuilderContextProvider"
    );
  }
  return context;
};
