import { useI18n } from '@/components/hooks/i18n';

import { useSavedFiltersContext } from './hooks/use-saved-filter';
import DeleteFilterButton from './delete-filter-button';
import DiscardFilterButton from './discard-filter-button';
import DuplicateFilterButton from './duplicate-filter-button';
import NewFilterButton from './new-filter-button';
import SaveFilterButton from './save-filter-button';
import SavedFiltersList from './saved-filters-list';
import UpdateFilterButton from './update-filter-button';

function QueryBuilderSavedFilters() {
  const { t } = useI18n();
  const { selectedSavedFilter } = useSavedFiltersContext();

  return (
    <>
      <div className="flex items-center gap-4 whitespace-nowrap text-ellipsis overflow-hidden py-4 pr-4">
        <div className="text-ellipsis overflow-hidden text-base">
          {selectedSavedFilter ? selectedSavedFilter.name : t('common.saved_filter.untitled_filter')}
        </div>
        <div className="flex items-center" onClick={e => e.stopPropagation()}>
          <div className="flex whitespace-nowrap">
            <UpdateFilterButton />
            <DiscardFilterButton />
          </div>
        </div>
      </div>
      <div className={'flex ml-auto py-4'}>
        <div className="flex gap-4 items-center" onClick={e => e.stopPropagation()}>
          <div className="flex whitespace-nowrap">
            <NewFilterButton />
            <SaveFilterButton />
            <DuplicateFilterButton />
            <DeleteFilterButton />
          </div>
          <SavedFiltersList />
        </div>
      </div>
    </>
  );
}

export default QueryBuilderSavedFilters;
