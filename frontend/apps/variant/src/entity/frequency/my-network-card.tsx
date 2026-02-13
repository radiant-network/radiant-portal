import { useState } from 'react';
import { useParams } from 'react-router';
import useSWR from 'swr';
import useSWRImmutable from 'swr/immutable';

import {
  ApiError,
  GetGermlineVariantInternalFrequenciesSplitEnum,
  InternalFrequencies,
  VariantInternalFrequencies,
} from '@/api/index';
import DataTable from '@/components/base/data-table/data-table';
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/base/shadcn/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/base/shadcn/tabs';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/base/shadcn/tooltip';
import { useI18n } from '@/components/hooks/i18n';
import { toPercentage } from '@/components/lib/number-format';
import { variantsApi } from '@/utils/api';

import { getMyNetworkColumns, myNetworkDefaultSettings } from './table-settings';

type MyNetworkInput = {
  locusId: string;
  split: GetGermlineVariantInternalFrequenciesSplitEnum;
};

async function fetchFrequenciesBySplit(input: MyNetworkInput): Promise<VariantInternalFrequencies> {
  const response = await variantsApi.getGermlineVariantInternalFrequencies(input.locusId, input.split);
  return response.data;
}

async function fetchGlobalFrequencies(locusId: string): Promise<InternalFrequencies> {
  const response = await variantsApi.getGermlineVariantGlobalInternalFrequencies(locusId);
  return response.data;
}

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
  const params = useParams<{ locusId: string }>();
  const [activeTab, setActiveTab] = useState<string>(GetGermlineVariantInternalFrequenciesSplitEnum.PrimaryCondition);

  const { data: globalFrequencies, isLoading: isGlobalLoading } = useSWRImmutable<
    InternalFrequencies,
    ApiError,
    string
  >(`global-frequencies-${params.locusId}`, () => fetchGlobalFrequencies(params.locusId!), {
    revalidateOnFocus: false,
    shouldRetryOnError: false,
  });

  const { data } = useSWR<VariantInternalFrequencies, ApiError, MyNetworkInput>(
    { locusId: params.locusId!, split: activeTab as GetGermlineVariantInternalFrequenciesSplitEnum },
    fetchFrequenciesBySplit,
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    },
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('variant_entity.frequency.my_network.title')}</CardTitle>
        <CardDescription>{t('variant_entity.frequency.my_network.description')}</CardDescription>
        {!isGlobalLoading && (
          <CardAction className="flex flex-row items-center gap-10">
            <div className="flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger>
                  <span className="font-semibold underline decoration-dotted decoration-auto">
                    {t('variant_entity.frequency.my_network.global_frequencies.all_patients')}
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  {t('variant_entity.frequency.my_network.global_frequencies.all_patients_tooltip')}
                </TooltipContent>
              </Tooltip>
              <span>
                {globalFrequencies?.pc_all}/{globalFrequencies?.pn_all}
                {` (${toPercentage(globalFrequencies?.pf_all, 0)})`}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger>
                  <span className="font-semibold underline decoration-dotted decoration-auto">
                    {t('variant_entity.frequency.my_network.global_frequencies.affected')}
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  {t('variant_entity.frequency.my_network.global_frequencies.affected_tooltip')}
                </TooltipContent>
              </Tooltip>
              <span>
                {globalFrequencies?.pc_affected}/{globalFrequencies?.pn_affected}
                {` (${toPercentage(globalFrequencies?.pf_affected, 0)})`}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger>
                  <span className="font-semibold underline decoration-dotted decoration-auto">
                    {t('variant_entity.frequency.my_network.global_frequencies.non_affected')}
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  {t('variant_entity.frequency.my_network.global_frequencies.non_affected_tooltip')}
                </TooltipContent>
              </Tooltip>
              <span>
                {globalFrequencies?.pc_non_affected}/{globalFrequencies?.pn_non_affected}
                {` (${toPercentage(globalFrequencies?.pf_non_affected, 0)})`}
              </span>
            </div>
          </CardAction>
        )}
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger
              key="primary_condition_tab"
              value={GetGermlineVariantInternalFrequenciesSplitEnum.PrimaryCondition}
            >
              {t('variant_entity.frequency.my_network.primary_condition')}
            </TabsTrigger>
            <TabsTrigger key="project_tab" value={GetGermlineVariantInternalFrequenciesSplitEnum.Project}>
              {t('variant_entity.frequency.my_network.project')}
            </TabsTrigger>
            <TabsTrigger key="analysis_tab" value={GetGermlineVariantInternalFrequenciesSplitEnum.Analysis}>
              {t('variant_entity.frequency.my_network.analysis')}
            </TabsTrigger>
          </TabsList>

          {TABS_CONFIG.map(tab => (
            <TabsContent key={tab.key} value={tab.value}>
              <DataTable
                id={tab.key}
                columns={getMyNetworkColumns(t, activeTab)}
                defaultColumnSettings={myNetworkDefaultSettings}
                data={data?.split_rows || []}
                loadingStates={{
                  total: false,
                  list: false,
                }}
                total={data?.split_rows?.length}
                pagination={{ type: 'hidden' }}
                tableIndexResultPosition="hidden"
              />
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}

export default MyNetworkCard;
