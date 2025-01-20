import { isEmpty } from "lodash";
import get from "lodash/get";
import qs from "query-string";
import {
  IFacetDictionary,
  IFilterGroup,
  TExtendedMapping,
  TFilterGroupDefaults,
  VisualType,
} from "../../composite/Filters/types";

import { isRangeAgg } from "./Range";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const getQueryParams = (search: string | null = null) =>
  search ? qs.parse(search) : qs.parse(window.location.search);

export const getFilterType = (fieldType: string): VisualType => {
  if (["long", "float", "double", "integer", "date"].includes(fieldType)) {
    return VisualType.Range;
  } else if (["boolean"].includes(fieldType)) {
    return VisualType.Toggle;
  }
  return VisualType.Checkbox;
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const updateQueryParam = (
  history: any,
  key: string,
  value: any
): void => {
  const query = getQueryParams();

  if (isEmpty(value) && !query[key]) {
    return;
  }
  if (isEmpty(value) && query[key]) {
    delete query[key];
  } else {
    query[key] = typeof value === "object" ? JSON.stringify(value) : value;
  }

  if (history) {
    history.push({
      search: `?${qs.stringify(query)}`,
    });
  } else {
    window.location.search = `?${qs.stringify(query)}`;
  }
};

interface IValues<T> {
  defaultValue: T;
  whiteList?: Array<T>;
}

export const readQueryParam = <T = "">(
  key: string,
  options: IValues<T>,
  search: any = null
): any => {
  const query = getQueryParams(search);
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return get<any, any, T>(query, key, options.defaultValue)!;
};

interface IQueryParams {
  [key: string]: string | any;
}

export const createQueryParams = (queryParams: IQueryParams): string => {
  const query: Record<string, string> = {};
  for (const queryKey in queryParams) {
    if (typeof queryParams[queryKey] === "object") {
      query[queryKey] = JSON.stringify(queryParams[queryKey]);
    } else {
      query[queryKey] = queryParams[queryKey] as string;
    }
  }

  return `?${qs.stringify(query)}`;
};

interface IGetFilterGroup {
  extendedMapping: TExtendedMapping | undefined;
  aggregation: any;
  rangeTypes: string[];
  filterFooter: boolean;
  headerTooltip?: boolean;
  dictionary?: IFacetDictionary;
  noDataInputOption?: boolean;
  intervalDecimal?: number;
  defaults?: TFilterGroupDefaults;
}

export const getFilterGroup = ({
  aggregation,
  defaults,
  dictionary,
  extendedMapping,
  filterFooter,
  headerTooltip,
  intervalDecimal,
  noDataInputOption = true,
  rangeTypes,
}: IGetFilterGroup): IFilterGroup => {
  if (isRangeAgg(aggregation)) {
    return {
      config: {
        defaultMax: defaults?.max,
        defaultMin: defaults?.min,
        defaultOperator: defaults?.operator,
        intervalDecimal,
        max: aggregation.stats.max,
        min: aggregation.stats.min,
        noDataInputOption: noDataInputOption,
        rangeTypes: rangeTypes.map((r) => ({
          key: r,
          name: r,
        })),
      },
      field: extendedMapping?.field || "",
      headerTooltip: headerTooltip
        ? get(
            dictionary,
            `tooltips.${extendedMapping?.field}`,
            extendedMapping?.displayName || ""
          )
        : undefined,
      title: get(
        dictionary,
        `${extendedMapping?.field}`,
        extendedMapping?.displayName || ""
      ),
      type: getFilterType(extendedMapping?.type || ""),
    };
  }

  return {
    config: {
      withFooter: filterFooter,
    },
    field: extendedMapping?.field || "",
    headerTooltip: headerTooltip
      ? get(
          dictionary,
          `tooltips.${extendedMapping?.field}`,
          extendedMapping?.displayName || ""
        )
      : undefined,
    title: get(
      dictionary,
      `${extendedMapping?.field}`,
      extendedMapping?.displayName || ""
    ),
    type: getFilterType(extendedMapping?.type || ""),
  };
};
