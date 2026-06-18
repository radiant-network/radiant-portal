import { useCallback } from 'react';

import { SqonOpEnum } from '@/api/api';
import InputSearch from '@/components/base/data-entry/input-search';
import { QBActionType, useQBDispatch } from '@/components/base/query-builder/hooks/use-query-builder';
import { useI18n } from '@/components/hooks/i18n';

import { STUDY_SEARCH_FIELD } from './mocks/study-fetcher-mock';

/**
 * Injects the term into the active sqon as a `search_text` pill
 * TODO(back): the real endpoint will expose a dedicated search_by criterion.
 */
export default function StudySearch() {
  const { t } = useI18n();
  const dispatch = useQBDispatch();

  const handleSearch = useCallback(
    (value: string) => {
      const term = value.trim();
      if (!term) {
        dispatch({
          type: QBActionType.REMOVE_FACET_PILL,
          payload: { content: { field: STUDY_SEARCH_FIELD, value: [] }, op: SqonOpEnum.In },
        });
        return;
      }
      dispatch({
        type: QBActionType.ADD_OR_UPDATE_FACET_PILL,
        payload: { content: { field: STUDY_SEARCH_FIELD, value: [term] }, op: SqonOpEnum.In },
      });
    },
    [dispatch],
  );

  return (
    <div className="space-y-1">
      <label className="text-muted-foreground text-sm">{t('study.search.label')}</label>
      <InputSearch placeholder={t('study.search.placeholder')} onSearch={handleSearch} wrapperClassName="w-full" />
    </div>
  );
}
