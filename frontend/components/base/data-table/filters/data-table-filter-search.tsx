import { useCallback, useEffect, useState } from 'react';
import { AxiosResponse, RawAxiosRequestConfig } from 'axios';
import { Barcode, FolderOpen, Search, User, X } from 'lucide-react';
import useSWR from 'swr';

import { AutocompleteResult } from '@/api/api';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/base/ui/command';
import { useI18n } from '@/components/hooks/i18n';

export type AutocompleteApiFn = (
  prefix: string,
  limit?: string,
  options?: RawAxiosRequestConfig,
) => Promise<AxiosResponse<AutocompleteResult[]>>;

export type TableFiltersSearchProps = {
  placeholder?: string;
  onSelect: (type: string, value: string) => void;
  onClear?: () => void;
  selectedValue?: string;
  minSearchLength?: number;
  api: AutocompleteApiFn;
};

export type GroupedAutocompleteResults = Record<string, AutocompleteResult[]>;

// Function to get icon for each result type
function getTypeIcon(type: string) {
  const iconMap: { [key: string]: any } = {
    case_id: FolderOpen,
    patient_id: User,
    organization_patient_id: Barcode,
  };
  return iconMap[type.toLowerCase()] || FolderOpen;
}

/**
 * Generate an autocomplete function based on the api's props
 */
async function onAutocomplete(prefix: string, minSearchLength: number, autocompleteApi: AutocompleteApiFn) {
  if (!prefix || prefix.length < minSearchLength) return {};

  const response = await autocompleteApi(prefix, '10');
  if (!response?.data || response.data.length === 0) return {};

  const grouped = response.data.reduce((acc, result) => {
    if (!acc[result.type]) {
      acc[result.type] = [];
    }
    acc[result.type].push(result);
    return acc;
  }, {} as GroupedAutocompleteResults);

  return grouped;
}

function TableFiltersSearch({
  onSelect,
  onClear,
  selectedValue,
  placeholder,
  minSearchLength = 3,
  api,
}: TableFiltersSearchProps) {
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
    debouncedSearchInput && debouncedSearchInput.length >= minSearchLength ? debouncedSearchInput : null,
    (key: string | null) => (key ? onAutocomplete(key, minSearchLength, api) : Promise.resolve({})),
    {
      revalidateOnFocus: false,
      dedupingInterval: 300,
    },
  );

  // Handle autocomplete item selection
  const handleAutocompleteSelect = useCallback(
    (type: string, value: string) => {
      const trimedValue = value.trim();
      onSelect(type, trimedValue);
      setSearchInput(trimedValue);
      setOpen(false);
    },
    [onSelect],
  );

  // Handle clearing the search input
  const handleClear = useCallback(() => {
    setSearchInput('');
    onClear?.();
  }, [onClear]);

  // Check if we have any results to display
  const hasResults = groupedResults && Object.keys(groupedResults).length > 0;

  return (
    <div className="flex flex-col">
      <label className="text-sm font-medium text-foreground h-[14px] mb-2">
        {t('case_exploration.filters_group.search_by_id')}
      </label>
      <Command className="relative h-8 w-[340px] overflow-visible" shouldFilter={false}>
        <CommandInput
          className="px-1.5"
          variant="search"
          placeholder={placeholder}
          leftAddon={<Search size={16} />}
          rightAddon={searchInput.length > 0 && <X onClick={handleClear} size={16} />}
          value={searchInput}
          onValueChange={setSearchInput}
          onFocus={() => {
            setOpen(true);
          }}
          onBlur={() => setTimeout(() => setOpen(false), 100)}
        />
        {open && searchInput.length > 0 && (
          <CommandList
            className="absolute max-h-[240px] left-0 top-full z-50 mt-1 w-full overflow-auto rounded-md border bg-background shadow-lg"
            onMouseDown={e => e.preventDefault()}
          >
            {!hasResults && <CommandEmpty>{t('common.table.filters.no_values_found')}</CommandEmpty>}
            {hasResults &&
              Object.keys(groupedResults || {}).map(category => (
                <>
                  {Object.keys(groupedResults || {}).indexOf(category) !== 0 && (
                    <hr className="w-full h-px bg-border" />
                  )}
                  <CommandGroup
                    key={category}
                    heading={
                      <span className="h-[28px] &:not(:first-child)]:bg-border">
                        {t(`common.table.filters.search.${category}`, category.toUpperCase())}
                      </span>
                    }
                  >
                    {(groupedResults?.[category] || []).map(result => {
                      const IconComponent = getTypeIcon(result.type);
                      return (
                        <CommandItem
                          className="h-[32px]"
                          key={result.value}
                          value={`${result.value}::${category}`}
                          onSelect={value => {
                            handleAutocompleteSelect(result.type, value.split('::')[0]);
                          }}
                        >
                          <IconComponent size={16} className="text-muted-foreground" />
                          <span>{result.value}</span>
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                </>
              ))}
          </CommandList>
        )}
      </Command>
    </div>
  );
}

export default TableFiltersSearch;
