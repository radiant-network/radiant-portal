import { useConfig } from '@/components/model/applications-config';
import { type Aggregation as AggregationConfig } from '@/components/model/applications-config';
import { FilterContainer } from '@/components/feature/query-filters/filter-container';

export function FilterList() {
  const config = useConfig();
  const fields: AggregationConfig[] = config.variant_entity.aggregations;

  return (
    <ul>
      {fields.map(field => (
        <li key={field.key}>
          <FilterContainer field={field} />
        </li>
      ))}
    </ul>
  );
}
