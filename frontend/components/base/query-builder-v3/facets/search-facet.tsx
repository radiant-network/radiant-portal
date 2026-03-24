import { useEffect, useState } from 'react';
import parse from 'html-react-parser';
import { InfoIcon } from 'lucide-react';

import { SqonOpEnum } from '@/api/index';
import MultiSelector from '@/components/base/data-entry/multi-selector/multi-selector';
import { MultiSelectorOption } from '@/components/base/data-entry/multi-selector/multi-selector.types';
import { Label } from '@/components/base/shadcn/label';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/base/shadcn/tooltip';
import { type Aggregation as AggregationConfig } from '@/components/cores/applications-config';
import { useI18n } from '@/components/hooks/i18n';
import { genesApi } from '@/utils/api';

import { QBActionType, useQBActiveQuery, useQBDispatch, useQBHistory } from '../hooks/use-query-builder';
import { IValueContent, IValueFacet } from '../type';

interface SearchFilterProps {
  search: AggregationConfig;
}

const MAX_API_CALLS = 2;

export function SearchFacet({ search }: SearchFilterProps) {
  const { t } = useI18n();
  const dispatch = useQBDispatch();
  const activeQuery = useQBActiveQuery();
  const history = useQBHistory();
  const { translation_key, key } = search;
  const fieldKey = key.replace(/search_by_/g, '');

  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<MultiSelectorOption[]>([]);

  // Load initial values from query builder and sync when pills are removed
  useEffect(() => {
    const fieldFilter = activeQuery.content.find(
      (x: any) =>
        typeof x === 'object' &&
        x !== null &&
        'content' in x &&
        'field' in (x.content as IValueFacet) &&
        (x.content as IValueContent).field === fieldKey,
    ) as IValueFacet | undefined;

    const initialValues = fieldFilter?.content?.value || [];
    if (Array.isArray(initialValues)) {
      setSelectedValues(initialValues as string[]);
    } else {
      setSelectedValues([]);
    }
  }, [fieldKey, activeQuery]);

  // Sync when history changes (when pills are removed)
  useEffect(() => {
    if (history.target === fieldKey) {
      const fieldFilter = activeQuery.content.find(
        (x: any) =>
          typeof x === 'object' &&
          x !== null &&
          'content' in x &&
          'field' in (x.content as IValueFacet) &&
          (x.content as IValueContent).field === fieldKey,
      ) as IValueFacet | undefined;

      const values = fieldFilter?.content?.value || [];
      if (Array.isArray(values)) {
        setSelectedValues(values as string[]);
      } else {
        setSelectedValues([]);
      }
    }
  }, [history.uuid, fieldKey, activeQuery]);

  useEffect(() => {
    // Create options for selected values (for multi selector badges)
    const fetchGeneDetails = async () => {
      if (selectedValues.length === 0) {
        setSelectedOptions([]);
        return;
      }

      // An user can only fill search by with one value, so this should not affect normal usage.
      // But when we add values from upload ID dialog we can have a lot of values at once
      // which would trigger a lot of API calls not needed in this case, so we skip it.
      if (selectedValues.length > MAX_API_CALLS) {
        const fallbackOptions = selectedValues.map(value => ({
          value,
          label: value,
          badgeLabel: value,
        }));
        setSelectedOptions(fallbackOptions);
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
    dispatch({
      type: QBActionType.ADD_OR_UPDATE_FACET_PILL,
      payload: {
        content: {
          field: fieldKey,
          value: newValues,
        },
        op: SqonOpEnum.In,
      },
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
