import React from 'react';
import useSWR from 'swr';

import { type Aggregation, AggregationBodyWithSqon, SqonContent, SqonOpEnum } from '@/api/api';
import { ApplicationId } from '@/components/model/applications-config';
import { queryBuilderRemote } from '@/components/model/query-builder-core/query-builder-remote';
import { occurrencesApi } from '@/utils/api';

type AggregateContextProps = {
  seqId: string;
};
export const AggregateContext = React.createContext<AggregateContextProps>({ seqId: '1' });

type OccurrenceAggregationInput = {
  seqId: string;
  aggregationBody: AggregationBodyWithSqon;
  withDictionary?: boolean;
};

const fetcher = (appId: ApplicationId) => {
  switch (appId) {
    case ApplicationId.cnv_occurrence:
      return (input: OccurrenceAggregationInput): Promise<Aggregation[]> =>
        occurrencesApi
          .aggregateGermlineCNVOccurrences(input.seqId, input.aggregationBody)
          .then(response => response.data);
    default:
      return (input: OccurrenceAggregationInput): Promise<Aggregation[]> =>
        occurrencesApi
          .aggregateGermlineSNVOccurrences(input.seqId, input.aggregationBody, input.withDictionary)
          .then(response => response.data);
  }
};

export function useAggregationBuilder(
  field: string,
  size: number = 30,
  shouldFetch: boolean = false,
  withDictionary: boolean = false,
  appId: string,
) {
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
      withDictionary,
    };
  }

  const activeQuery = queryBuilderRemote.getResolvedActiveQuery(appId);

  if (activeQuery && data) {
    data.aggregationBody.sqon = {
      content: activeQuery.content as SqonContent,
      op: activeQuery.op as SqonOpEnum,
    };
  }
  return useSWR<Aggregation[], any, OccurrenceAggregationInput | null>(data, fetcher(appId), {
    revalidateOnFocus: false,
  });
}
