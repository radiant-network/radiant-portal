export const ArrangerValues = {
  false: "0",
  missing: "__missing__",
  noData: "No Data",
  true: "1",
};

export const AggregateValues = {
  false: "false",
  true: "true",
};

export const keyEnhance = (
  key: string,
  s: string = ArrangerValues.noData
): string => {
  switch (key) {
    case ArrangerValues.missing:
      return s;
    default:
      return key;
  }
};

export const dotToUnderscore = (str: string): string =>
  str.replace(/\./g, "__");
export const underscoreToDot = (str: string): string => str.replace(/__/g, ".");
