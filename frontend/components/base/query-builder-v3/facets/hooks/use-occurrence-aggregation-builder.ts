import React from 'react';
import useSWR from 'swr';

import { type Aggregation, AggregationBodyWithSqon, SqonContent, SqonOpEnum } from '@/api/api';
import { ApplicationId } from '@/components/cores/applications-config';
import { queryBuilderRemote } from '@/components/cores/query-builder/query-builder-remote';
import { occurrencesApi } from '@/utils/api';

type AggregateContextProps = {
  caseId: number;
  seqId: number;
};
export const OccurrenceAggregateContext = React.createContext<AggregateContextProps>({ caseId: 1, seqId: 1 });

type OccurrenceAggregationInput = {
  caseId: number;
  seqId: number;
  aggregationBody: AggregationBodyWithSqon;
  withDictionary?: boolean;
};

const fetcher = (appId: ApplicationId) => {
  switch (appId) {
    case ApplicationId.cnv_occurrence:
      return (input: OccurrenceAggregationInput): Promise<Aggregation[]> =>
        occurrencesApi
          .aggregateGermlineCNVOccurrences(input.caseId, input.seqId, input.aggregationBody)
          .then(response => response.data);
    default:
      return (input: OccurrenceAggregationInput): Promise<Aggregation[]> =>
        occurrencesApi
          .aggregateGermlineSNVOccurrences(input.caseId, input.seqId, input.aggregationBody, input.withDictionary)
          .then(response => response.data);
  }
};

export function useOccurrenceAggregationBuilder(
  field: string,
  size: number = 30,
  shouldFetch: boolean = false,
  withDictionary: boolean = false,
  appId: ApplicationId,
) {
  let data: OccurrenceAggregationInput | null;

  const { caseId, seqId } = React.useContext(OccurrenceAggregateContext);

  if (!shouldFetch) {
    data = null;
  } else {
    data = {
      caseId,
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
