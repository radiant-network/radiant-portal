import useSWR from 'swr';

import { type Aggregation, AggregationBodyWithSqon, Statistics, StatisticsBodyWithSqon } from '@/api/api';
import { useQBActiveSqon } from '@/components/base/query-builder/hooks/use-query-builder';
import { ApplicationId } from '@/components/cores/applications-config';
import { DEFAULT_TENANT, occurrencesApi } from '@/utils/api';
import { useCaseIdFromParam, useSeqIdFromSearchParam, useTaskIdFromSearchParam } from '@/utils/helper';

export interface IAggregationBuilder {
  aggregationBody?: AggregationBodyWithSqon;
  field: string;
  size?: number;
  withDictionary?: boolean;
}

type OccurrenceAggregationInput = {
  caseId: number;
  seqId: number;
  taskId: number;
  aggregationBody: AggregationBodyWithSqon;
  withDictionary?: boolean;
};

type OccurrenceStatisticsInput = {
  caseId: number;
  seqId: number;
  taskId: number;
  statisticsBody: StatisticsBodyWithSqon;
};

/**
 * Return the correct hook for the appID
 */
export function getAggregationsFetcher(appId: ApplicationId) {
  switch (appId) {
    case ApplicationId.germline_snv_occurrence:
      return {
        builderFetcher: useGermlineSNVAggregationBuilder,
        statisticFetcher: useGermlineSNVAggregationStatistics,
      };
    case ApplicationId.germline_cnv_occurrence:
      return {
        builderFetcher: useGermlineCNVAggregationBuilder,
        statisticFetcher: useGermlineCNVAggregationStatistics,
      };
    case ApplicationId.somatic_snv_to_occurrence:
      return {
        builderFetcher: useSomaticSNVAggregationBuilder,
        statisticFetcher: useSomaticSNVAggregationStatistics,
      };
    case ApplicationId.somatic_snv_tn_occurrence:
      return {
        builderFetcher: useSomaticSNVAggregationBuilder,
        statisticFetcher: useSomaticSNVAggregationStatistics,
      };
    default:
      return {
        builderFetcher: useGermlineSNVAggregationBuilder,
        statisticFetcher: useGermlineSNVAggregationStatistics,
      };
  }
}

/**
 * Germline SNV
 */
type SNVAggregationBuilderProps = IAggregationBuilder & {
  withDictionary?: boolean;
};
export function useGermlineSNVAggregationBuilder({
  field,
  size = 30,
  withDictionary = false,
}: SNVAggregationBuilderProps) {
  const activeSqon = useQBActiveSqon();
  const caseId = useCaseIdFromParam();
  const seqId = useSeqIdFromSearchParam();
  const taskId = useTaskIdFromSearchParam();

  const data: OccurrenceAggregationInput | null =
    taskId === undefined
      ? null
      : {
          caseId,
          seqId,
          taskId,
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
        .aggregateGermlineSNVOccurrences(
          DEFAULT_TENANT,
          caseId,
          seqId,
          taskId!,
          data!.aggregationBody,
          data!.withDictionary,
        )
        .then(response => response.data),
    {
      revalidateOnFocus: false,
    },
  );
}

export function useGermlineSNVAggregationStatistics({ field }: CNVAggregationBuilderProps) {
  const activeSqon = useQBActiveSqon();
  const caseId = useCaseIdFromParam();
  const seqId = useSeqIdFromSearchParam();
  const taskId = useTaskIdFromSearchParam();

  const data: OccurrenceStatisticsInput | null =
    taskId === undefined
      ? null
      : {
          caseId,
          seqId,
          taskId,
          statisticsBody: {
            field: field,
            sqon: activeSqon,
          },
        };

  return useSWR<Statistics, any, OccurrenceStatisticsInput | null>(
    data,
    async () =>
      occurrencesApi
        .statisticsGermlineSNVOccurrences(DEFAULT_TENANT, caseId, seqId, taskId!, data!.statisticsBody)
        .then(response => response.data),
    {
      revalidateOnFocus: false,
    },
  );
}

/**
 * Germline CNV
 */
type CNVAggregationBuilderProps = IAggregationBuilder;
export function useGermlineCNVAggregationBuilder({ field, size = 30 }: CNVAggregationBuilderProps) {
  const activeSqon = useQBActiveSqon();
  const caseId = useCaseIdFromParam();
  const seqId = useSeqIdFromSearchParam();
  const taskId = useTaskIdFromSearchParam();

  const data: OccurrenceAggregationInput | null =
    taskId === undefined
      ? null
      : {
          caseId,
          seqId,
          taskId,
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
        .aggregateGermlineCNVOccurrences(DEFAULT_TENANT, caseId, seqId, taskId!, data!.aggregationBody)
        .then(response => response.data),
    {
      revalidateOnFocus: false,
    },
  );
}

export function useGermlineCNVAggregationStatistics({ field }: CNVAggregationBuilderProps) {
  const activeSqon = useQBActiveSqon();
  const caseId = useCaseIdFromParam();
  const seqId = useSeqIdFromSearchParam();
  const taskId = useTaskIdFromSearchParam();

  const data: OccurrenceStatisticsInput | null =
    taskId === undefined
      ? null
      : {
          caseId,
          seqId,
          taskId,
          statisticsBody: {
            field: field,
            sqon: activeSqon,
          },
        };

  return useSWR<Statistics, any, OccurrenceStatisticsInput | null>(
    data,
    async () =>
      occurrencesApi
        .statisticsGermlineCNVOccurrences(DEFAULT_TENANT, caseId, seqId, taskId!, data!.statisticsBody)
        .then(response => response.data),
    {
      revalidateOnFocus: false,
    },
  );
}

/**
 * Somatic SNV
 */
export function useSomaticSNVAggregationBuilder({
  field,
  size = 30,
  withDictionary = false,
}: SNVAggregationBuilderProps) {
  const activeSqon = useQBActiveSqon();
  const caseId = useCaseIdFromParam();
  const seqId = useSeqIdFromSearchParam();
  const taskId = useTaskIdFromSearchParam();

  const data: OccurrenceAggregationInput | null =
    taskId === undefined
      ? null
      : {
          caseId,
          seqId,
          taskId,
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
        .aggregateSomaticSNVOccurrences(
          DEFAULT_TENANT,
          caseId,
          seqId,
          taskId!,
          data!.aggregationBody,
          data!.withDictionary,
        )
        .then(response => response.data),
    {
      revalidateOnFocus: false,
    },
  );
}

export function useSomaticSNVAggregationStatistics({ field }: CNVAggregationBuilderProps) {
  const activeSqon = useQBActiveSqon();
  const caseId = useCaseIdFromParam();
  const seqId = useSeqIdFromSearchParam();
  const taskId = useTaskIdFromSearchParam();

  const data: OccurrenceStatisticsInput | null =
    taskId === undefined
      ? null
      : {
          caseId,
          seqId,
          taskId,
          statisticsBody: {
            field: field,
            sqon: activeSqon,
          },
        };

  return useSWR<Statistics, any, OccurrenceStatisticsInput | null>(
    data,
    async () =>
      occurrencesApi
        .statisticsSomaticSNVOccurrences(DEFAULT_TENANT, caseId, seqId, taskId!, data!.statisticsBody)
        .then(response => response.data),
    {
      revalidateOnFocus: false,
    },
  );
}
