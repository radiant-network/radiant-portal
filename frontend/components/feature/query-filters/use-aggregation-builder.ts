import React from 'react';
import useSWR from 'swr';
import { AggregationBodyWithSqon, SqonContent, SqonOpEnum, type Aggregation } from '@/api/api';
import { occurrencesApi } from '@/utils/api';
import { queryBuilderRemote } from '@/components/model/query-builder-core/query-builder-remote';

type AggregateContextProps = {
  seqId: string;
}
export const AggregateContext = React.createContext<AggregateContextProps>({ seqId: '1' });


type OccurrenceAggregationInput = {
  seqId: string;
  aggregationBody: AggregationBodyWithSqon;
};


const fetcher = (input: OccurrenceAggregationInput): Promise<Aggregation[]> => {
  return occurrencesApi
    .aggregateGermlineSNVOccurrences(input.seqId, input.aggregationBody)
    .then(response => response.data);
};

export function useAggregationBuilder(field: string, size: number = 30, shouldFetch: boolean = false, appId: string) {
  let data: OccurrenceAggregationInput | null;

  const { seqId } = React.useContext(AggregateContext);

  if (!shouldFetch) {
    data = null;
  } else {
    data = {
      seqId,
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
