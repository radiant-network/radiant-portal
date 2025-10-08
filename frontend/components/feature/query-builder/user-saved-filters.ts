import { RawAxiosRequestConfig } from 'axios';

import { SavedFilter, SavedFilterType, Sqon } from '@/api/api';
import { ISavedFilter } from '@/components/model/saved-filter';
import { savedFiltersApi } from '@/utils/api';

export type SavedFiltersByUserIDAndTypeProps = {
  savedFilterType: SavedFilterType;
  options?: RawAxiosRequestConfig;
};

export async function getUserSavedFilters(input: SavedFiltersByUserIDAndTypeProps): Promise<SavedFilter[]> {
  return savedFiltersApi.getSavedFilters(input.savedFilterType, input.options).then(response => response.data);
}

export async function onUserSavedFilterSave(filter: ISavedFilter) {
  return savedFiltersApi
    .postSavedFilter({
      name: filter.name,
      queries: filter.queries as Sqon[],
      type: filter.type ?? '',
    })
    .then(response => response.data);
}

export async function onUserSavedFilterDelete(id: string) {
  return savedFiltersApi.deleteSavedFilter(id).then(() => ({
    savedFilterId: id,
  }));
}

export async function onUserSavedFilterUpdate(filter: ISavedFilter) {
  return savedFiltersApi
    .putSavedFilter(filter.id.toString(), {
      favorite: filter.favorite,
      name: filter.name,
      queries: filter.queries as Sqon[],
    })
    .then(response => response.data);
}

export default {
  onSavedFilterSave: onUserSavedFilterSave,
  onSavedFilterDelete: onUserSavedFilterDelete,
  onSavedFilterUpdate: onUserSavedFilterUpdate,
};
