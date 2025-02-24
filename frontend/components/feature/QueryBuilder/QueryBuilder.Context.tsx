import { createContext, useContext } from "react";
import { QueryBuilderContextType, QueryBuilderDictionnary } from "./types";

export const QueryBuilderContext =
  createContext<QueryBuilderContextType | null>(null);

export function useQueryBuilderContext() {
  const context = useContext(QueryBuilderContext);
  if (!context) {
    throw new Error(
      "useQueryBuilderContext must be used within a QueryBuilderContextProvider"
    );
  }
  return context;
}

export const QueryBuilderDictContext =
  createContext<QueryBuilderDictionnary | null>(null);

export function useQueryBuilderDictContext() {
  const context = useContext(QueryBuilderDictContext);
  if (!context) {
    throw new Error(
      "useQueryBuilderDictContext must be used within a QueryBuilderDictContextProvider"
    );
  }
  return context;
}
