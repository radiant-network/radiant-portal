import React from 'react';
import { SearchIcon } from 'lucide-react';
import { type Aggregation as AggregationConfig } from '@/components/model/applications-config';
import { useI18n } from '@/components/hooks/i18n';
import { MultiSelectFilter } from '@/components/feature/query-filters/multiselect-filter';
import { NumericalFilter } from '@/components/feature/query-filters/numerical-filter';
import { ToggleFilter } from '@/components/feature/query-filters/toggle-filter';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/base/ui/accordion';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/base/ui/tooltip';

type FilterContainerProps = {
  field: AggregationConfig;
  isOpen: boolean;
};

export function FilterComponent({ field, searchVisible }: { field: AggregationConfig; searchVisible: boolean }) {
  const { t } = useI18n();

  switch (field.type) {
    case 'multiple':
      return <MultiSelectFilter field={field} searchVisible={searchVisible} />;
    case 'numerical':
      return <NumericalFilter field={field} />;
    case 'boolean':
      return <ToggleFilter field={field} />;
    default:
      return <div>{t('common.filters.unsupportedType', { type: field.type })}</div>;
  }
}

export function FilterContainer({ field, isOpen }: FilterContainerProps) {
  const { t } = useI18n();
  const [searchVisible, setSearchVisible] = React.useState(false);

  function handleSearch(e: React.MouseEvent<SVGElement, MouseEvent>): void {
    e.stopPropagation();
    setSearchVisible(!searchVisible);
  }

  const label = t(`common.filters.labels.${field.key}`, { defaultValue: field.key });
  const tooltipKey = `common.filters.labels.${field.key}_tooltip`;
  const tooltipContent = t(tooltipKey) === tooltipKey ? null : t(tooltipKey);

  function renderTrigger() {
      return (
              <div className="flex items-center justify-between w-full text-base">
                <span>{label}</span>
                {isOpen && field.type === 'multiple' && (
                  <SearchIcon size={18} className="z-40" aria-hidden onClick={handleSearch} />
                )}
      </div>
    );
  }

  return (
    <AccordionItem key={field.key} value={field.key}>
      <AccordionTrigger className="AccordionTrigger">
        {tooltipContent ? (
          <Tooltip>
            <TooltipTrigger asChild>
              {renderTrigger()}
            </TooltipTrigger>
            <TooltipContent>
              {tooltipContent}
            </TooltipContent>
          </Tooltip>
        ) : (
          renderTrigger()
        )}

      </AccordionTrigger>
      <AccordionContent>
        <FilterComponent field={field} searchVisible={searchVisible} />
      </AccordionContent>
    </AccordionItem>
  );
}
