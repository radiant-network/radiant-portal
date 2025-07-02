import { useEffect, useState, useCallback } from 'react';
import { useI18n } from '@/components/hooks/i18n';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/base/ui/command';
import { Search, FolderOpen, User, Barcode, TestTubeDiagonal, X } from 'lucide-react';
import { AutocompleteResult } from '@/api/api';
import useSWR from 'swr';
import { caseApi } from '@/utils/api';

type TableFiltersSearchProps = {
  onSelect: (type: string, value: string) => void;
  onClear?: () => void;
  selectedValue?: string;
};

type GroupedAutocompleteResults = Record<string, AutocompleteResult[]>;

const MIN_SEARCH_LENGTH = 1;

// Function to get icon for each result type
function getTypeIcon(type: string) {
  const iconMap: { [key: string]: any } = {
    'case_id': FolderOpen,
    'patient_id': User,
    'mrn': Barcode,
    'request_id': TestTubeDiagonal,
  };
  return iconMap[type.toLowerCase()] || FolderOpen;
}

async function fetchAutocompleteCases(prefix: string) {
  if (!prefix || prefix.length < MIN_SEARCH_LENGTH) {
    return {};
  }
  const response = await caseApi.autocompleteCases(prefix, '10');
  if (response?.data && response.data.length > 0) {
    const grouped = response.data.reduce((acc, result) => {
      if (!acc[result.type]) {
        acc[result.type] = [];
      }
      acc[result.type].push(result);
      return acc;
    }, {} as GroupedAutocompleteResults);
    return grouped; // Add explicit return
  }

  return {}; //
}

function TableFiltersSearch({ onSelect, onClear, selectedValue }: TableFiltersSearchProps) {
  const { t } = useI18n();
  const [searchInput, setSearchInput] = useState<string>('');
  const [debouncedSearchInput, setDebouncedSearchInput] = useState<string>('');
  const [open, setOpen] = useState(false);

  // Sync search input with selected value from parent
  useEffect(() => {
    setSearchInput(selectedValue || '');
  }, [selectedValue]);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchInput(searchInput);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const { data: groupedResults } = useSWR<GroupedAutocompleteResults, any, string | null>(
    debouncedSearchInput && debouncedSearchInput.length >= MIN_SEARCH_LENGTH ? debouncedSearchInput : null,
    (key: string | null) => key ? fetchAutocompleteCases(key) : Promise.resolve({}),
    {
      revalidateOnFocus: false,
      dedupingInterval: 300,
    }
  );

  // Handle autocomplete item selection
  const handleAutocompleteSelect = useCallback((type: string, value: string) => {
    onSelect(type, value);
    setSearchInput(value);
    setOpen(false);
  }, [onSelect]);

  // Handle clearing the search input
  const handleClear = useCallback(() => {
    setSearchInput('');
    onClear?.();
  }, [onClear]);

  // Check if we have any results to display
  const hasResults = groupedResults && Object.keys(groupedResults).length > 0;

  return (
    <div className="flex flex-col">
      <label className="text-sm font-medium text-foreground h-[14px] mb-[8px]">
        {t('caseExploration.filtersGroup.searchById')}
      </label>
      <Command
        className="relative h-8 w-[260px] overflow-visible"
        shouldFilter={false}
      >
        <CommandInput
          className="px-[6px]"
          placeholder={t('caseExploration.filtersGroup.search_placeholder')}
          leftAddon={<Search size={16} />}
          rightAddon={searchInput.length > 0 && <X onClick={handleClear} size={16} />}
          value={searchInput}
          onValueChange={setSearchInput}
          onFocus={() => {
            setOpen(true);
          }}
          onBlur={() => setTimeout(() => setOpen(false), 100)}
        />
        {open && (
          <CommandList
            className="absolute max-h-[240px] left-0 top-full z-50 mt-1 w-full overflow-auto rounded-md border bg-background shadow-lg"
            onMouseDown={(e) => e.preventDefault()}
          >
            {!hasResults && <CommandEmpty>{t('common.filters.noValuesFound')}</CommandEmpty>}
            {hasResults && Object.keys(groupedResults || {}).map((category) => (
              <>
                {
                  Object.keys(groupedResults || {}).indexOf(category) !== 0 && (
                    <hr className="w-full h-px bg-border" />
                  )
                }
                < CommandGroup
                  key={category}
                  heading={
                    <span className="h-[28px] &:not(:first-child)]:bg-border">{t(`caseExploration.case.search.${category}`, category.toUpperCase())}</span>
                  }
                >
                  {(groupedResults?.[category] || []).map((result) => {
                    const IconComponent = getTypeIcon(result.type);
                    return (
                      <CommandItem
                        className="h-[32px]"
                        key={result.value}
                        onSelect={(value) => {
                          handleAutocompleteSelect(result.type, value);
                        }}
                      >
                        <IconComponent size={16} className="text-muted-foreground" />
                        <span>{result.value}</span>
                      </CommandItem>
                    );
                  })}
                </CommandGroup></>
            ))}
          </CommandList>
        )
        }
      </Command >
    </div >
  );
}

export default TableFiltersSearch;
