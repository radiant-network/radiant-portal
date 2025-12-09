import { SavedFilter } from '@/api/api';

export enum SavedFilterTypeEnum {
  Filter = 'filter',
  Query = 'query',
}

export interface ISavedFilter extends Omit<SavedFilter, 'created_on' | 'updated_on' | 'user_id'> {
  isDirty?: boolean;
  isNew?: boolean;
}

export interface IUserSavedFilter extends SavedFilter {}
