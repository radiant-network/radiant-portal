import React from 'react';
import { SearchIcon } from 'lucide-react';

import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/base/ui/accordion';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/base/ui/tooltip';
import { MultiSelectFilter } from '@/components/feature/query-filters/multiselect-filter';
import { NumericalFilter } from '@/components/feature/query-filters/numerical-filter';
import { ToggleFilter } from '@/components/feature/query-filters/toggle-filter';
import { useI18n } from '@/components/hooks/i18n';
import { type Aggregation as AggregationConfig } from '@/components/model/applications-config';

interface FilterContainerProps {
  field: AggregationConfig;
  isOpen: boolean;
  searchHandler?: (e: React.MouseEvent<SVGElement, MouseEvent>) => void;
}

interface AccordionContainerProps extends FilterContainerProps {
  searchHandler?: (e: React.MouseEvent<SVGElement, MouseEvent>) => void;
  children?: React.ReactNode;
}

export function AccordionContainer({ field, isOpen, children, searchHandler }: AccordionContainerProps) {
  const { t } = useI18n();

  const label = t(`common.filters.labels.${field.key}`, { defaultValue: field.key });
  const tooltipKey = `common.filters.labels.${field.key}_tooltip`;
  const tooltipContent = t(tooltipKey) === tooltipKey ? null : t(tooltipKey);

  function renderTrigger() {
    return (
      <div className="flex items-center justify-between w-full text-sm">
        <span>{label}</span>
        {isOpen && searchHandler && <SearchIcon size={18} className="z-40" aria-hidden onClick={searchHandler} />}
      </div>
    );
  }

  return (
    <AccordionItem key={field.key} value={field.key}>
      <AccordionTrigger className="AccordionTrigger">
        {tooltipContent ? (
          <Tooltip>
            <TooltipTrigger asChild>{renderTrigger()}</TooltipTrigger>
            <TooltipContent>{tooltipContent}</TooltipContent>
          </Tooltip>
        ) : (
          renderTrigger()
        )}
      </AccordionTrigger>
      <AccordionContent>{children}</AccordionContent>
    </AccordionItem>
  );
}

export function MultiSelectFilterContainer({ field, isOpen }: FilterContainerProps) {
  const [searchVisible, setSearchVisible] = React.useState(false);

  function handleSearch(e: React.MouseEvent<SVGElement, MouseEvent>): void {
    e.stopPropagation();
    setSearchVisible(!searchVisible);
  }

  return (
    <AccordionContainer field={field} isOpen={isOpen} searchHandler={handleSearch}>
      <MultiSelectFilter field={field} searchVisible={searchVisible} />
    </AccordionContainer>
  );
}

/**
 * To be used when only the Filter is needed
 */
export function FilterComponent({ field }: FilterContainerProps) {
  const { t } = useI18n();
  let filterElement;

  switch (field.type) {
    case 'multiple':
      filterElement = <MultiSelectFilter field={field} searchVisible={true} />;
      break;
    case 'numerical':
      filterElement = <NumericalFilter field={field} />;
      break;
    case 'boolean':
      filterElement = <ToggleFilter field={field} />;
      break;
    default:
      filterElement = <div>{t('common.filters.unsupported_type', { type: field.type })}</div>;
  }

  return filterElement;
}

/**
 * To be use when the filter needs to be inside an Accordion component
 */
export function FilterContainer({ field, isOpen }: FilterContainerProps) {
  const { t } = useI18n();
  const fieldType = field.type;

  if (fieldType === 'divider') {
    return <h4 className="mx-1 my-3 mt-5 text-muted-foreground">{t(`common.filters.${field.key}`)}</h4>;
  }

  let filterElement;

  switch (fieldType) {
    case 'multiple':
      filterElement = <MultiSelectFilterContainer field={field} isOpen={isOpen} />;
      break;
    case 'numerical':
      filterElement = (
        <AccordionContainer field={field} isOpen={isOpen}>
          <NumericalFilter field={field} />
        </AccordionContainer>
      );
      break;
    case 'boolean':
      filterElement = (
        <AccordionContainer field={field} isOpen={isOpen}>
          <ToggleFilter field={field} />
        </AccordionContainer>
      );
      break;
    default:
      filterElement = <div>{t('common.filters.unsupported_type', { type: field.type })}</div>;
  }
  return filterElement;
}
