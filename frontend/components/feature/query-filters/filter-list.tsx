import { useConfig } from '@/components/model/applications-config';
import { FilterContainer } from '@/components/feature/query-filters/filter-container';
import { Button } from '@/components/base/ui/button';
import { useState } from 'react';
import { useI18n } from '@/components/hooks/i18n';

interface FilterListProps {
  groupKey?: string | null;
}

export function FilterList({ groupKey }: FilterListProps) {
  const { t } = useI18n();
  const config = useConfig();
  const aggregations = config.variant_exploration.aggregations;
  const [toggleAllAccordions, setToggleAllAccordions] = useState<boolean>(false);

  // If groupKey is provided, use that group's aggregations, otherwise get all aggregations from all groups
  const fields = groupKey
    ? aggregations[groupKey]?.items || []
    : Object.values(aggregations).flatMap(group => group.items);

  return (
    <ul>
      <li className="flex justify-end">
        <Button
          variant="link"
          onClick={() => {
            setToggleAllAccordions(!toggleAllAccordions);
          }}
        >
          {toggleAllAccordions ? t('common.actions.collapseAll') : t('common.actions.expandAll')}
        </Button>
      </li>
      {fields.map(field => (
        <li key={field.key}>
          <FilterContainer field={field} aggregation={groupKey!} isOpen={toggleAllAccordions} />
        </li>
      ))}
    </ul>
  );
}
