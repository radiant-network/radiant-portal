import { useEffect, useState, useCallback } from 'react';
import { useI18n } from '@/components/hooks/i18n';
import FiltersGroupSkeleton from '@/components/base/filters-group/filters-group-skeleton';
import { FileQuestion, CircleDashed, Pen, Hourglass, RefreshCcw, Check, OctagonX, ListFilter, X } from 'lucide-react';
import FilterButton from '@/components/base/buttons/filter-button';
import { AggregationWithIcon } from '@/components/base/buttons/filter-button';
import { Aggregation, CaseFilters, SearchCriterion } from '@/api/api';
import useSWR from 'swr';
import { caseApi } from '@/utils/api';
import { StringArrayRecord } from '@/components/hooks/usePersistedFilters';
import { Button } from '@/components/base/ui/button';
import TableFiltersSearch from './table-filters-search';

type CaseFiltersInput = {
  search_criteria: Array<SearchCriterion>;
};


type FiltersGroupFormProps = {
  loading?: boolean;
  filters: StringArrayRecord;
  setFilters: (filters: StringArrayRecord) => void;
  searchCriteria: SearchCriterion[];
};

// Status icon mapping function
function getStatusIcon(statusKey: string) {
  const iconMap: { [key: string]: any } = {
    'draft': Pen,
    'on-hold': Hourglass, // on-hold key == . submitted
    'active': RefreshCcw, // active key == . in_progress
    'completed': Check,
    'incomplete': CircleDashed,
    'revoke': OctagonX,
  };
  return iconMap[statusKey.toLowerCase()] || FileQuestion;
}

async function fetchFilters(searchCriteria: CaseFiltersInput) {
  const response = await caseApi.casesFilters(searchCriteria);
  return response.data;
}

export const FILTER_DEFAULTS = {
  priority: [],
  status: [],
  caseAnalysis: [],
  project: [],
  performerLab: [],
  requestedBy: [],
};

export const FILTERS_SEARCH_DEFAULTS = {
  case_id: [],
  patient_id: [],
  mrn: [],
  request_id: [],
}

function FiltersGroupForm({
  loading = true,
  filters,
  setFilters,
  searchCriteria,
}: FiltersGroupFormProps) {
  const [visibleFilters, setVisibleFilters] = useState<string[]>([]);
  const { t } = useI18n();

  // Generic function to add icons and translations to options
  const addIconsAndTranslations = (
    options: Aggregation[],
    translationKeyPrefix: string,
    iconMapFunction: (key: string) => any
  ): AggregationWithIcon[] => {
    return options.map(option => ({
      ...option,
      label: t(`${translationKeyPrefix}.${option.key}`, option.label || ''),
      icon: iconMapFunction(option.key || ''),
    }));
  };

  const { data: apiFilters } = useSWR<CaseFilters, any, CaseFiltersInput>({ search_criteria: searchCriteria }, fetchFilters, {
    revalidateOnFocus: false,
  });

  const priorityOptions = apiFilters?.priority || [];
  const statusOptions = addIconsAndTranslations(apiFilters?.status || [], 'caseExploration.status', getStatusIcon);
  const caseAnalysisOptions = apiFilters?.case_analysis || [];
  const projectOptions = apiFilters?.project || [];
  const performerLabOptions = apiFilters?.performer_lab || [];
  const requestedByOptions = apiFilters?.requested_by || [];

  // Determine if any of the last three filters have a selection
  const projectSelected = filters.project.length > 0;
  const performerLabSelected = filters.performerLab.length > 0;
  const requestedBySelected = filters.requestedBy.length > 0;

  // Options for the additional filters control
  const additionalFilterOptions: AggregationWithIcon[] = [
    {
      key: 'project',
      label: t('caseExploration.filtersGroup.project_code'),
      count: projectOptions.length,
    },
    {
      key: 'performerLab',
      label: t('caseExploration.filtersGroup.performer_lab'),
      count: performerLabOptions.length,
    },
    {
      key: 'requestedBy',
      label: t('caseExploration.filtersGroup.requested_by'),
      count: requestedByOptions.length,
    },
  ];

  // Auto-show filters that have selections
  useEffect(() => {
    const autoShowFilters: string[] = [];
    if (projectSelected) autoShowFilters.push('project');
    if (performerLabSelected) autoShowFilters.push('performerLab');
    if (requestedBySelected) autoShowFilters.push('requestedBy');

    setVisibleFilters((current: string[]) => {
      const combined = [...new Set([...current, ...autoShowFilters])];
      return combined;
    });
  }, [projectSelected, performerLabSelected, requestedBySelected]);

  // Handle autocomplete item selection - only one search term allowed at a time
  const handleAutocompleteSelect = useCallback((type: string, value: string) => {
    // Clear all existing search terms first
    const clearedFilters = {
      ...filters,
      ...FILTERS_SEARCH_DEFAULTS,
    };

    // Set the new search term
    setFilters({
      ...clearedFilters,
      [type]: [value],
    });
  }, [filters, setFilters]);

  // Handle clearing the search input
  const handleSearchClear = useCallback(() => {
    setFilters({
      ...filters,
      ...FILTERS_SEARCH_DEFAULTS,
    });
  }, [filters, setFilters]);

  // Get the current search term for display (only one allowed)
  const getSearchTerm = () => {
    const searchTypes = ['case_id', 'patient_id', 'mrn', 'assay_id'];

    for (const type of searchTypes) {
      const values = filters[type] || [];
      if (values.length > 0) {
        return {
          type,
          value: values[0], // Only take the first value since we only allow one
          label: t(`caseExploration.case.headers.${type}`, type.toUpperCase()) + ': ' + values[0]
        };
      }
    }

    return null;
  };

  // Check if any filters are active
  const hasActiveFilters =
    filters.priority.length > 0 ||
    filters.status.length > 0 ||
    filters.caseAnalysis.length > 0 ||
    filters.project.length > 0 ||
    filters.performerLab.length > 0 ||
    filters.requestedBy.length > 0 ||
    getSearchTerm() !== null ||
    visibleFilters.length > 0;

  // Clear all filters function
  const clearAllFilters = () => {
    setFilters({
      ...FILTER_DEFAULTS,
      ...FILTERS_SEARCH_DEFAULTS,
    });
    setVisibleFilters([]);
  };

  if (loading) return <FiltersGroupSkeleton />;

  const searchTerm = getSearchTerm();

  return (
    <div id="table-filters" className="py-0 flex flex-2 flex-wrap gap-2 items-button">
      <TableFiltersSearch
        onSelect={handleAutocompleteSelect}
        onClear={handleSearchClear}
        selectedValue={searchTerm?.value}
      />

      <div className="flex flex-wrap gap-2 items-end">
        {/* Always show first three filters */}
        <FilterButton
          label={t('caseExploration.filtersGroup.priority_code')}
          options={priorityOptions}
          selected={filters.priority}
          onSelect={(v) => setFilters({ ...filters, priority: v })}
        />
        <FilterButton
          label={t('caseExploration.filtersGroup.status_code')}
          options={statusOptions}
          selected={filters.status}
          onSelect={(v) => setFilters({ ...filters, status: v })}
        />
        <FilterButton
          label={t('caseExploration.filtersGroup.case_analysis_code')}
          options={caseAnalysisOptions}
          selected={filters.caseAnalysis}
          onSelect={(v) => setFilters({ ...filters, caseAnalysis: v })}
          keyValueLabel={true}
        />

        {/* Conditionally show additional filters based on visibility selection */}
        {visibleFilters.includes('project') && (
          <FilterButton
            label={t('caseExploration.filtersGroup.project_code')}
            options={projectOptions}
            selected={filters.project}
            onSelect={(v) => setFilters({ ...filters, project: v })}
          />
        )}
        {visibleFilters.includes('performerLab') && (
          <FilterButton
            label={t('caseExploration.filtersGroup.performer_lab')}
            options={performerLabOptions}
            selected={filters.performerLab}
            onSelect={(v) => setFilters({ ...filters, performerLab: v })}
          />
        )}
        {visibleFilters.includes('requestedBy') && (
          <FilterButton
            label={t('caseExploration.filtersGroup.requested_by')}
            options={requestedByOptions}
            selected={filters.requestedBy}
            onSelect={(v) => setFilters({ ...filters, requestedBy: v })}
          />
        )}

        {/* Additional filters control button - always visible */}
        <FilterButton
          label={t('common.filters.more', 'More')}
          options={additionalFilterOptions}
          selected={visibleFilters}
          onSelect={setVisibleFilters}
          actionMode={true}
          icon={<ListFilter size={16} />}
        />

        {/* Clear button - only show if filters are active */}
        {hasActiveFilters && (
          <Button
            variant="link"
            onClick={clearAllFilters}
            className="text-sm py-2 px-3 h-8"
          >
            <X size={14} />
            {t('common.actions.clear', 'Clear')}
          </Button>
        )}
      </div>
    </div>
  );
}

export default FiltersGroupForm;
