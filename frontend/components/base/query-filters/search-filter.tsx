import { useState } from 'react';
import parse from 'html-react-parser';
import { InfoIcon } from 'lucide-react';

import { type Aggregation as AggregationConfig } from '@/components/cores/applications-config';
import { queryBuilderRemote } from '@/components/cores/query-builder/query-builder-remote';
import { MERGE_VALUES_STRATEGIES } from '@/components/cores/sqon';
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
  const { translation_key, type } = search;
  const [selectedValues, setSelectedValues] = useState<string[]>([]);

  const handleAsyncSearch = async (searchTerm: string): Promise<MultiSelectorOption[]> => {
    if (!searchTerm) return [];

    try {
      const response = await genesApi.geneAutoComplete(searchTerm);
      const options = response.data.map(item => ({
        value: item.source?.name || '',
        label: (
          <div className="flex flex-col gap-0.5">
            <span className="text-sm text-foreground">{parse(item.highlight?.name || item.source?.name || '')}</span>
            <span className="text-xs text-muted-foreground">{parse(item.highlight?.id || item.source?.id || '')}</span>
          </div>
        ),
        badgeLabel: item.source?.name || '',
      }));
      return options;
    } catch (error) {
      console.error('Error fetching genes:', error);
      return [];
    }
  };

  return (
    <div className="flex flex-col gap-2 ">
      <div className="flex items-center gap-2">
        <Label>{t(`common.filters.labels.${type}_${translation_key}`)}</Label>
        <Tooltip>
          <TooltipTrigger asChild>
            <InfoIcon size={16} />
          </TooltipTrigger>
          <TooltipContent>{t(`common.filters.labels.${type}_${translation_key}_tooltip`)}</TooltipContent>
        </Tooltip>
      </div>
      <MultiSelector
        value={selectedValues}
        onChange={newValues => {
          setSelectedValues(newValues);
          queryBuilderRemote.updateActiveQueryField(appId, {
            field: search.key,
            value: newValues,
            merge_strategy: MERGE_VALUES_STRATEGIES.OVERRIDE_VALUES,
          });
        }}
        onSearch={handleAsyncSearch}
        placeholder={t(`common.filters.labels.${type}_${translation_key}_placeholder`)}
        className="w-full"
        debounceDelay={300}
        maxSelected={100}
        // TODO: Customize empty indicator component
        emptyIndicator={<div className="text-center text-sm">No genes found</div>}
        hidePlaceholderWhenSelected
      />
    </div>
  );
}
