import isEqual from 'lodash/isEqual';
import { v4 } from 'uuid';

import { Sqon } from '@/api/api';

import { ISavedFilter, SavedFilterTypeEnum } from '../saved-filter';
import { ISyntheticSqon, sanitizeSqonContent } from '../sqon';

import { getNewSavedFilter } from './utils/saved-filter';
import { formatQueriesWithPill } from './utils/sqon';
import { createQuery, QueryInstance } from './query';
import { QueryBuilderInstance } from './query-builder';

export type CoreSavedFilter = {
  /**
   * Id of the SavedFilter
   */
  id: any;

  /**
   * Call this function to get the SavedFilter's raw data
   */
  raw(): ISavedFilter;

  /**
   * Call this function to get the SavedFilter's queries
   */
  getQueries(): QueryInstance[];

  /**
   * Call this function to get the SavedFilter's raw queries (ISyntheticSqon[])
   */
  getRawQueries(): ISyntheticSqon[];

  /**
   * Call this function to get a Query by id
   */
  getQueryById(id: string): QueryInstance | null;

  /**
   * Call this function to check if the SavedFilter has queries
   */
  hasQueries(): boolean;

  /**
   * Call this function to delete the SavedFilter
   */
  delete(): void | Promise<void>;

  /**
   * Call this function to copy the SavedFilter
   * This will only return a new SavedFilter object without calling any side effects
   */
  copy(): ISavedFilter;

  /**
   * Call this function to duplicate the SavedFilter
   * This will update the queryBuilder state with a new SavedFilter
   * and will perform any side effects defined in the queryBuilder coreProps
   */
  duplicate(): void;

  /**
   * Call this function to save (update) the SavedFilter
   */
  save(
    type: SavedFilterTypeEnum,
    params?: {
      name?: string;
      favorite?: boolean;
    },
  ): Promise<void>;

  /**
   * Call this function to discard the changes made to the SavedFilter
   */
  discardChanges(): void;

  /**
   * Call this function to select the SavedFilter
   */
  select(): void;

  /**
   * Call this function to check if the SavedFilter is a favorite
   */
  isFavorite(): boolean;

  /**
   * Call this function to check if the SavedFilter is new meaning it has never been saved.
   */
  isNew(): boolean;

  /**
   * Call this function to check if the SavedFilter is dirty meaning it has been modified.
   */
  isDirty(): boolean;

  /**
   * Call this function to check if the SavedFilter is currently selected
   */
  isSelected(): boolean;
};

export type SavedFilterInstance = CoreSavedFilter;

export const createSavedFilter = (
  rawSavedFilter: ISavedFilter,
  queryBuilder: QueryBuilderInstance,
): SavedFilterInstance => {
  const _savedFilter: SavedFilterInstance = {} as SavedFilterInstance;
  const savedFilterId = rawSavedFilter.id;

  const coreInstance: CoreSavedFilter = {
    id: savedFilterId,
    raw: () => rawSavedFilter,
    getQueries: () => {
      if (rawSavedFilter.queries && rawSavedFilter.queries.length > 0) {
        return rawSavedFilter.queries.map(query => createQuery(query as ISyntheticSqon, queryBuilder));
      }

      return [];
    },
    getRawQueries: () => rawSavedFilter.queries as ISyntheticSqon[],
    getQueryById: id => _savedFilter.getQueries().find(query => query.id === id) || null,
    copy: () => {
      const copiedQueries: ISyntheticSqon[] = _savedFilter.getRawQueries().map(query => ({
        ...query,
        id: v4(),
      }));

      const existingSavedFilters = queryBuilder.getSavedFilters().filter(filter => !filter.isNew());
      const existingNames = existingSavedFilters.filter(filter => filter.raw().name.includes(rawSavedFilter.name));
      const copiedName = `${rawSavedFilter.name} COPY${existingNames.length > 1 ? ` ${existingNames.length - 1}` : ''}`;

      const copiedSavedFilter: ISavedFilter = {
        favorite: false,
        id: v4() as any,
        queries: copiedQueries as Sqon[],
        name: copiedName,
        isDirty: false,
        isNew: true,
        type: queryBuilder.coreProps.savedFilterType,
      };

      return copiedSavedFilter;
    },
    duplicate: () => {
      if (_savedFilter.isSelected()) {
        const copiedSavedFilter = _savedFilter.copy();

        queryBuilder.setState(prev => ({
          ...prev,
          activeQueryId: copiedSavedFilter.queries[0].id!,
          queries: copiedSavedFilter.queries,
          savedFilters: [...prev.savedFilters, copiedSavedFilter],
        }));

        queryBuilder.coreProps.onSavedFilterCreate?.(copiedSavedFilter);
      } else {
        console.error('Can only duplicate the selected saved filter');
      }
    },
    delete: async () =>
      Promise.resolve(queryBuilder.coreProps.onSavedFilterDelete?.(savedFilterId)).then(() => {
        const { newActiveQueryId, newSavedFilter } = getNewSavedFilter({
          type: queryBuilder.coreProps.savedFilterType,
          defaultTitle: queryBuilder.coreProps.savedFilterDefaultTitle,
        });

        queryBuilder.setState(prev => ({
          ...prev,
          activeQueryId: newActiveQueryId,
          queries: newSavedFilter.queries,
          savedFilters: [...prev.savedFilters.filter(filter => filter.id !== savedFilterId), newSavedFilter],
        }));

        queryBuilder.coreProps.onActiveQueryChange?.(newSavedFilter.queries[0] as ISyntheticSqon);
        queryBuilder.coreProps.onSavedFilterCreate?.(newSavedFilter);
      }),
    save: async (type, params) => {
      const savedFilterToSave: ISavedFilter = {
        ..._savedFilter.raw(),
        name: params?.name || _savedFilter.raw().name,
        favorite: params?.favorite !== undefined ? params.favorite : _savedFilter.raw().favorite,
        queries: queryBuilder.getRawQueries() as Sqon[],
      };

      const asCustomPill = type === SavedFilterTypeEnum.Query;

      if (asCustomPill) {
        return Promise.resolve(queryBuilder.coreProps.onCustomPillUpdate?.(savedFilterToSave)).then(() => {});
      }

      return Promise.resolve(
        queryBuilder.coreProps.onSavedFilterUpdate?.({
          ...savedFilterToSave,
          queries: formatQueriesWithPill(savedFilterToSave.queries as ISyntheticSqon[]) as Sqon[],
        }),
      ).then(newSavedFilter => {
        if (!newSavedFilter) return;

        queryBuilder.setState(prev => ({
          ...prev,
          savedFilters: prev.savedFilters.map(filter => {
            if (filter.id === newSavedFilter.id) {
              return {
                ...newSavedFilter,
                isNew: false,
                isDirty: false,
              };
            }
            return filter;
          }),
        }));
      });
    },
    select: () => {
      queryBuilder.setState(prev => ({
        ...prev,
        activeQueryId: rawSavedFilter.queries[0].id,
        queries: rawSavedFilter.queries,
      }));
    },
    discardChanges: () => {
      if (_savedFilter.isSelected()) {
        queryBuilder.setState(prev => ({
          ...prev,
          activeQueryId: rawSavedFilter.queries[0].id,
          queries: rawSavedFilter.queries,
        }));
      } else {
        console.error('Can only discard changes to the selected saved filter');
      }
    },
    hasQueries: () => _savedFilter.getQueries().length > 0,
    isSelected: () => {
      const currentQueryIds = queryBuilder.getState().queries.map(q => q.id);
      /**
       * Compare against queryBuilder queries to ensure that the saved filter is selected
       */
      return rawSavedFilter.queries.find(query => currentQueryIds.includes(query.id)) !== undefined;
    },
    isFavorite: () => rawSavedFilter.favorite || false,
    isNew: () => rawSavedFilter.isNew || false,
    isDirty: () => {
      if (!_savedFilter.isSelected() || rawSavedFilter.isNew) {
        return false;
      }

      if (rawSavedFilter.isDirty) {
        return true;
      }

      /**
       * Deliberately compare queryBuilder raw queries with rawSavedFilter queries
       * Since queryBuilder raw queries are always up to date and rawSavedFilter queries
       * update only when the saved filter is saved.
       */
      if (queryBuilder.getRawQueries().length !== rawSavedFilter.queries.length) {
        return true;
      }

      return !rawSavedFilter.queries.every(savedFilterQuery => {
        const foundQuery = queryBuilder.getRawQueries().find(query => query.id == savedFilterQuery.id);
        if (foundQuery) {
          return isEqual(
            { content: sanitizeSqonContent(foundQuery.content), id: foundQuery.id, op: foundQuery.op },
            { content: savedFilterQuery.content, id: savedFilterQuery.id, op: savedFilterQuery.op },
          );
        }

        return false;
      });
    },
  };

  Object.assign(_savedFilter, coreInstance);

  return _savedFilter;
};
