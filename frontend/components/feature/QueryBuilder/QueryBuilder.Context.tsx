import { QueryBuilderInstance } from "@/components/model/query-builder-core";
import { LucideProps } from "lucide-react";
import { createContext, useContext } from "react";

export type QueryBuilderContextType = {
  queryBuilder: QueryBuilderInstance;
  enableCombine?: boolean;
  enableFavorite?: boolean;
  enableShowHideLabels?: boolean;
  showLabels?: boolean;
  toggleLabels?: (show: boolean) => void;
  queryCountIcon?: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
  getQueryReferenceColor: (refIndex: number) => string;
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
