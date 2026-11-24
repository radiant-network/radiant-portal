import { useMemo, useState } from 'react';
import { useParams } from 'react-router';
import { SearchIcon } from 'lucide-react';
import useSWR from 'swr';
import useSWRImmutable from 'swr/immutable';

import {
  type ApiError,
  GetGermlineVariantInternalFrequenciesSequencingTypeEnum,
  GetGermlineVariantInternalFrequenciesSplitEnum,
  type InternalFrequencies,
  type VariantInternalFrequencies,
} from '@/api/index';
import DataTable from '@/components/base/data-table/data-table';
import Empty from '@/components/base/empties/empty';
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/base/shadcn/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/base/shadcn/tabs';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/base/shadcn/tooltip';
import { useI18n } from '@/components/hooks/i18n';
import { useTenant } from '@/components/hooks/use-tenant';
import { toPercentage } from '@/components/lib/number-format';
import { variantsApi } from '@/utils/api';

import { getMyNetworkColumns, myNetworkDefaultSettings } from './table-settings';

type SequencingType = GetGermlineVariantInternalFrequenciesSequencingTypeEnum;

type MyNetworkInput = {
  locusId: string;
  split: GetGermlineVariantInternalFrequenciesSplitEnum;
  sequencingType: SequencingType;
};

async function fetchFrequenciesBySplit(input: MyNetworkInput, tenant: string): Promise<VariantInternalFrequencies> {
  const response = await variantsApi.getGermlineVariantInternalFrequencies(
    tenant,
    input.locusId,
    input.split,
    input.sequencingType,
  );
  return response.data;
}

async function fetchGlobalFrequencies(
  locusId: string,
  sequencingType: SequencingType,
  tenant: string,
): Promise<InternalFrequencies> {
  const response = await variantsApi.getGermlineVariantGlobalInternalFrequencies(tenant, locusId, sequencingType);
  return response.data;
}

function useGlobalFrequencies(locusId: string, sequencingType: SequencingType, tenant: string) {
  return useSWRImmutable<InternalFrequencies, ApiError, string>(
    `global-frequencies-${locusId}-${sequencingType}`,
    () => fetchGlobalFrequencies(locusId, sequencingType, tenant),
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    },
  );
}

const SEQUENCING_TYPES: SequencingType[] = [
  GetGermlineVariantInternalFrequenciesSequencingTypeEnum.Wxs,
  GetGermlineVariantInternalFrequenciesSequencingTypeEnum.Wgs,
];

const TABS_CONFIG = [
  {
    key: 'primary_condition_tab',
    value: GetGermlineVariantInternalFrequenciesSplitEnum.PrimaryCondition,
    tableId: 'primary-condition-table',
  },
  {
    key: 'project_tab',
    value: GetGermlineVariantInternalFrequenciesSplitEnum.Project,
    tableId: 'project-table',
  },
  {
    key: 'analysis_tab',
    value: GetGermlineVariantInternalFrequenciesSplitEnum.Analysis,
    tableId: 'analysis-table',
  },
];

function MyNetworkCard() {
  const { t } = useI18n();
  const { tenant } = useTenant();
  const params = useParams<{ locusId: string }>();
  const wxsGlobal = useGlobalFrequencies(
    params.locusId!,
    GetGermlineVariantInternalFrequenciesSequencingTypeEnum.Wxs,
    tenant,
  );
  const wgsGlobal = useGlobalFrequencies(
    params.locusId!,
    GetGermlineVariantInternalFrequenciesSequencingTypeEnum.Wgs,
    tenant,
  );

  const [activeTab, setActiveTab] = useState<string>(GetGermlineVariantInternalFrequenciesSplitEnum.PrimaryCondition);
  const [selectedSequencingType, setSelectedSequencingType] = useState<SequencingType>();

  const isGlobalLoading = wxsGlobal.isLoading || wgsGlobal.isLoading;
  const globalFrequenciesByType: Record<SequencingType, InternalFrequencies | undefined> = {
    [GetGermlineVariantInternalFrequenciesSequencingTypeEnum.Wxs]: wxsGlobal.data,
    [GetGermlineVariantInternalFrequenciesSequencingTypeEnum.Wgs]: wgsGlobal.data,
  };
  const isAvailable = (type: SequencingType) => (globalFrequenciesByType[type]?.pc_all ?? 0) > 0;
  const hasNoSequencingType = !isGlobalLoading && !SEQUENCING_TYPES.some(isAvailable);
  const defaultSequencingType =
    !isAvailable(GetGermlineVariantInternalFrequenciesSequencingTypeEnum.Wxs) &&
    isAvailable(GetGermlineVariantInternalFrequenciesSequencingTypeEnum.Wgs)
      ? GetGermlineVariantInternalFrequenciesSequencingTypeEnum.Wgs
      : GetGermlineVariantInternalFrequenciesSequencingTypeEnum.Wxs;
  const sequencingType = selectedSequencingType ?? defaultSequencingType;
  const globalFrequencies = globalFrequenciesByType[sequencingType];
  const sequencingTypeLabel = t(`variant_entity.frequency.my_network.sequencing_type.${sequencingType}`);
  const columns = useMemo(() => getMyNetworkColumns(t, activeTab, sequencingType), [t, activeTab, sequencingType]);

  const { data } = useSWR<VariantInternalFrequencies, ApiError>(
    isGlobalLoading || hasNoSequencingType
      ? null
      : {
          locusId: params.locusId!,
          split: activeTab as GetGermlineVariantInternalFrequenciesSplitEnum,
          sequencingType,
        },
    (input: MyNetworkInput) => fetchFrequenciesBySplit(input, tenant),
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    },
  );

  return (
    <Card>
      <CardHeader className="sm:gap-x-20">
        <CardTitle>{t('variant_entity.frequency.my_network.title')}</CardTitle>
        <CardDescription>{t('variant_entity.frequency.my_network.description')}</CardDescription>
        <CardAction className="flex flex-row items-center gap-10">
          {!isGlobalLoading && (
            <>
              <div className="flex items-center gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="font-semibold underline decoration-dotted decoration-auto">
                      {t('variant_entity.frequency.my_network.global_frequencies.all_patients')}
                      <span className="sr-only">
                        {t(
                          `variant_entity.frequency.my_network.global_frequencies.all_patients_tooltip_${sequencingType}`,
                        )}
                      </span>
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    {t(`variant_entity.frequency.my_network.global_frequencies.all_patients_tooltip_${sequencingType}`)}
                  </TooltipContent>
                </Tooltip>
                <span className="font-mono">
                  {globalFrequencies?.pc_all}/{globalFrequencies?.pn_all}
                  {` (${toPercentage(globalFrequencies?.pf_all, 0)})`}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="font-semibold underline decoration-dotted decoration-auto">
                      {t('variant_entity.frequency.my_network.global_frequencies.affected')}
                      <span className="sr-only">
                        {t('variant_entity.frequency.my_network.global_frequencies.affected_tooltip', {
                          sequencingType: sequencingTypeLabel,
                        })}
                      </span>
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    {t('variant_entity.frequency.my_network.global_frequencies.affected_tooltip', {
                      sequencingType: sequencingTypeLabel,
                    })}
                  </TooltipContent>
                </Tooltip>
                <span className="font-mono">
                  {globalFrequencies?.pc_affected}/{globalFrequencies?.pn_affected}
                  {` (${toPercentage(globalFrequencies?.pf_affected, 0)})`}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="font-semibold underline decoration-dotted decoration-auto">
                      {t('variant_entity.frequency.my_network.global_frequencies.non_affected')}
                      <span className="sr-only">
                        {t('variant_entity.frequency.my_network.global_frequencies.non_affected_tooltip', {
                          sequencingType: sequencingTypeLabel,
                        })}
                      </span>
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    {t('variant_entity.frequency.my_network.global_frequencies.non_affected_tooltip', {
                      sequencingType: sequencingTypeLabel,
                    })}
                  </TooltipContent>
                </Tooltip>
                <span className="font-mono">
                  {globalFrequencies?.pc_non_affected}/{globalFrequencies?.pn_non_affected}
                  {` (${toPercentage(globalFrequencies?.pf_non_affected, 0)})`}
                </span>
              </div>
            </>
          )}
          <Tabs
            variant="primary"
            value={sequencingType}
            onValueChange={value => setSelectedSequencingType(value as SequencingType)}
          >
            <TabsList className="h-7" aria-label={t('a11y.my_network.sequencing_type')}>
              {SEQUENCING_TYPES.map(type => {
                const isDisabled = !isGlobalLoading && !isAvailable(type);
                return (
                  <Tooltip key={type}>
                    <TooltipTrigger asChild>
                      <span className="inline-flex flex-1">
                        <TabsTrigger value={type} disabled={isDisabled} data-cy={`my-network-sequencing-type-${type}`}>
                          {t(`variant_entity.frequency.my_network.sequencing_type.${type}`)}
                        </TabsTrigger>
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      {isDisabled
                        ? t(`variant_entity.frequency.my_network.sequencing_type.${type}_disabled_tooltip`)
                        : t(`variant_entity.frequency.my_network.sequencing_type.${type}_tooltip`)}
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </TabsList>
          </Tabs>
        </CardAction>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger
              key="primary_condition_tab"
              value={GetGermlineVariantInternalFrequenciesSplitEnum.PrimaryCondition}
              disabled={hasNoSequencingType}
            >
              {t('variant_entity.frequency.my_network.primary_condition')}
            </TabsTrigger>
            <TabsTrigger
              key="project_tab"
              value={GetGermlineVariantInternalFrequenciesSplitEnum.Project}
              disabled={hasNoSequencingType}
            >
              {t('variant_entity.frequency.my_network.project')}
            </TabsTrigger>
            <TabsTrigger
              key="analysis_tab"
              value={GetGermlineVariantInternalFrequenciesSplitEnum.Analysis}
              disabled={hasNoSequencingType}
            >
              {t('variant_entity.frequency.my_network.analysis')}
            </TabsTrigger>
          </TabsList>

          {TABS_CONFIG.map(tab => (
            <TabsContent key={tab.key} value={tab.value}>
              <DataTable
                id={tab.key}
                columns={columns}
                defaultColumnSettings={myNetworkDefaultSettings}
                data={data?.split_rows || []}
                loadingStates={{
                  total: false,
                  list: false,
                }}
                total={data?.split_rows?.length}
                pagination={{ type: 'hidden' }}
                tableIndexResultPosition="hidden"
                emptyState={
                  hasNoSequencingType ? (
                    <Empty title={t('common.table.no_result')} iconType="custom" icon={SearchIcon} size="mini" />
                  ) : undefined
                }
              />
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}

export default MyNetworkCard;
