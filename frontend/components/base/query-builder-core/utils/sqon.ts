import { ISyntheticSqon } from "@/model/sqon";
import isEmpty from "lodash/isEmpty";

export const isEmptySqon = (
  sqon: ISyntheticSqon | Record<string, never>
): boolean => !Object.keys(sqon).length || isEmpty(sqon?.content);
