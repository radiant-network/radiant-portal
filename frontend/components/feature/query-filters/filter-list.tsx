import { useConfig } from '@/components/model/applications-config';
import { FilterContainer } from '@/components/feature/query-filters/filter-container';

interface FilterListProps {
  groupKey?: string | null;
}

export function FilterList({ groupKey }: FilterListProps) {
  const config = useConfig();
  const aggregations = config.variant_exploration.aggregations;

  // If groupKey is provided, use that group's aggregations, otherwise get all aggregations from all groups
  const fields = groupKey
    ? aggregations[groupKey]?.items || []
    : Object.values(aggregations).flatMap(group => group.items);

  return (
    <ul>
      {fields.map(field => (
        <li key={field.key}>
          <FilterContainer field={field} aggregation={groupKey!} />
        </li>
      ))}
    </ul>
  );
}
