import { useEffect, useState } from 'react';
import { useI18n } from '@/components/hooks/i18n';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/base/ui/command';
import FiltersGroupSkeleton from '@/components/base/filters-group/filters-group-skeleton';
import { ListFilter, Search } from 'lucide-react';
import FilterButton from '@/components/base/buttons/filter-button';
import { Aggregation, CaseFilters } from '@/api/api';
import useSWR from 'swr';
import { caseApi } from '@/utils/api';
import { Button } from '@/components/base/ui/button';
import { StringArrayRecord } from '@/components/hooks/usePersistedFilters';

type FiltersGroupFormProps = {
  loading?: boolean;
  filters: StringArrayRecord;
  setFilters: (filters: StringArrayRecord) => void;
};

async function fetchFilters() {
  const response = await caseApi.casesFilters();
  return response.data;
}

function FiltersGroupForm({
  loading = true,
  filters,
  setFilters,
}: FiltersGroupFormProps) {
  const [open, setOpen] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const { t } = useI18n();
  const [results, setResults] = useState<Aggregation[] | null>(null);
  const { data: apiFilters } = useSWR<CaseFilters, any>({}, fetchFilters, {
    revalidateOnFocus: false,
  });

  const priorityOptions = apiFilters?.priority || [];
  const statusOptions = apiFilters?.status || [];
  const caseAnalysisOptions = apiFilters?.case_analysis || [];
  const projectOptions = apiFilters?.project || [];
  const performerLabOptions = apiFilters?.performer_lab || [];
  const requestedByOptions = apiFilters?.requested_by || [];

  // Determine if any of the last three filters have a selection
  const projectSelected = filters.project.length > 0;
  const performerLabSelected = filters.performerLab.length > 0;
  const requestedBySelected = filters.requestedBy.length > 0;

  useEffect(() => {
    if (open) {
      setResults(priorityOptions);
    }
  }, [open, priorityOptions]);

  if (loading) return <FiltersGroupSkeleton />;

  return (
    <div className="py-0 flex flex-2 flex-wrap gap-2 items-button">
      <div className="flex flex-col">
        <label>{t('caseExploration.filtersGroup.searchById')}</label>
        <Command className="relative h-8 w-[260px] overflow-visible">
          <CommandInput
            className="px-[6px]"
            placeholder={t('caseExploration.filtersGroup.search_placeholder')}
            leftAddon={<Search size={16} />}
            onFocus={() => {
              setOpen(true);
            }}
            onBlur={() => setTimeout(() => setOpen(false), 100)}
          />
          {open && (
            <CommandList
              className="absolute left-0 top-full z-50 mt-1 w-full overflow-auto rounded-md border bg-background shadow-lg"
              onMouseDown={(e) => e.preventDefault()}
            >
              <CommandEmpty>{t('common.filters.noValuesFound')}</CommandEmpty>
              <CommandGroup heading="Suggestions">
                {results?.map((result) => (
                  <CommandItem key={result.key}>
                    <span>{result.label}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          )}
        </Command>
      </div>

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
        />
        {/* Conditionally show last three filters */}
        {(showMore || projectSelected) && (
          <FilterButton
            label={t('caseExploration.filtersGroup.project_code')}
            options={projectOptions}
            selected={filters.project}
            onSelect={(v) => setFilters({ ...filters, project: v })}
          />
        )}
        {(showMore || performerLabSelected) && (
          <FilterButton
            label={t('caseExploration.filtersGroup.performer_lab')}
            options={performerLabOptions}
            selected={filters.performerLab}
            onSelect={(v) => setFilters({ ...filters, performerLab: v })}
          />
        )}
        {(showMore || requestedBySelected) && (
          <FilterButton
            label={t('caseExploration.filtersGroup.requested_by')}
            options={requestedByOptions}
            selected={filters.requestedBy}
            onSelect={(v) => setFilters({ ...filters, requestedBy: v })}
          />
        )}
        {/* More button */}
        <Button
          variant="ghost"
          className="flex items-center gap-1 border-dashed"
          onClick={() => setShowMore((v) => !v)}
          aria-expanded={showMore}
        >
          <ListFilter size={16} />
          {showMore ? t('common.filters.less', 'Less') : t('common.filters.more', 'More')}
        </Button>
      </div>
    </div>
  );
}

export default FiltersGroupForm;
