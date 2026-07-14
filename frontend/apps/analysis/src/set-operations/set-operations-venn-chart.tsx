import { useCallback, useMemo, useState } from 'react';
import { Undo2 } from 'lucide-react';

import VennChart from '@/components/base/charts/venn-charts/venn-chart';
import MultiSelector from '@/components/base/data-entry/multi-selector/multi-selector';
import type { MultiSelectorOption } from '@/components/base/data-entry/multi-selector/multi-selector.types';
import AndOrIcon from '@/components/base/icons/and-or-icon';
import { Button } from '@/components/base/shadcn/button';
import { Label } from '@/components/base/shadcn/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/base/shadcn/select';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/base/shadcn/tooltip';
import { useI18n } from '@/components/hooks/i18n';

import { mockSets, UserSetOption } from './mocks/user-set';
import { germlineThreeSets, germlineTwoSets, somaticThreeSets } from './mocks/variant-sets';
import { SetSelectOption } from './set-operations-entity';

type SetOperationsVennChartProps = {
  userSets: UserSetOption[];
  defaultSetType: string;
  setDefaultSetType: (value: string) => void;
  defaultSelectedSets: string[];
  setDefaultSelectedSets: (value: string[]) => void;
  setTypesList: SetSelectOption[];
};

/**
 * @TODO: to remove when api is implemented
 */
function getMockData(setType: string, size: number) {
  if (setType == 'variants_germline') {
    if (size == 2) return germlineTwoSets;
    if (size == 3) return germlineThreeSets;
  }
  if (setType == 'variants_somatic') {
    if (size == 2) return germlineTwoSets;
    if (size == 3) return somaticThreeSets;
  }
  return {
    summary: [],
    operations: [],
  };
}

function SetOperationsVennChart({
  userSets,
  defaultSetType,
  setDefaultSetType,
  defaultSelectedSets,
  setDefaultSelectedSets,
  setTypesList,
}: SetOperationsVennChartProps) {
  const { t } = useI18n();

  const [setType, setSetType] = useState<string>(defaultSetType);
  const [selectedSets, setSelectedSets] = useState<string[]>(defaultSelectedSets);
  const [setOptions, setSetOptions] = useState<MultiSelectorOption[]>(
    userSets
      .filter(item => item.setType === defaultSetType)
      .map(item => ({
        value: item.id,
        label: item.tag,
      })),
  );

  // @TODO:  Mock a changing diagram
  const summary = useMemo(
    () => getMockData(defaultSetType, defaultSelectedSets.length)?.summary,
    [defaultSetType, defaultSelectedSets],
  );
  const operations = useMemo(
    () => getMockData(defaultSetType, defaultSelectedSets.length)?.operations,
    [defaultSetType, defaultSelectedSets],
  );

  const handleReset = () => {
    setSetType(defaultSetType);
    setSetOptions(
      userSets
        .filter(item => item.setType === defaultSetType)
        .map(item => ({
          value: item.id,
          label: item.tag,
        })),
    );
    setSelectedSets(defaultSelectedSets);
  };

  const handleCompare = () => {
    setDefaultSetType(setType);
    setDefaultSelectedSets(selectedSets);
  };

  const handleValueChange = useCallback(
    (value: string) => {
      setSetType(value);
      setSelectedSets([]);

      setSetOptions(
        userSets
          .filter(item => item.setType === value)
          .map(item => ({
            value: item.id,
            label: item.tag,
          })),
      );
    },
    [mockSets],
  );

  const compareDisabled = selectedSets.length < 2;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex-1">
        <div className="flex items-end gap-4">
          <div className="flex max-w-[300px] flex-1 flex-col gap-1">
            <Label htmlFor="set-operations-entity">{t('analysis.set_operations.filters.select_entity')}</Label>
            <Select value={setType} defaultValue={defaultSetType} onValueChange={handleValueChange}>
              <SelectTrigger id="set-operations-entity">
                <SelectValue placeholder={t('analysis.set_operations.filters.select_entity_placeholder')} />
              </SelectTrigger>
              <SelectContent>
                {setTypesList.map(({ value, icon: Icon, disabled }) => (
                  <SelectItem key={value} value={value} disabled={disabled}>
                    <span className="flex items-center gap-2">
                      <Icon size={16} className="text-muted-foreground" />
                      {t(`analysis.set_operations.entity_type.${value}`)}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex max-w-[900px] flex-1 flex-col gap-1">
            <Label>{t('analysis.set_operations.filters.select_set')}</Label>
            <MultiSelector
              value={selectedSets}
              onChange={setSelectedSets}
              defaultOptions={setOptions}
              options={setOptions}
              maxSelected={3}
              placeholder={t('analysis.set_operations.filters.select_set_placeholder')}
              disabled={setType === undefined}
              openOnFocus
            />
          </div>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                onClick={handleReset}
                iconOnly
                aria-label={t('analysis.set_operations.filters.reset')}
                disabled={
                  setType == defaultSetType &&
                  JSON.stringify(selectedSets.sort()) === JSON.stringify(defaultSelectedSets.sort())
                }
              >
                <Undo2 />
              </Button>
            </TooltipTrigger>
            <TooltipContent>{t('analysis.set_operations.filters.reset_tooltip')}</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <span>
                <Button onClick={handleCompare} disabled={compareDisabled}>
                  <AndOrIcon />
                  {t('analysis.set_operations.filters.compare')}
                </Button>
              </span>
            </TooltipTrigger>
            {compareDisabled && (
              <TooltipContent>{t('analysis.set_operations.filters.compare_disabled_tooltip')}</TooltipContent>
            )}
          </Tooltip>
        </div>
      </div>
      <VennChart summary={summary} operations={operations} />
    </div>
  );
}
export default SetOperationsVennChart;
