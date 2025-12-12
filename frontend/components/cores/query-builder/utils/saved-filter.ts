import { v4 } from 'uuid';

import { SavedFilterType } from '@/api/api';

import { ISavedFilter } from '../../saved-filter';

import { getDefaultSyntheticSqon } from './sqon';

type NewSavedFilterFunctionProps = {
  defaultTitle?: string;
  type: SavedFilterType;
};

export function getNewSavedFilter({ defaultTitle = 'New Filter', type }: NewSavedFilterFunctionProps) {
  const newActiveQueryId = v4();
  const newSavedFilter: ISavedFilter = {
    id: v4(),
    queries: [getDefaultSyntheticSqon(newActiveQueryId)],
    type,
    name: defaultTitle,
    favorite: false,
    isDirty: false,
    isNew: true,
  };

  return {
    newActiveQueryId,
    newSavedFilter,
  };
}
