import { Trans } from 'react-i18next';

import MultiSelector from '@/components/base/data-entry/multi-selector/multi-selector';
import { MultiSelectorOption } from '@/components/base/data-entry/multi-selector/multi-selector.types';
import AndOrIcon from '@/components/base/icons/and-or-icon';
import AnchorLink from '@/components/base/navigation/anchor-link';
import { Button } from '@/components/base/shadcn/button';
import { Label } from '@/components/base/shadcn/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/base/shadcn/select';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/base/shadcn/tooltip';
import { useI18n } from '@/components/hooks/i18n';

import logo1 from '../exploration/cards/assets/newsletter-widget-1.svg';

import { SetSelectOption } from './set-operations-entity';

type SetOperationsLandingProps = {
  setTypesList: SetSelectOption[];
  setOptions: MultiSelectorOption[];
  setType?: string;
  selectedSets: string[];
  onSetsChange: (value: string[]) => void;
  onValueChange: (value: string) => void;
  onCompare: () => void;
};
function SetOperationsLanding({
  setTypesList,
  setType,
  setOptions,
  selectedSets,
  onValueChange,
  onSetsChange,
  onCompare,
}: SetOperationsLandingProps) {
  const { t } = useI18n();

  return (
    <>
      <div className="flex flex-col items-center gap-6">
        <div className="flex items-start justify-center gap-6 self-stretch">
          <img alt="Logo circles" src={logo1} width={156} height={158} />
        </div>

        <div className="flex items-center flex-col gap-1">
          <h5 className="text-base font-bold">{t('analysis.set_operations.get_started')}</h5>
          <p className="text-sm">{t('analysis.set_operations.get_started_visualize')}</p>
          <p className="text-sm">
            <Trans
              i18nKey="analysis.set_operations.get_started_dashboard"
              components={{
                dashboard: <AnchorLink size="sm" href="/dashboard" />,
              }}
            />
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-4 w-[415px]">
        <div className="flex flex-1 flex-col gap-2">
          <Label htmlFor="set-operations-entity">{t('analysis.set_operations.filters.select_entity')}</Label>
          <Select value={setType} onValueChange={onValueChange}>
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

        {setType && (
          <div className="flex max-w-[1200px] flex-1 flex-col gap-2">
            <Label>{t('analysis.set_operations.filters.select_set')}</Label>
            <MultiSelector
              value={selectedSets}
              onChange={onSetsChange}
              defaultOptions={setOptions}
              options={setOptions}
              placeholder={t('analysis.set_operations.filters.select_set_placeholder')}
              openOnFocus
            />
          </div>
        )}

        {selectedSets.length > 1 && (
          <div className="flex justify-end">
            <Tooltip>
              <TooltipTrigger asChild>
                <span>
                  <Button onClick={onCompare}>
                    <AndOrIcon />
                    {t('analysis.set_operations.filters.compare')}
                  </Button>
                </span>
              </TooltipTrigger>
              <TooltipContent>{t('analysis.set_operations.filters.compare_disabled_tooltip')}</TooltipContent>
            </Tooltip>
          </div>
        )}
      </div>
    </>
  );
}
export default SetOperationsLanding;
