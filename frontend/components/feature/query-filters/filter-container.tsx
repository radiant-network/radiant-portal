import React, { useState } from 'react';
import { MultiSelectFilter } from '@/components/feature/query-filters/multiselect-filter';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/base/ui/accordion';
import { SearchIcon } from 'lucide-react';
import { type Aggregation as AggregationConfig } from '@/components/model/applications-config';
import { NumericalFilter } from './numerical-filter';
import { ToggleFilter } from './toggle-filter';
import { useI18n } from '@/components/hooks/i18n';

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

export function FilterContainer({ field }: { field: AggregationConfig }) {
  const [openItem, setOpenItem] = useState<string | undefined>(undefined);
  const [searchVisible, setSearchVisible] = React.useState(false);
  const { t } = useI18n();

  function handleSearch(e: React.MouseEvent<SVGElement, MouseEvent>): void {
    e.stopPropagation();
    setSearchVisible(!searchVisible);
  }
  return (
    <Accordion type="single" collapsible value={openItem} onValueChange={setOpenItem}>
      <AccordionItem key={field.key} value={field.key}>
        <AccordionTrigger className="AccordionTrigger">
          <div className="flex items-center justify-between w-full text-base">
            <span className="capitalize">
              {t(`common.filters.labels.${field.key.replace('_', '')}`, { defaultValue: field.key.replace('_', '') })}
            </span>
            {openItem === field.key && field.type === 'multiple' && (
              <SearchIcon size={18} className="z-40" aria-hidden onClick={handleSearch} />
            )}
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <FilterComponent field={field} searchVisible={searchVisible} />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
