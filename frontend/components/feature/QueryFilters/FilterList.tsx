import { useConfig } from "@/components/model/applications-config";
import { type Aggregation as AggregationConfig } from "@/components/model/applications-config";
import { FilterAccordion } from "@/components/feature/QueryFilters/FilterAccordion";

export function FilterList() {
  const config = useConfig();
  const fields: AggregationConfig[] = config.variant_entity.aggregations;

  return (
    <ul>
      {fields.map((field) => (
        <li key={field.key}>
          <FilterAccordion field={field} />
        </li>
      ))}
    </ul>
  );
}
