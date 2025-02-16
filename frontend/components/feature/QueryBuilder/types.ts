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
