import { useEffect, useState } from 'react';
import parse from 'html-react-parser';
import { InfoIcon } from 'lucide-react';

import { type Aggregation as AggregationConfig } from '@/components/cores/applications-config';
import { queryBuilderRemote } from '@/components/cores/query-builder/query-builder-remote';
import { IValueFilter, MERGE_VALUES_STRATEGIES, TSqonContentValue } from '@/components/cores/sqon';
import { useI18n } from '@/components/hooks/i18n';
import { genesApi } from '@/utils/api';

import MultiSelector from '../data-entry/multi-selector/multi-selector';
import { MultiSelectorOption } from '../data-entry/multi-selector/multi-selector.types';
import { Label } from '../shadcn/label';
import { Tooltip, TooltipContent, TooltipTrigger } from '../shadcn/tooltip';

import { useFilterConfig } from './filter-list';

interface SearchFilterProps {
  search: AggregationConfig;
}

export function SearchFilter({ search }: SearchFilterProps) {
  const { t } = useI18n();
  const { appId } = useFilterConfig();
  const { translation_key, key } = search;
  const fieldKey = key.replace(/search_by_/g, '');

  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<MultiSelectorOption[]>([]);
  const [lastActiveQuery, setLastActiveQuery] = useState<any>(null);

  // Load initial values from query builder
  // Listen to query builder changes
  useEffect(() => {
    const activeQuery = queryBuilderRemote.getResolvedActiveQuery(appId);
    if (JSON.stringify(activeQuery) === JSON.stringify(lastActiveQuery)) {
      return;
    }

    const fieldFilter = activeQuery.content.find((x: TSqonContentValue) =>
      'content' in x && 'field' in x.content ? x.content.field === fieldKey : false,
    ) as IValueFilter | undefined;

    const initialValues = fieldFilter?.content?.value || [];
    if (Array.isArray(initialValues)) {
      setSelectedValues(initialValues as string[]);
    }
    setLastActiveQuery(activeQuery);
  }, [appId, fieldKey, queryBuilderRemote.getActiveQuery(appId)]);

  useEffect(() => {
    // Create options for selected values (for multi selector badges)
    const fetchGeneDetails = async () => {
      if (selectedValues.length === 0) {
        setSelectedOptions([]);
        return;
      }

      try {
        // Fetch details for each selected gene
        const optionsPromises = selectedValues.map(async value => {
          try {
            const response = await genesApi.geneAutoComplete(value);
            const geneData = response.data.find(item => item.source?.name === value);

            if (geneData) {
              return {
                value,
                label: (
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm text-foreground">{geneData.source?.name || value}</span>
                    <span className="text-xs text-muted-foreground">{geneData.source?.id || ''}</span>
                  </div>
                ),
                badgeLabel: value,
              };
            }
          } catch (error) {
            console.error(`Error fetching gene ${value}:`, error);
          }

          // Fallback if fetch fails
          return {
            value,
            label: value,
            badgeLabel: value,
          };
        });

        const resolvedOptions = await Promise.all(optionsPromises);
        setSelectedOptions(resolvedOptions);
      } catch (error) {
        console.error('Error fetching gene details:', error);
        // Fallback to simple options
        const fallbackOptions = selectedValues.map(value => ({
          value,
          label: value,
          badgeLabel: value,
        }));
        setSelectedOptions(fallbackOptions);
      }
    };

    fetchGeneDetails();
  }, [selectedValues]);

  const handleAsyncSearch = async (searchTerm: string): Promise<MultiSelectorOption[]> => {
    if (!searchTerm) return [];

    try {
      const response = await genesApi.geneAutoComplete(searchTerm);
      return response.data.map(item => ({
        value: item.source?.name || '',
        label: (
          <div className="flex flex-col gap-0.5">
            <span className="text-sm text-foreground">{parse(item.highlight?.name || item.source?.name || '')}</span>
            <span className="text-xs text-muted-foreground">{parse(item.highlight?.id || item.source?.id || '')}</span>
          </div>
        ),
        badgeLabel: item.source?.name || '',
      }));
    } catch (error) {
      console.error('Error fetching genes:', error);
      return [];
    }
  };

  const handleChange = (newValues: string[]) => {
    setSelectedValues(newValues);
    queryBuilderRemote.updateActiveQueryField(appId, {
      field: fieldKey,
      value: newValues,
      merge_strategy: MERGE_VALUES_STRATEGIES.OVERRIDE_VALUES,
    });
  };

  return (
    <div className="flex flex-col gap-2 ">
      <div className="flex items-center gap-2">
        <Label>{t(`common.filters.labels.${translation_key}`)}</Label>
        <Tooltip>
          <TooltipTrigger asChild>
            <InfoIcon size={16} />
          </TooltipTrigger>
          <TooltipContent>{t(`common.filters.labels.${translation_key}_tooltip`)}</TooltipContent>
        </Tooltip>
      </div>
      <MultiSelector
        value={selectedValues}
        defaultOptions={selectedOptions}
        onChange={handleChange}
        onSearch={handleAsyncSearch}
        placeholder={t(`common.filters.labels.${translation_key}_placeholder`)}
        className="w-full"
        debounceDelay={300}
        maxSelected={100}
        hidePlaceholderWhenSelected
      />
    </div>
  );
}
