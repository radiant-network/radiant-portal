import useSWR from 'swr';
import { SqonContent, SqonOpEnum, type Aggregation, type AggregationBody } from '@/api/api';
import { occurrencesApi } from '@/utils/api';
import { queryBuilderRemote } from '@/components/model/query-builder-core/query-builder-remote';

type OccurrenceAggregationInput = {
  seqId: string;
  aggregationBody: AggregationBody;
};

const fetcher = (input: OccurrenceAggregationInput): Promise<Aggregation[]> => {
  return occurrencesApi
    .aggregateGermlineOccurrences(input.seqId, input.aggregationBody)
    .then(response => response.data);
};

export function useAggregationBuilder(field: string, size: number = 30, shouldFetch: boolean = false, appId: string) {
  let data: OccurrenceAggregationInput | null;

  if (!shouldFetch) {
    data = null;
  } else {
    data = {
      seqId: '1',
      aggregationBody: {
        field: field,
        size: size,
      },
    };
  }

  const activeQuery = queryBuilderRemote.getResolvedActiveQuery(appId);

  if (activeQuery && data) {
    data.aggregationBody.sqon = {
      content: activeQuery.content as SqonContent,
      op: activeQuery.op as SqonOpEnum,
    };
  }
  return useSWR<Aggregation[], any, OccurrenceAggregationInput | null>(data, fetcher, {
    revalidateOnFocus: false,
  });
}
