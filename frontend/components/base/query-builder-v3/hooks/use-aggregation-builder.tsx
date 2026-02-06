import useSWR from 'swr';

import { type Aggregation, AggregationBodyWithSqon, Statistics, StatisticsBodyWithSqon } from '@/api/api';
import { useQBActiveSqon } from '@/components/base/query-builder-v3/hooks/use-query-builder';
import { ApplicationId } from '@/components/cores/applications-config';
import { occurrencesApi } from '@/utils/api';
import { useCaseIdFromParam, useSeqIdFromSearchParam } from '@/utils/helper';

export interface IAggregationBuilder {
  aggregationBody?: AggregationBodyWithSqon;
  field: string;
  size?: number;
  withDictionary?: boolean;
}

type OccurrenceAggregationInput = {
  caseId: number;
  seqId: number;
  aggregationBody: AggregationBodyWithSqon;
  withDictionary?: boolean;
};

type OccurrenceStatisticsInput = {
  caseId: number;
  seqId: number;
  statisticsBody: StatisticsBodyWithSqon;
};

/**
 * Return the correct hook for the appID
 */
export function getAggregationsFetcher(appId: ApplicationId) {
  switch (appId) {
    case ApplicationId.snv_occurrence:
      return {
        builderFetcher: useSNVAggregationBuilder,
        statisticFetcher: useSNVAggregationStatistics,
      };
    case ApplicationId.cnv_occurrence:
      return {
        builderFetcher: useCNVAggregationBuilder,
        statisticFetcher: useCNVAggregationStatistics,
      };
    default:
      return {
        builderFetcher: useSNVAggregationBuilder,
        statisticFetcher: useSNVAggregationStatistics,
      };
  }
}

/**
 * SNV
 */
type SNVAggregationBuilderProps = IAggregationBuilder & {
  withDictionary?: boolean;
};
export function useSNVAggregationBuilder({ field, size = 30, withDictionary = false }: SNVAggregationBuilderProps) {
  const activeSqon = useQBActiveSqon();
  const caseId = useCaseIdFromParam();
  const seqId = useSeqIdFromSearchParam();

  const data: OccurrenceAggregationInput = {
    caseId,
    seqId,
    aggregationBody: {
      field: field,
      size: size,
      sqon: activeSqon,
    },
    withDictionary,
  };

  return useSWR<Aggregation[], any, OccurrenceAggregationInput | null>(
    data,
    async () =>
      occurrencesApi
        .aggregateGermlineSNVOccurrences(data.caseId, data.seqId, data.aggregationBody, data.withDictionary)
        .then(response => response.data),
    {
      revalidateOnFocus: false,
    },
  );
}

export function useSNVAggregationStatistics({ field }: CNVAggregationBuilderProps) {
  const activeSqon = useQBActiveSqon();
  const caseId = useCaseIdFromParam();
  const seqId = useSeqIdFromSearchParam();

  const data: OccurrenceStatisticsInput = {
    caseId,
    seqId,
    statisticsBody: {
      field: field,
      sqon: activeSqon,
    },
  };

  return useSWR<Statistics, any, OccurrenceStatisticsInput | null>(
    data,
    async () =>
      occurrencesApi
        .statisticsGermlineSNVOccurrences(data.caseId, data.seqId, data.statisticsBody)
        .then(response => response.data),
    {
      revalidateOnFocus: false,
    },
  );
}

/**
 * CNV
 */
type CNVAggregationBuilderProps = IAggregationBuilder;
export function useCNVAggregationBuilder({ field, size = 30 }: CNVAggregationBuilderProps) {
  const activeSqon = useQBActiveSqon();
  const caseId = useCaseIdFromParam();
  const seqId = useSeqIdFromSearchParam();

  const data: OccurrenceAggregationInput = {
    caseId,
    seqId,
    aggregationBody: {
      field: field,
      size: size,
      sqon: activeSqon,
    },
  };

  return useSWR<Aggregation[], any, OccurrenceAggregationInput | null>(
    data,
    async () =>
      occurrencesApi
        .aggregateGermlineCNVOccurrences(data.caseId, data.seqId, data.aggregationBody)
        .then(response => response.data),
    {
      revalidateOnFocus: false,
    },
  );
}

export function useCNVAggregationStatistics({ field }: CNVAggregationBuilderProps) {
  const activeSqon = useQBActiveSqon();
  const caseId = useCaseIdFromParam();
  const seqId = useSeqIdFromSearchParam();

  const data: OccurrenceStatisticsInput = {
    caseId,
    seqId,
    statisticsBody: {
      field: field,
      sqon: activeSqon,
    },
  };

  return useSWR<Statistics, any, OccurrenceStatisticsInput | null>(
    data,
    async () =>
      occurrencesApi
        .statisticsGermlineCNVOccurrences(data.caseId, data.seqId, data.statisticsBody)
        .then(response => response.data),
    {
      revalidateOnFocus: false,
    },
  );
}
