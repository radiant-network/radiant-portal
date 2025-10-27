import React from 'react';

import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/base/ui/accordion';
import { Card, CardHeader } from '@/components/base/ui/card';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/base/ui/tooltip';
import { MultiSelectFilter } from '@/components/feature/query-filters/multiselect-filter';
import { NumericalFilter } from '@/components/feature/query-filters/numerical-filter';
import { ToggleFilter } from '@/components/feature/query-filters/toggle-filter';
import { useI18n } from '@/components/hooks/i18n';
import { type Aggregation as AggregationConfig } from '@/components/model/applications-config';

import AutoSuggestFilter from './auto-suggest-filter';
import UploadFilter from './upload-filter';

interface FilterContainerProps {
  field: AggregationConfig;
  isOpen: boolean;
  searchHandler?: (_e: React.MouseEvent<SVGElement, MouseEvent>) => void;
}

interface AccordionContainerProps extends FilterContainerProps {
  searchHandler?: (_e: React.MouseEvent<SVGElement, MouseEvent>) => void;
  children?: React.ReactNode;
}

export function AccordionContainer({ field, children }: AccordionContainerProps) {
  const { t } = useI18n();

  const label = t(`common.filters.labels.${field.translation_key}`, { defaultValue: field.key });
  const tooltipKey = `common.filters.labels.${field.translation_key}_tooltip`;
  const tooltipContent = t(tooltipKey) === tooltipKey ? null : t(tooltipKey);

  function renderTrigger() {
    return (
      <div className="flex items-center justify-between w-full text-xs">
        <span>{label}</span>
      </div>
    );
  }

  return (
    <Card size="sm">
      <AccordionItem key={field.key} value={field.key}>
        <CardHeader size="sm">
          <AccordionTrigger>
            {tooltipContent ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <span>{renderTrigger()}</span>
                </TooltipTrigger>
                <TooltipContent>
                  <span>{tooltipContent}</span>
                </TooltipContent>
              </Tooltip>
            ) : (
              renderTrigger()
            )}
          </AccordionTrigger>
        </CardHeader>
        <AccordionContent className="pb-0">{children}</AccordionContent>
      </AccordionItem>
    </Card>
  );
}

/**
 * To be used when only the Filter is needed
 */
export function FilterComponent({ field }: FilterContainerProps) {
  const { t } = useI18n();
  let filterElement;

  switch (field.type) {
    case 'auto-suggest':
      filterElement = <AutoSuggestFilter field={field} />;
      break;
    case 'upload':
      filterElement = <UploadFilter field={field} />;
      break;
    case 'multiple':
      filterElement = <MultiSelectFilter field={field} />;
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
    case 'auto-suggest':
      filterElement = <AutoSuggestFilter field={field} />;
      break;
    case 'upload':
      filterElement = <UploadFilter field={field} />;
      break;
    case 'multiple':
      filterElement = (
        <AccordionContainer field={field} isOpen={isOpen}>
          <MultiSelectFilter field={field} />
        </AccordionContainer>
      );
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
