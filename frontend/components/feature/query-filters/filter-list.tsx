import { useEffect, useState } from 'react';

import { Accordion } from '@/components/base/ui/accordion';
import { Button } from '@/components/base/ui/button';
import { FilterContainer } from '@/components/feature/query-filters/filter-container';
import { useI18n } from '@/components/hooks/i18n';
import { AggregationConfig } from '@/components/model/applications-config';

interface FilterListProps {
  groupKey?: string | null;
  aggregations: AggregationConfig;
}

export function FilterList({ groupKey, aggregations }: FilterListProps) {
  const { t } = useI18n();
  const [toggleExpandAll, setToggleExpandAll] = useState<boolean>(false);
  const [expandedFilters, setExpandedFilters] = useState<string[]>([]);

  // If groupKey is provided, use that group's aggregations, otherwise get all aggregations from all groups
  const fields = groupKey
    ? aggregations[groupKey]?.items || []
    : Object.values(aggregations).flatMap(group => group.items);

  useEffect(() => {
    setToggleExpandAll(false);
    setExpandedFilters([]);
  }, [groupKey]);

  return (
    <div>
      <div className="flex justify-end">
        <Button
          variant="link"
          onClick={() => {
            const newToggleExpandAll = !toggleExpandAll;
            setToggleExpandAll(newToggleExpandAll);
            if (newToggleExpandAll) {
              setExpandedFilters(fields.map(field => field.key));
            } else {
              setExpandedFilters([]);
            }
          }}
        >
          {toggleExpandAll ? t('common.actions.collapse_all') : t('common.actions.expand_all')}
        </Button>
      </div>
      <Accordion
        className="flex flex-col gap-1"
        type="multiple"
        value={expandedFilters}
        onValueChange={value => setExpandedFilters(value)}
      >
        {fields.map((field, index) => (
          <FilterContainer key={`${field.key}-${index}`} isOpen={expandedFilters.includes(field.key)} field={field} />
        ))}
      </Accordion>
    </div>
  );
}
