import { PartialKeys } from "@/components/lib/utils";
import {
  CoreQueryBuilderProps,
  QueryBuilderInstance,
} from "@/components/model/query-builder-core";
import { ISyntheticSqon } from "@/components/model/sqon";
import { LucideProps } from "lucide-react";

export type ArrayTenOrMore<T> = {
  0: T;
  1: T;
  2: T;
  3: T;
  4: T;
  5: T;
  6: T;
  7: T;
  8: T;
  9: T;
  10: T;
} & Array<T>;

export const defaultQueryReferenceColors: ArrayTenOrMore<string> = [
  "#C31D7E",
  "#328536",
  "#AA00FF",
  "#C2410C",
  "#047ABE",
  "#E5231F",
  "#007D85",
  "#C51162",
  "#7B5A90",
  "#B85C00",
  "#722ED1",
  "#4D7C0F",
  "#9F1239",
  "#2D7D9A",
  "#847545",
];

type QueryBuilderSharedProps = {
  /**
   * Enable the combine feature
   */
  enableCombine?: boolean;
  /**
   * Enable the favorite feature
   */
  enableFavorite?: boolean;
  /**
   * Enable the show/hide labels feature
   */
  enableShowHideLabels?: boolean;
  /**
   * Icon to use for the query count
   */
  queryCountIcon?: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
  /**
   * Fetch the query count
   */
  fetchQueryCount: (sqon: ISyntheticSqon) => Promise<number>;
};

export type QueryBuilderProps = PartialKeys<CoreQueryBuilderProps, "state"> &
  QueryBuilderSharedProps & {
    className?: string;
    /**
     * Initial state of the show/hide labels feature
     */
    initialShowHideLabels?: boolean;
    /**
     * Colors to use for query reference
     */
    queryReferenceColors?: ArrayTenOrMore<string>;
  };

export type QueryBuilderContextType = QueryBuilderSharedProps & {
  queryBuilder: QueryBuilderInstance;
  showLabels?: boolean;
  toggleLabels?: (show: boolean) => void;
  getQueryReferenceColor: (refIndex: number) => string;
};
