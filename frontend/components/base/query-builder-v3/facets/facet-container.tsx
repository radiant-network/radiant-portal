import React from 'react';

import { filtersWithTooltip } from '@/apps/case/src/entity/variants/filters/utils';
import { BooleanFacet } from '@/components/base/query-builder-v3/facets/boolean-facet';
import { MultiSelectFacet } from '@/components/base/query-builder-v3/facets/multiselect-facet';
import { NumericalFacet } from '@/components/base/query-builder-v3/facets/numerical-facet';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/base/shadcn/accordion';
import { Card, CardHeader } from '@/components/base/shadcn/card';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/base/shadcn/tooltip';
import { type Aggregation as AggregationConfig, FilterTypes } from '@/components/cores/applications-config';
import { useI18n } from '@/components/hooks/i18n';

interface FacetContainerProps {
  field: AggregationConfig;
  isOpen: boolean;
  searchHandler?: (_e: React.MouseEvent<SVGElement, MouseEvent>) => void;
}

interface AccordionContainerProps extends FacetContainerProps {
  searchHandler?: (_e: React.MouseEvent<SVGElement, MouseEvent>) => void;
  children?: React.ReactNode;
}

export function AccordionContainer({ field, children }: AccordionContainerProps) {
  const { t } = useI18n();

  const label = t(`common.filters.labels.${field.translation_key}`, { defaultValue: field.key });
  let tooltipContent: string | null = null;
  if (filtersWithTooltip.includes(field.key)) {
    const tooltipKey = `common.filters.labels.${field.translation_key}_tooltip`;
    tooltipContent = t(tooltipKey) === tooltipKey ? null : t(tooltipKey);
  }

  function renderTrigger() {
    return (
      <div className="flex items-center justify-between w-full text-xs">
        <span>{label}</span>
      </div>
    );
  }

  return (
    <Card size="sm">
      <AccordionItem key={field.key} value={field.key} className="border-none">
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
 * To be used when only the facet is needed
 */
export function FacetComponent({ field }: FacetContainerProps) {
  const { t } = useI18n();
  let filterElement;

  switch (field.type) {
    case FilterTypes.MULTIPLE:
      filterElement = <MultiSelectFacet field={field} />;
      break;
    case FilterTypes.NUMERICAL:
      filterElement = <NumericalFacet field={field} />;
      break;
    case FilterTypes.BOOLEAN:
      filterElement = <BooleanFacet field={field} />;
      break;
    default:
      filterElement = <div>{t('common.filters.unsupported_type', { type: field.type })}</div>;
  }

  return filterElement;
}

/**
 * To be use when the facet needs to be inside an Accordion component
 */
export function FacetContainer({ field, isOpen }: FacetContainerProps) {
  const { t } = useI18n();
  const fieldType = field.type;

  if (fieldType === FilterTypes.DIVIDER) {
    return (
      <h4 className="px-2 h-8 text-sidebar-foreground/70 text-xs font-medium line-height-xs text-ellipsis overflow-hidden flex justify-between items-center">
        {t(`common.filters.${field.key}`)}
      </h4>
    );
  }

  let filterElement;

  switch (fieldType) {
    case FilterTypes.MULTIPLE:
      filterElement = (
        <AccordionContainer field={field} isOpen={isOpen}>
          <MultiSelectFacet field={field} />
        </AccordionContainer>
      );
      break;
    case FilterTypes.NUMERICAL:
      filterElement = (
        <AccordionContainer field={field} isOpen={isOpen}>
          <NumericalFacet field={field} />
        </AccordionContainer>
      );
      break;
    case FilterTypes.BOOLEAN:
      filterElement = (
        <AccordionContainer field={field} isOpen={isOpen}>
          <BooleanFacet field={field} />
        </AccordionContainer>
      );
      break;
    default:
      filterElement = <div>{t('common.filters.unsupported_type', { type: field.type })}</div>;
  }

  return filterElement;
}
