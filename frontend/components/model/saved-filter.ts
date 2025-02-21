import { ISyntheticSqon } from "./sqon";

export enum SavedFilterTypeEnum {
  Filter = "filter",
  Query = "query",
}
export interface ISavedFilter {
  id: string;
  title: string;
  favorite: boolean;
  queries: ISyntheticSqon[];
  type?: string;
  isDirty?: boolean;
  isNew?: boolean;
}

export interface IUserSavedFilter extends ISavedFilter {
  keycloak_id: string;
  tag: string;
  creation_date: string;
  updated_date: string;
}
