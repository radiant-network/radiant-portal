import { ISyntheticSqon } from "./sqon";

export interface ISavedFilter {
  id: string;
  title: string;
  favorite: boolean;
  queries: ISyntheticSqon[];
  type?: string;
}
