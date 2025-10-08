import { useEffect, useState } from 'react';

import { PartialKeys } from '@/components/lib/utils';

import { useI18n } from '../../hooks/i18n';
import { ISyntheticSqon } from '../sqon';

import { removeIgnoredFieldsFromQueryList } from './utils/sqon';
import {
  CoreQueryBuilderProps,
  createQueryBuilder,
  getDefaultQueryBuilderState,
  QueryBuilderInstance,
  QueryBuilderState,
} from './query-builder';
import {
  QUERY_BUILDER_UPDATE_EVENT_KEY,
  queryBuilderRemote,
  QueryBuilderRemoteEvent,
  QueryBuilderUpdateEventType,
} from './query-builder-remote';

/**
 * Initialize and register QueryBuilder.
 * - Fetch saved filters by type
 * - Create QueryBuilder state
 * - Set coreProps
 * - Map translations
 */
export function useQueryBuilder(props: PartialKeys<CoreQueryBuilderProps, 'state'>): QueryBuilderInstance {
  const { t } = useI18n();
  const defaultProps: CoreQueryBuilderProps = {
    state: {
      ...getDefaultQueryBuilderState(),
      savedFilters: [],
      selectedQueryIndexes: [],
    },
    // eslint-disable-next-line prettier/prettier
    onStateChange: () => { },
    ...props,
  };

  const [queryBuilderRef] = useState(() => ({
    current: createQueryBuilder(defaultProps),
  }));

  const [state, setState] = useState(() => defaultProps.initialState || defaultProps.state);

  /**
   * Fetch saved filters
   * Sync with local saved filters
   */

  useEffect(() => {
    if (state) {
      props.onStateChange?.(state);
    }
  }, [state]);

  useEffect(() => {
    const listener = (event: QueryBuilderRemoteEvent) => {
      if (event.queryBuilderId === props.id) {
        if (event.eventType === QueryBuilderUpdateEventType.ADD_QUERY) {
          const sqon = event.eventData as ISyntheticSqon;

          props.onQueryCreate?.(sqon);

          if (sqon.id === event.value.activeQueryId) {
            props.onActiveQueryChange?.(sqon);
          }
        } else if (event.eventType === QueryBuilderUpdateEventType.UPDATE_QUERY) {
          const sqon = event.eventData as ISyntheticSqon;

          props.onQueryUpdate?.(sqon);

          if (sqon.id === event.value.activeQueryId) {
            props.onActiveQueryChange?.(sqon);
          }
        }

        setState(prev => {
          const newState: QueryBuilderState = {
            ...prev,
            ...props.state,
            ...event.value,
          };

          return newState;
        });
      }
    };

    window.addEventListener(QUERY_BUILDER_UPDATE_EVENT_KEY, listener as EventListener);

    return () => {
      window.removeEventListener(QUERY_BUILDER_UPDATE_EVENT_KEY, listener as EventListener);
    };
  }, [props.state]);

  const mergedState: QueryBuilderState = {
    ...state,
    ...props.state,
  };

  queryBuilderRef.current.setCoreProps(prevProps => ({
    savedFilterDefaultTitle: t('common.saved_filter.untitled_filter'),
    ...prevProps,
    ...props,
    state: {
      ...mergedState,
      queries:
        props.fieldsToIgnore && mergedState.queries
          ? removeIgnoredFieldsFromQueryList(mergedState.queries, props.fieldsToIgnore)
          : mergedState.queries,
    },
    onStateChange: newState => {
      setState(newState);
      queryBuilderRemote.setLocalQueryBuilderState(props.id, {
        value: newState,
        skipEvent: true,
      });
    },
  }));

  return queryBuilderRef.current;
}
