import React, { useId } from 'react';

import { BooleanFacet } from '@/components/base/query-builder/facets/boolean-facet';
import FavoriteFacetButton from '@/components/base/query-builder/facets/favorite/favorite-facet-button';
import { useFavorites } from '@/components/base/query-builder/facets/favorite/hooks/use-favorites';
import { MultiSelectFacet } from '@/components/base/query-builder/facets/multiselect-facet';
import { NumericalFacet } from '@/components/base/query-builder/facets/numerical-facet';
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  useAccordionContext,
} from '@/components/base/shadcn/accordion';
import { Card, CardHeader } from '@/components/base/shadcn/card';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/base/shadcn/tooltip';
import { type Aggregation as AggregationConfig, FilterTypes } from '@/components/cores/applications-config';
import { useI18n } from '@/components/hooks/i18n';
import { cn } from '@/components/lib/utils';

interface FacetContainerProps {
  field: AggregationConfig;
  isOpen: boolean;
  searchHandler?: (_e: React.MouseEvent<SVGElement, MouseEvent>) => void;
}

interface AccordionContainerProps extends FacetContainerProps {
  searchHandler?: (_e: React.MouseEvent<SVGElement, MouseEvent>) => void;
  children?: React.ReactNode;
}

export function AccordionContainer({ field, isOpen, children }: AccordionContainerProps) {
  const { t } = useI18n();
  const { history } = useAccordionContext();
  const { isFavorite, toggleFavorite } = useFavorites();
  const descriptionId = useId();

  const label = t(`common.facets.labels.${field.translation_key}`, { defaultValue: field.key });
  const tooltipKey = `common.facets.labels.${field.translation_key}_tooltip`;
  const tooltipContent = t(tooltipKey) === tooltipKey ? null : t(tooltipKey);
  const favorite = isFavorite(field.key);

  function renderTrigger() {
    return (
      <div className="flex items-center justify-between w-full text-xs">
        <span>{label}</span>
      </div>
    );
  }

  return (
    <Card size="sm">
      <AccordionItem
        key={field.key}
        value={field.key}
        className="border-none"
        data-cy={`facet-state-${isOpen ? 'open' : 'closed'}`}
      >
        <CardHeader
          size="sm"
          className="group/facet-header relative flex! flex-row items-center gap-2 [&>h3]:min-w-0 [&>h3]:flex-1"
        >
          <AccordionTrigger
            data-cy={`facet-header-${field.key}`}
            aria-describedby={tooltipContent ? descriptionId : undefined}
            className="pr-8"
          >
            {tooltipContent ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <span data-cy={`facet-tooltip-trigger-${field.key}`}>{renderTrigger()}</span>
                </TooltipTrigger>
                <TooltipContent>
                  <span>{tooltipContent}</span>
                </TooltipContent>
              </Tooltip>
            ) : (
              renderTrigger()
            )}
          </AccordionTrigger>
          <FavoriteFacetButton
            facetLabel={label}
            isFavorite={favorite}
            onToggle={() => toggleFavorite(field.key)}
            dataCy={`facet-star-${field.key}`}
            className={cn(
              'absolute right-2 top-1/2 z-10 -translate-y-1/2',
              favorite
                ? 'opacity-100'
                : 'pointer-events-none opacity-0 focus-visible:pointer-events-auto focus-visible:opacity-100 group-hover/facet-header:pointer-events-auto group-hover/facet-header:opacity-100',
            )}
          />
          {tooltipContent && (
            <span id={descriptionId} className="sr-only">
              {tooltipContent}
            </span>
          )}
        </CardHeader>
        <AccordionContent className="pb-0" forceMount={history.includes(field.key) ? true : undefined}>
          {children}
        </AccordionContent>
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
      filterElement = <div>{t('common.facets.unsupported_type', { type: field.type })}</div>;
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
        {t(`common.facets.${field.key}`)}
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
      filterElement = <div>{t('common.facets.unsupported_type', { type: field.type })}</div>;
  }

  return filterElement;
}
