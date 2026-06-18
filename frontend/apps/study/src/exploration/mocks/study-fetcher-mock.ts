import { type Count } from '@/api/api';
import { type IAggregationBuilder } from '@/components/base/query-builder/hooks/use-aggregation-builder';
import {
  type ICountInput,
  type IListInput,
  type IQBFetcher,
} from '@/components/base/query-builder/hooks/use-query-builder';

import { MOCK_STUDIES } from './studies-mock';
import { type Study } from './study-model';

/** Maps a facet field key to the study value(s) it filters on. */
const FIELD_ACCESSORS: Record<string, (s: Study) => string[]> = {
  program: s => [s.program],
  domain: s => [s.domain],
  data_category: s => s.data_categories,
  experimental_strategy: s => s.experimental_strategies,
  family_data: s => [s.family_data ? 'True' : 'False'],
};

/**
 * Extract `{ field: allowedValues }` from the active sqon.
 * TODO(back): the real endpoint resolves the full sqon (nested groups, operators);
 * here we only read flat "in" facet pills, which is all the studies page produces.
 */
function extractFilters(sqon: IListInput['listBody']['sqon']): Record<string, string[]> {
  const filters: Record<string, string[]> = {};
  for (const node of (sqon?.content as any[]) ?? []) {
    const inner = node?.content;
    if (inner && typeof inner === 'object' && 'field' in inner) {
      const value = inner.value;
      filters[inner.field] = Array.isArray(value) ? value.map(String) : [String(value)];
    }
  }
  return filters;
}

/** Sqon field key for the free-text search box (study code / name / dbGaP). */
export const STUDY_SEARCH_FIELD = 'search_text';

function matchesSearch(study: Study, term: string): boolean {
  const haystack = [study.study_code, study.study_name, study.dbgap ?? ''].join(' ').toLowerCase();
  return haystack.includes(term.toLowerCase());
}

function matchesFilters(study: Study, filters: Record<string, string[]>): boolean {
  return Object.entries(filters).every(([field, allowed]) => {
    if (field === STUDY_SEARCH_FIELD) return allowed.every(term => matchesSearch(study, term));
    const accessor = FIELD_ACCESSORS[field];
    if (!accessor) return true; // unknown field → ignore
    return accessor(study).some(value => allowed.includes(value));
  });
}

function applySort(rows: Study[], sort: IListInput['listBody']['sort']): Study[] {
  if (!sort?.length) return rows;
  const { field, order } = sort[0] as { field: string; order: string };
  const dir = order === 'desc' ? -1 : 1;
  return [...rows].sort((a, b) => {
    const av = (a as any)[field];
    const bv = (b as any)[field];
    if (av == null) return 1; // nulls last
    if (bv == null) return -1;
    if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * dir;
    return String(av).localeCompare(String(bv)) * dir;
  });
}

/**
 * Mock list/count fetcher for the studies table.
 * TODO(back): replace with studiesApi.listStudies / countStudies once the endpoint exists.
 */
export const studyFetcher: IQBFetcher = {
  list: async ({ listBody }: IListInput) => {
    const filtered = MOCK_STUDIES.filter(s => matchesFilters(s, extractFilters(listBody.sqon)));
    const sorted = applySort(filtered, listBody.sort);
    const start = listBody.page_index * listBody.limit;
    return sorted.slice(start, start + listBody.limit);
  },
  count: async ({ countBody }: ICountInput): Promise<Count> => {
    const filtered = MOCK_STUDIES.filter(s =>
      matchesFilters(s, extractFilters(countBody.sqon as IListInput['listBody']['sqon'])),
    );
    return { count: filtered.length };
  },
};

/**
 * Facet buckets (values + counts) derived from the full mock set.
 * Cached per field so the reference stays stable across renders — the real fetcher
 * uses SWR which is also referentially stable, and the facets depend on that.
 */
const BUCKET_CACHE = new Map<string, { key: string; count: number }[]>();
function getBuckets(field: string) {
  if (!BUCKET_CACHE.has(field)) {
    const accessor = FIELD_ACCESSORS[field];
    const counts = new Map<string, number>();
    for (const study of MOCK_STUDIES) {
      for (const value of accessor?.(study) ?? []) {
        counts.set(value, (counts.get(value) ?? 0) + 1);
      }
    }
    BUCKET_CACHE.set(
      field,
      [...counts.entries()].map(([key, count]) => ({ key, count })).sort((a, b) => b.count - a.count),
    );
  }
  return BUCKET_CACHE.get(field)!;
}

/**
 * Mock facet-bucket fetcher (plugged into FacetConfigContext.builderFetcher).
 * TODO(back): the real aggregation endpoint recomputes counts against the active sqon.
 */
export function studyBuilderFetcher({ field }: IAggregationBuilder) {
  return { data: getBuckets(field), isLoading: false };
}

/** No numerical facets on the studies page → statistics are never requested. */
export function studyStatisticFetcher(_params: IAggregationBuilder) {
  return { data: undefined, isLoading: false };
}
