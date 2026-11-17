import type { Aggregation, AggregationConfig } from '@/components/cores/applications-config';

export function resolveFavoriteFacets(favorites: ReadonlySet<string>, aggregations: AggregationConfig): Aggregation[] {
  const seen = new Set<string>();
  const result: Aggregation[] = [];
  for (const group of Object.values(aggregations)) {
    for (const item of group.items) {
      if (favorites.has(item.key) && !seen.has(item.key)) {
        seen.add(item.key);
        result.push(item);
      }
    }
  }
  return result;
}
