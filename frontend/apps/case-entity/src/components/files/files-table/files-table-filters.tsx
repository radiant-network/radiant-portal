import { useCallback, useEffect, useMemo, useState } from 'react';
import { ListFilter, X } from 'lucide-react';
import useSWR from 'swr';

import { DocumentFilters, SearchCriterion } from '@/api/api';
import FilterButton, { IFilterButton, PopoverSize } from '@/components/base/buttons/filter-button';
import { Button } from '@/components/base/ui/button';
import { useI18n } from '@/components/hooks/i18n';
import usePersistedFilters, { StringArrayRecord } from '@/components/hooks/usePersistedFilters';
import { documentApi } from '@/utils/api';

type FilesTableFilters = {
  setSearchCriteria: (searchCriteria: SearchCriterion[]) => void;
};

type DocumentFiltersInput = {
  search_criteria: Array<SearchCriterion>;
};
export const FILTER_DEFAULTS = {
  priority: [],
  status: [],
  case_analysis: [],
  project: [],
  performer_lab: [],
  requested_by: [],
};

export const FILTERS_SEARCH_DEFAULTS = {
  case_id: [],
  patient_id: [],
  mrn: [],
  request_id: [],
};

async function fetchFilters(searchCriteria: DocumentFiltersInput) {
  const response = await documentApi.documentsFilters(searchCriteria);
  return response.data;
}

function updateSearchCriteria(filters: StringArrayRecord) {
  const search_criteria: SearchCriterion[] = [];
  if (filters.data_type?.length > 0) {
    search_criteria.push({ field: 'data_type', value: filters.data_type });
  }
  if (filters.format?.length > 0) {
    search_criteria.push({ field: 'format', value: filters.format });
  }
  if (filters.performer_lab?.length > 0) {
    search_criteria.push({ field: 'performer_lab', value: filters.performer_lab });
  }
  if (filters.project?.length > 0) {
    search_criteria.push({ field: 'project_code', value: filters.project });
  }
  if (filters.relationship_to_proband?.length > 0) {
    search_criteria.push({ field: 'relationship_to_proband', value: filters.relationship_to_proband });
  }

  return search_criteria;
}

function FilesTableFilters({ setSearchCriteria }: FilesTableFilters) {
  const { t } = useI18n();
  const [changedFilterButtons, setChangedFilterButtons] = useState<string[]>([]);
  const [openFilters, setOpenFilters] = useState<Record<string, boolean>>({});
  const [filters, setFilters] = usePersistedFilters<StringArrayRecord>('case-exploration-filters', {
    ...FILTER_DEFAULTS,
    ...FILTERS_SEARCH_DEFAULTS,
  });

  const { data: apiFilters } = useSWR<DocumentFilters>(
    'document-filters',
    () => fetchFilters({ search_criteria: [] }),
    {
      revalidateOnFocus: false,
      revalidateOnMount: true,
      revalidateIfStale: false,
      revalidateOnReconnect: false,
    },
  );

  // Handle filter selection
  const handleFilterSelect = useCallback(
    (filterKey: string, selectedValues: string[]) => {
      setFilters({ ...filters, [filterKey]: selectedValues });
    },
    [filters, setFilters],
  );

  const filterButtons = useMemo(() => {
    if (!apiFilters) return [];

    return Object.keys(apiFilters)
      .map(key => {
        const baseOption: IFilterButton = {
          key,
          label: t(`case_exploration.case.filters.${key}`),
          isVisible: ['data_type', 'format', 'performer_lab'].includes(key), // Show first three by default
          isOpen: openFilters[key] || false,
          selectedItems: filters[key] || [],
          options: [],
        };

        switch (key) {
          case 'data_type':
          case 'format':
          case 'project':
          case 'performer_lab':
          case 'relationship_to_proband':
            return {
              ...baseOption,
              popoverSize: 'lg',
              withTooltip: true,
            };
          default:
            return baseOption;
        }
      })
      .filter(option => option.options.length > 0);
  }, [apiFilters, filters, changedFilterButtons, openFilters, t]);

  const hiddenFilterOptions = useMemo(() => filterButtons.filter(option => !option.isVisible), [filterButtons]);
  // Check if any filters are active
  const hasActiveFilters = filterButtons.some(option => option.selectedItems.length > 0);
  changedFilterButtons.length > 0;

  // Clear all filters function
  const clearAllFilters = () => {
    setFilters({
      ...FILTER_DEFAULTS,
      ...FILTERS_SEARCH_DEFAULTS,
    });
    setChangedFilterButtons([]);
    setOpenFilters({});
  };
  console.log('apiFilters', apiFilters);
  console.log('filterButtons', filterButtons);

  useEffect(() => {
    setSearchCriteria(updateSearchCriteria(filters));
  }, [filters, setSearchCriteria]);

  return (
    <div id="table-filters" className="py-0 flex flex-2 flex-wrap gap-2 items-button">
      <div className="flex flex-wrap gap-2 items-end">
        {/* Show visible filters */}
        {filterButtons.map(filter =>
          filter.isVisible === true ? (
            <FilterButton
              key={filter.key}
              popoverSize={filter.popoverSize as PopoverSize}
              label={filter.label}
              options={filter.options}
              selected={filter.selectedItems}
              onSelect={values => handleFilterSelect(filter.key, values)}
              isOpen={filter.isOpen}
              withTooltip={filter.withTooltip}
            />
          ) : null,
        )}

        {/* Additional filters control button - only show if there are hidden options */}
        {hiddenFilterOptions.length > 0 && (
          <FilterButton
            label={t('common.filters.more', 'More')}
            options={hiddenFilterOptions}
            selected={[]}
            onSelect={makeFiltersVisible}
            actionMode={true}
            icon={<ListFilter size={16} />}
            placeholder={t('case_exploration.filters_group.case.filters.more_placeholder', 'Filters')}
            closeOnSelect={true}
          />
        )}

        {/* Clear button - only show if filters are active */}
        {hasActiveFilters && (
          <Button variant="link" onClick={clearAllFilters} className="text-sm py-2 px-3 h-8">
            <X size={14} />
            {t('common.actions.clear', 'Clear')}
          </Button>
        )}
      </div>
    </div>
  );
}
export default FilesTableFilters;
