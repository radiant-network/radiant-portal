import { createContext, useContext } from "react";
import { QueryBuilderContextType } from "./types";

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
